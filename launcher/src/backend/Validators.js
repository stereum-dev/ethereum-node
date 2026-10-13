import { isObolDVTService } from "@/share/ObolDVTServices";
import * as log from "electron-log";
import YAML from "yaml";
import { validatorPorts } from "./ethereum-services/ServicePort.js";
import { StringUtils } from "./StringUtils.js";
import { parseKeystore, checkSlashingProtection, hasDoppelgangerProtection, GENESIS_ROOTS } from "@/share/keystores";
import { minimalSlashingProtection, readSlashingProtection } from "@/share/slashingProtection";
import { exitBlocker, beaconBlocker, checkSignedExit, prysmExitEpoch, PRYSM_EXIT_ISSUE } from "@/share/exits";
import {
  SIGNER_PATH_KEYS,
  normalizeSignerUrl,
  prysmSignerFlags,
  prysmSignerPlan,
  withPrysmSignerFlags,
  tekuSignerPlan,
  withTekuSignerFlag,
} from "@/share/remoteKeys";
import { ServiceVolume } from "./ethereum-services/ServiceVolume.js";
import { GROUP_ID } from "@/share/keyGroups";
import { csmQueueMap } from "@/share/validatorStatus";
import { chainClock, nextPeriodStart, attestationSummary, syncSummary } from "@/share/validatorDuties";
import { getSigningKeysWithQueueInfo } from "./web3/CSM.js";

// Validator clients that hold keystores themselves (keymanager API)
const KEYSTORE_CLIENTS = [
  "LighthouseValidatorService",
  "PrysmValidatorService",
  "NimbusValidatorService",
  "TekuValidatorService",
  "LodestarValidatorService",
];
const PUBKEY = /^0x[0-9a-f]{96}$/;
const STATES_CHUNK = 500;
const STATES_MARKER = "=====STEREUM_VALIDATOR_STATES";
const ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const KEYMANAGER_BATCH = 200;
// keys per DELETE: large deletes made validator clients run out of memory (curl exit 52), and each answer
// carries its keys' full signing history (~120 KB per key after 4 days, ~10 MB after a year)
const REMOVE_CHUNK = 20;
const SLASHING_DIR = "/etc/stereum/slashing-protection";
// keystores per import request: the client decrypts each one, which is slow for many at once
const IMPORT_CHUNK = 50;
// keystore and password bytes per import request: the request goes out inside one SSH command, which the
// server's shell takes as a single argument of at most 128 KB (curl's escaping adds about a quarter)
const IMPORT_BYTES = 60000;
// keys signed and broadcast per exec pair
const EXIT_CHUNK = 100;
const HTTP_MARKER = "=====STEREUM_HTTP";
const HTTP_WRITE_OUT = `write-out = "\\n${HTTP_MARKER} %{http_code}\\n"`;
// remote keys per POST /eth/v1/remotekeys
const REMOTE_IMPORT_CHUNK = 100;
// a client restarted with remote signer flags is polled until its keymanager API answers
const RESTART_READY_TIMEOUT_MS = 90000;
const RESTART_POLL_MS = 5000;
const PRYSM_WALLETS = "/opt/app/data/wallets";
const KEYS_FILE = "/etc/stereum/keys.yaml";
const KEYS_MARKER = "=====STEREUM_KEYS";
// bytes per exec: sshd hands the whole command to the shell as one argv string, capped at 128 KiB on Linux
const KEYS_CHUNK = 65536;
const KEY_FIELDS = ["keyName", "groupName", "groupID", "validatorClientID"];
const KEY_PATCH_MAX = 50000;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const INDEX = /^\d{1,12}$/;
const BEACON_MARKER = "=====STEREUM_BEACON_BATCH";
const INDEX_CHUNK = 1000;
// bytes per beacon batch exec: sshd runs it as one sh -c argument, and Linux caps one argument at 128 KiB
const EXEC_BUDGET = 64 * 1024;
const MAX_SLOTS = 64;
// a sync committee has 512 members
const SYNC_COMMITTEE_SIZE = 512;
const CSM_CACHE_MS = 5 * 60000;
const UNSUPPORTED = [404, 405, 501];

// lowercased, unique and valid public keys, so nothing else reaches a command
const cleanKeys = (list) => [...new Set((list || []).map((p) => String(p).toLowerCase()))].filter((p) => PUBKEY.test(p));
// unique validator indices as strings, only digits reach a command
const cleanIndices = (list) => [...new Set((Array.isArray(list) ? list : []).map((i) => String(i)))].filter((i) => INDEX.test(i));
const epochOrSlot = (x) => Number.isSafeInteger(x) && x >= 0;
const chunked = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
// every answer of a kind is 404/405/501 without data: the beacon node does not serve that endpoint
const allUnsupported = (answers) => answers.length > 0 && answers.every((a) => UNSUPPORTED.includes(a.status) && !a.body?.data);

// Backend of the validators page (the staking page rebuild). It works on top of Monitoring so it
// shares its service snapshot, beacon resolution and DV key lookup instead of reading them again.
// "1 key", "2 keys": task names read like the page
const count = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export class Validators {
  constructor(monitoring) {
    this.monitoring = monitoring;
    this.nodeConnection = monitoring.nodeConnection;
    this.specByBase = {};
  }

  // per-server caches: a beacon on the same local port of another server has another chain
  reset() {
    this.specByBase = {};
    this.csmCache = null;
  }

  // one CSM lookup at a time, shared with the old staking page: two runs would close each other's RPC tunnels
  csmSigningKeys() {
    this.csmPromise ??= getSigningKeysWithQueueInfo(this.monitoring).finally(() => (this.csmPromise = null));
    return this.csmPromise;
  }

  /**
   * One holder per key-holding service, with the role that decides what its keys are:
   * - validator: a validator client with its own keystores
   * - share: a validator client behind Charon/Pluto, its keys are shares and not on chain
   * - distributed: Charon/Pluto, holding the cluster's distributed validator keys
   * - ssv: an SSV node, its validators come from the SSV network
   * - signer: Web3Signer, holding keys other validator clients use remotely
   */
  static classifyHolders(serviceInfos = []) {
    return serviceInfos
      .map((info) => {
        const base = { id: info.config?.serviceID, service: info.service, network: info.config?.network, state: info.state };
        if (isObolDVTService(info.service)) return { ...base, role: "distributed" };
        if (info.service === "SSVNetworkService") return { ...base, role: "ssv" };
        if (info.service === "Web3SignerService") return { ...base, role: "signer" };
        if (!KEYSTORE_CLIENTS.includes(info.service)) return null;
        const dvt = (info.config?.dependencies?.consensusClients || []).find((d) => isObolDVTService(d.service));
        // only to explain Prysm's signer mode in the UI, the backend checks again before writing
        if (info.service === "PrysmValidatorService") base.signerUrl = prysmSignerFlags(info.config?.command).url;
        return dvt ? { ...base, role: "share", dvtVia: dvt.id } : { ...base, role: "validator" };
      })
      .filter((holder) => holder?.id);
  }

  async getValidatorHolders() {
    return Validators.classifyHolders(await this.monitoring.getServiceInfos());
  }

  /**
   * Keys of one holder: [{ pubkey, remote }]. Read straight from the client (or the cluster lock /
   * SSV network for DVT holders). report: a "Listing Keys" task with every answer, as the staking page
   * had, so users can send it in; off for the listings inside other tasks.
   */
  async listHolderKeys(serviceID, { report = false } = {}) {
    const ref = report ? StringUtils.createRandomString() : null;
    const subtask = (name, ok, data) => ref && this.nodeConnection.taskManager?.otherTasksHandler(ref, name, ok, data);
    if (ref) this.nodeConnection.taskManager?.otherTasksHandler(ref, "Listing Keys");
    try {
      const holder = (await this.getValidatorHolders()).find((h) => h.id === serviceID);
      if (!holder) throw new Error("no validator service " + serviceID);
      const vam = this.monitoring.validatorAccountManager;

      if (holder.role === "distributed" || holder.role === "ssv") {
        const dvs = await vam.getDVTKeys(serviceID);
        const keys = dvs.map((dv) => ({
          pubkey: (holder.role === "distributed" ? dv.distributed_public_key : "0x" + dv.public_key).toLowerCase(),
          remote: false,
        }));
        subtask(
          holder.role === "distributed" ? "Read cluster lock" : "Read SSV validators",
          true,
          `${keys.length} keys\n` + keys.map((k) => k.pubkey).join("\n")
        );
        return { code: 0, keys };
      }

      const client = await this.nodeConnection.readServiceConfiguration(serviceID);
      // Prysm answers an error for keystores in remote signer mode and for remote keys in local mode
      const prysm = client.service === "PrysmValidatorService";
      const prysmRemote = prysm && !!prysmSignerFlags(client.command).url;
      const keystores = prysmRemote ? [] : await this.keymanagerList(vam, client, "/eth/v1/keystores", subtask, { noWallet: prysm });
      // a new Prysm has no wallet until the first import creates it: no keys, not an error
      const walletMissing = keystores === null;
      const keys = (keystores ?? []).map((k) => ({ pubkey: k.validating_pubkey.toLowerCase(), remote: !!k.readonly }));
      if (holder.role !== "signer" && (!prysm || prysmRemote)) {
        for (const k of await this.keymanagerList(vam, client, "/eth/v1/remotekeys", subtask)) {
          const pubkey = k.pubkey.toLowerCase();
          const url = typeof k.url === "string" && k.url ? { url: k.url } : {};
          // Lighthouse lists Web3Signer keys as readonly keystores too
          const existing = keys.find((key) => key.pubkey === pubkey);
          if (existing) Object.assign(existing, url);
          else keys.push({ pubkey, remote: true, ...url });
        }
      }
      const remote = keys.filter((k) => k.remote).length;
      subtask(
        "Result",
        true,
        walletMissing
          ? "0 keys: Prysm has no wallet yet, the first import creates it"
          : `${keys.length} keys: ${keys.length - remote} local, ${remote} remote`
      );
      return { code: 0, keys, ...(walletMissing ? { walletMissing } : {}) };
    } catch (err) {
      log.error("Listing validator keys of " + serviceID + " failed: ", err);
      subtask("Result", false, String(err?.message || err));
      return { code: 1, info: String(err?.message || err), keys: [] };
    } finally {
      if (ref) this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  /**
   * Fee recipient a validator client uses for one key, read without a task panel entry since the
   * drawer asks every time a key is opened. Returns { code, address } or { code, info }.
   */
  async getFeeRecipient(serviceID, pubkey) {
    try {
      if (!PUBKEY.test(String(pubkey).toLowerCase())) throw new Error("invalid public key");
      const client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.monitoring.validatorAccountManager.keymanagerAPI(client, "GET", `/eth/v1/validator/${pubkey}/feerecipient`);
      const data = Validators.parseJson(result.stdout);
      if (!data?.data?.ethaddress) throw new Error(data?.message || result.stderr || "no fee recipient returned");
      return { code: 0, address: data.data.ethaddress };
    } catch (err) {
      log.error("Reading the fee recipient of " + pubkey + " failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  // Where and how a validator client's keymanager API is reached: { base, token, tls, curlTag }
  async keymanagerTarget(serviceID) {
    const client = await this.nodeConnection.readServiceConfiguration(serviceID);
    const token = await this.monitoring.validatorAccountManager.getApiToken(client);
    const curlTag = await this.nodeConnection.ensureCurlImage();
    const tls = client.service.includes("Teku");
    const base = `${tls ? "https" : "http"}://stereum-${client.id}:${validatorPorts[client.service]}`;
    return { base, token, tls, curlTag };
  }

  /**
   * Many keymanager requests whose answers are needed, in KEYMANAGER_BATCH requests per exec with the
   * token only in the stdin config. Returns [{ status, body, raw, method, url }] in request order.
   */
  async keymanagerCalls(serviceID, requests) {
    const { base, token, tls, curlTag } = await this.keymanagerTarget(serviceID);
    const prefix = `docker run --rm -i --network=stereum curlimages/curl:${curlTag}`;
    const results = [];
    for (let i = 0; i < requests.length; i += KEYMANAGER_BATCH) {
      const batch = requests.slice(i, i + KEYMANAGER_BATCH);
      const blocks = batch.map((r) => Validators.curlBlock(base, token, tls, r, [HTTP_WRITE_OUT]));
      const answers = await this.curlConfigRun(prefix, blocks);
      results.push(...answers.map((a, j) => ({ ...a, method: batch[j].method, url: base + batch[j].path })));
    }
    return results;
  }

  // Run curl config blocks (built with HTTP_WRITE_OUT) read from stdin, so nothing goes on argv
  async curlConfigRun(prefix, blocks) {
    const result = await this.nodeConnection.sshService.exec(`${prefix} -K - <<'=====CURLCFG'\n${blocks.join("\nnext\n")}\n=====CURLCFG`);
    return Validators.splitMarked(result.stdout, blocks.length);
  }

  // Output of HTTP_WRITE_OUT requests -> [{ status, body, raw }] in order; curl prints 000 for a failed transfer
  static splitMarked(stdout, count) {
    const text = String(stdout ?? "");
    const marker = new RegExp(`\\n?${HTTP_MARKER} (\\d+)(?:\\n|$)`, "g");
    const results = [];
    let last = 0;
    let match;
    while (results.length < count && (match = marker.exec(text)) !== null) {
      const body = text.slice(last, match.index).trim();
      results.push({ status: parseInt(match[1]) || 0, body: body ? Validators.parseJson(body) : null, raw: body });
      last = marker.lastIndex;
    }
    while (results.length < count) results.push({ status: 0, body: null, raw: "" });
    return results;
  }

  // Config file lines for one keymanager request, read by curl from stdin
  static curlBlock(base, token, tls, { method, path, body }, extra = []) {
    const value = (v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    return [
      `url = ${value(base + path)}`,
      `request = ${value(method)}`,
      // only with a body: Lodestar refuses a JSON content type without one (DELETE answers 500)
      body ? `header = "Content-Type: application/json"` : "",
      token ? `header = ${value("Authorization: Bearer " + token)}` : "",
      body ? `data = ${value(JSON.stringify(body))}` : "",
      "silent",
      tls ? "insecure" : "",
      ...extra,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // One keymanager request whose answer is needed, with the token passed on stdin: { status, rc, body, raw, stderr, method, url }
  async keymanagerRequest(serviceID, request) {
    const { base, token, tls, curlTag } = await this.keymanagerTarget(serviceID);
    const block = Validators.curlBlock(base, token, tls, request, [`write-out = "\\n%{http_code}"`]);
    return { ...(await this.curlRequest(block, curlTag)), method: request.method, url: base + request.path };
  }

  // One curl config block (ending with write-out "\n%{http_code}") run from the stereum network, read from stdin
  async curlRequest(block, curlTag = null) {
    const tag = curlTag ?? (await this.nodeConnection.ensureCurlImage());
    const result = await this.nodeConnection.sshService.exec(
      `docker run --rm -i --network=stereum curlimages/curl:${tag} -K - <<'=====KEYMANAGER'\n${block}\n=====KEYMANAGER`
    );
    const lines = String(result.stdout ?? "")
      .trimEnd()
      .split("\n");
    const status = parseInt(lines.pop()) || 0;
    const raw = lines.join("\n");
    return { status, rc: result.rc, body: Validators.parseJson(raw), raw, stderr: result.stderr };
  }

  // Why a curl request failed, from curl's exit code or the answer
  static curlFailure(rc, status, body, stderr = "") {
    if (Validators.curlExitReason(rc)) return Validators.curlExitReason(rc);
    if (body?.message) return body.message;
    // no status at all: the request never ran (e.g. the SSH command failed), say why
    return status ? `HTTP ${status}` : String(stderr ?? "").trim() || `no answer (rc ${rc})`;
  }

  // [start, end) ranges of keystores per import request, by count and by size
  static importChunks(keystores, passwords) {
    const chunks = [];
    let start = 0;
    let bytes = 0;
    keystores.forEach((keystore, i) => {
      const size = String(keystore).length + String(passwords[i] ?? "").length;
      if (i > start && (i - start >= IMPORT_CHUNK || bytes + size > IMPORT_BYTES)) {
        chunks.push([start, i]);
        start = i;
        bytes = 0;
      }
      bytes += size;
    });
    if (keystores.length) chunks.push([start, keystores.length]);
    return chunks;
  }

  // curl's exit code in words, null for codes without a known meaning
  static curlExitReason(rc) {
    if (rc === 6) return "host not found";
    if (rc === 7) return "connection refused";
    if (rc === 28) return "timed out";
    if ([35, 51, 58, 60].includes(rc)) return "TLS error";
    if (rc === 52) return "validator client ran out of memory";
    return null;
  }

  // Task panel text for one API answer: request line, HTTP status and the answer as received (never the request body, it holds secrets)
  static answerText({ method, url, status, rc, body, raw, stderr } = {}) {
    const lines = [`${method} ${url}`];
    lines.push(status ? `HTTP ${status}` : `no answer${rc ? `: ${Validators.curlExitReason(rc) ?? "curl error"} (curl exit ${rc})` : ""}`);
    if (String(stderr ?? "").trim()) lines.push("stderr: " + String(stderr).trim());
    const answer = body !== null && body !== undefined ? JSON.stringify(body, null, 2) : String(raw ?? "").trim();
    lines.push(answer ? "answer:\n" + answer : "answer: (empty)");
    return lines.join("\n");
  }

  // One line per key result: "pubkey: status - message"
  static keyLines(results) {
    return results.map((r) => `${r.pubkey}: ${r.status}${r.message ? " - " + r.message : ""}`).join("\n");
  }

  // Count per status, e.g. "9 imported, 1 duplicate"
  static countText(results) {
    const counts = {};
    for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return Object.entries(counts)
      .map(([status, n]) => `${n} ${status}`)
      .join(", ");
  }

  // Closing subtask text: the counts, then the keys that did not make it
  static summaryText(results, isFailure) {
    const failed = results.filter(isFailure);
    return Validators.countText(results) + (failed.length ? "\n\nfailed:\n" + Validators.keyLines(failed) : "");
  }

  /**
   * Public keys a Web3Signer holds, read from the stereum network like the validator client will:
   * signerId for a Web3Signer on this node, url for any other. Returns { code, url, keys } or { code, info }.
   */
  async listSignerKeys({ signerId = null, url = null } = {}) {
    try {
      let base;
      if (signerId) {
        const holder = (await this.getValidatorHolders()).find((h) => h.id === signerId);
        if (holder?.role !== "signer") return { code: 1, info: "no Web3Signer " + signerId };
        base = `http://stereum-${holder.id}:9000`;
      } else {
        const normalized = normalizeSignerUrl(url);
        if (normalized.error) return { code: 1, info: "invalid url: " + normalized.error };
        base = normalized.url;
      }
      // the public keys endpoint needs no token and works for local and remote signers alike; no insecure, like the client
      const block = Validators.curlBlock(base, null, false, { method: "GET", path: SIGNER_PATH_KEYS }, [
        `write-out = "\\n%{http_code}"`,
        "connect-timeout = 5",
        "max-time = 20",
        `proto = "=http,https"`,
      ]);
      const { status, rc, body } = await this.curlRequest(block);
      // the url still comes back, so keys can be added by hand when the list cannot be read
      if (status !== 200 || !Array.isArray(body)) return { code: 2, info: Validators.curlFailure(rc, status, body), url: base };
      const keys = [...new Set(body.map((k) => String(k).toLowerCase()))].filter((k) => PUBKEY.test(k));
      return { code: 0, url: base, keys };
    } catch (err) {
      log.error("Listing the signer keys failed: ", err);
      return { code: 2, info: String(err?.message || err) };
    }
  }

  /**
   * Remove keys from a validator client. local: keystores (their slashing protection is exported),
   * remote: remote keys. Deleted in chunks; the slashing protection of all chunks is merged into one
   * EIP-3076 file, returned and also kept on the node so it is not lost if the download is skipped.
   * Returns { code, results: { pubkey: status }, slashingProtection, savedTo } or { code, info }.
   */
  async removeKeys(serviceID, { local = [], remote = [] } = {}) {
    const localKeys = cleanKeys(local);
    const remoteKeys = cleanKeys(remote);
    if (!localKeys.length && !remoteKeys.length) return { code: 1, info: "no valid keys" };

    const ref = StringUtils.createRandomString();
    const task = `Removing ${count(localKeys.length + remoteKeys.length, "key")}`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    const results = {};
    let interchange = null;
    try {
      const lines = [];
      const isFailure = (r) => String(r.status).startsWith("error");
      for (const [keys, path, kind] of [
        [localKeys, "/eth/v1/keystores", "keystores"],
        [remoteKeys, "/eth/v1/remotekeys", "remote keys"],
      ]) {
        for (let i = 0; i < keys.length; i += REMOVE_CHUNK) {
          const chunk = keys.slice(i, i + REMOVE_CHUNK);
          const answer = await this.keymanagerRequest(serviceID, { method: "DELETE", path, body: { pubkeys: chunk } });
          const { body } = answer;
          let chunkLines;
          if (!Array.isArray(body?.data)) {
            const reason = Validators.curlFailure(answer.rc, answer.status, body, answer.stderr);
            chunk.forEach((key) => (results[key] = "error: " + reason));
            chunkLines = chunk.map((pubkey) => ({ pubkey, status: results[pubkey] }));
          } else {
            // the answer lists one status per requested key, in request order
            chunk.forEach((key, j) => (results[key] = body.data[j]?.status ?? "error"));
            chunkLines = chunk.map((pubkey, j) => ({ pubkey, status: results[pubkey], message: body.data[j]?.message }));
            // minimal right away: full histories of thousands of keys outgrow any string, file and SSH command
            if (body.slashing_protection) {
              interchange = Validators.mergeInterchange(interchange, minimalSlashingProtection(body.slashing_protection, chunk));
            }
          }
          lines.push(...chunkLines);
          // the slashing protection is saved and downloaded on its own, here it would only bury the answer
          const shown = body?.slashing_protection ? { ...answer, body: { ...body, slashing_protection: "(see the saved file)" } } : answer;
          this.nodeConnection.taskManager?.otherTasksHandler(
            ref,
            `Removed ${i + chunk.length} of ${keys.length}${kind === "remote keys" ? " remote" : ""}`,
            Array.isArray(body?.data) && !chunkLines.some(isFailure),
            Validators.keyLines(chunkLines) + "\n\n" + Validators.answerText(shown)
          );
        }
      }

      let savedTo = null;
      if (interchange) {
        savedTo = `${SLASHING_DIR}/${serviceID}-${Date.now()}.json`;
        // a full export is megabytes: written in pieces, one line per entry, since one SSH command cannot carry it
        let write = await this.nodeConnection.sshService.exec(`mkdir -p ${SLASHING_DIR}`);
        for (const cmd of Validators.keysYamlCommands(JSON.stringify(interchange, null, 1), savedTo)) {
          if (write.rc != 0) break;
          write = await this.nodeConnection.sshService.exec(cmd);
        }
        this.nodeConnection.taskManager?.otherTasksHandler(
          ref,
          "Saved slashing protection",
          write.rc == 0,
          write.rc == 0
            ? `${savedTo}\n${interchange.data?.length ?? 0} validators`
            : `writing ${savedTo} failed (rc ${write.rc}): ${write.stderr || ""}\nthe downloaded copy is the only one`
        );
        if (write.rc != 0) savedTo = null;
      }

      const failed = lines.filter(isFailure);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", !failed.length, Validators.summaryText(lines, isFailure));
      return { code: 0, results, slashingProtection: interchange ? JSON.stringify(interchange, null, 2) : null, savedTo };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err), results };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  /**
   * What the user has to know before keys are imported into a validator client:
   * - alreadyImported: keys this client holds already (the client skips them as duplicates)
   * - onChain: { pubkey: { index, status } } for keys the beacon node knows
   * - live: active keys that attested in the last epoch, so they run somewhere else right now
   * - genesisRoot: to check that a slashing protection file belongs to this chain
   * - doppelganger: whether the client holds new keys back for a few epochs
   * - remoteSigner (with remoteUrl): { mode: "ready" | "switch" | "blocked", reason? }, see prysmSignerPlan
   */
  async prepareImport(serviceID, pubkeys = [], { remoteUrl = null } = {}) {
    try {
      const holder = (await this.getValidatorHolders()).find((h) => h.id === serviceID);
      const roles = remoteUrl ? ["validator"] : ["validator", "signer"];
      if (!holder || !roles.includes(holder.role)) throw new Error("keys cannot be imported into this service");
      const signer = remoteUrl ? normalizeSignerUrl(remoteUrl) : null;
      if (signer?.error) return { code: 1, info: "invalid url: " + signer.error };
      const keys = cleanKeys(pubkeys);

      const info = (await this.monitoring.getServiceInfos()).find((i) => i.config?.serviceID === serviceID);
      const prysm = info?.service === "PrysmValidatorService";
      if (prysm && !signer && prysmSignerFlags(info.config?.command).url) {
        return { code: 1, info: "Prysm runs in remote signer mode and cannot import keystores" };
      }

      const listed = await this.listHolderKeys(serviceID);
      // a failed listing would make Prysm look empty and switch it
      if (prysm && signer && listed.code) throw new Error(listed.info);
      const present = new Set(listed.keys.map((k) => k.pubkey));
      let remoteSigner;
      if (signer) {
        remoteSigner = prysm
          ? prysmSignerPlan({
              command: info.config?.command,
              localCount: listed.keys.filter((k) => !k.remote).length,
              remoteCount: listed.keys.filter((k) => k.remote).length,
              url: signer.url,
            })
          : info?.service === "TekuValidatorService"
            ? tekuSignerPlan(info.config?.command)
            : { mode: "ready" };
      }
      const states = keys.length ? await this.getValidatorStates(keys, serviceID) : { code: 0, byPubkey: {} };
      const beacon = await this.findHolderBeacon(serviceID);
      const genesis = beacon.code ? null : await this.monitoring.queryBeaconApi(beacon.data.url, "/eth/v1/beacon/genesis");

      // liveness of the previous epoch: an attestation there means the key validates somewhere already
      const live = [];
      const activeIndices = Object.values(states.byPubkey ?? {})
        .filter((s) => String(s.status).startsWith("active"))
        .map((s) => String(s.index));
      if (activeIndices.length && states.headSlot && !beacon.code) {
        const epoch = Math.floor(states.headSlot / states.slotsPerEpoch) - 1;
        const res = await this.monitoring.queryBeaconApi(beacon.data.url, `/eth/v1/validator/liveness/${epoch}`, activeIndices, "POST");
        const liveIndices = new Set(
          (res.code ? [] : (res.data.api_reponse?.data ?? [])).filter((l) => l.is_live).map((l) => String(l.index))
        );
        for (const [pubkey, state] of Object.entries(states.byPubkey)) if (liveIndices.has(String(state.index))) live.push(pubkey);
      }

      return {
        code: 0,
        ...(remoteSigner ? { remoteSigner } : {}),
        alreadyImported: keys.filter((k) => present.has(k)),
        onChain: Object.fromEntries(Object.entries(states.byPubkey ?? {}).map(([k, s]) => [k, { index: s.index, status: s.status }])),
        statesKnown: states.code === 0,
        live,
        genesisRoot:
          (genesis && !genesis.code ? genesis.data.api_reponse?.data?.genesis_validators_root : null) ??
          GENESIS_ROOTS[holder.network] ??
          null,
        doppelganger: hasDoppelgangerProtection(info?.service, info?.config?.command),
      };
    } catch (err) {
      log.error("Preparing the key import failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  /**
   * Import keystores (JSON texts) with one password each into a validator client, in chunks.
   * The slashing protection (EIP-3076 text) is checked against the chain before anything is sent.
   * onProgress({ phase: "preparing" | "importing", done, total, chunk, chunks }) follows the requests.
   * Returns { code, results: [{ pubkey, status, message }] } in keystore order, or { code, info }.
   */
  async importKeys(serviceID, keystores = [], passwords = [], slashingProtection = null, onProgress = () => {}) {
    if (!keystores.length || keystores.length !== passwords.length) return { code: 1, info: "every keystore needs a password" };
    const parsed = keystores.map(parseKeystore);
    const broken = parsed.findIndex((p) => p.error);
    if (broken >= 0) return { code: 1, info: `keystore ${broken + 1}: ${parsed[broken].error}` };

    let slashingCheck = null;
    // reduced once to the minimal form, so no chunk ever parses a full export again
    let minimal = null;
    if (slashingProtection) {
      try {
        minimal = readSlashingProtection(slashingProtection);
      } catch (err) {
        return { code: 1, info: "slashing protection rejected: " + String(err?.message || err) };
      }
      const beacon = await this.findHolderBeacon(serviceID);
      const genesis = beacon.code ? null : await this.monitoring.queryBeaconApi(beacon.data.url, "/eth/v1/beacon/genesis");
      const asked = genesis && !genesis.code ? genesis.data.api_reponse?.data?.genesis_validators_root : null;
      const network = asked ? null : (await this.getValidatorHolders()).find((h) => h.id === serviceID)?.network;
      const genesisRoot = asked ?? GENESIS_ROOTS[network];
      if (!genesisRoot) return { code: 1, info: "the chain's genesis could not be read to check the slashing protection" };
      const check = checkSlashingProtection(JSON.stringify(minimal.interchange), { genesisRoot, pubkeys: parsed.map((p) => p.pubkey) });
      if (!check.ok) return { code: 1, info: "slashing protection rejected: " + check.errors.join(", ") };
      const { stats } = minimal;
      slashingCheck = [
        `genesis_validators_root: ${genesisRoot} (${asked ? "from " + beacon.data.url : "known root of " + network})`,
        `covers ${parsed.length - check.missing.length} of ${parsed.length} keys`,
        `${stats.validators} validators, ${stats.attestations} attestations and ${stats.blocks} blocks in the file`,
        `highest attestation target epoch ${stats.maxTarget ?? "-"}, highest block slot ${stats.maxSlot ?? "-"}`,
        ...(check.missing.length ? ["not in the file:", ...check.missing] : []),
      ].join("\n");
    }

    const ref = StringUtils.createRandomString();
    const task = `Importing ${count(keystores.length, "key")}`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    if (slashingCheck) this.nodeConnection.taskManager?.otherTasksHandler(ref, "Checked slashing protection", true, slashingCheck);
    const results = [];
    const isFailure = (r) => r.status === "error";
    try {
      onProgress({ phase: "preparing", done: 0, total: keystores.length });
      await this.initClient(serviceID, ref);
      const chunks = Validators.importChunks(keystores, passwords);
      for (const [n, [start, end]] of chunks.entries()) {
        onProgress({ phase: "importing", done: start, total: keystores.length, chunk: n + 1, chunks: chunks.length });
        const body = { keystores: keystores.slice(start, end), passwords: passwords.slice(start, end) };
        const pubkeys = parsed.slice(start, end).map((p) => p.pubkey);
        if (minimal) body.slashing_protection = minimalSlashingProtection(minimal.interchange, pubkeys);
        const answer = await this.keymanagerRequest(serviceID, { method: "POST", path: "/eth/v1/keystores", body });
        const chunk = pubkeys.map((pubkey, j) => {
          const entry = answer.body?.data?.[j];
          return {
            pubkey,
            status: entry?.status ?? "error",
            message: entry ? (entry.message ?? "") : Validators.curlFailure(answer.rc, answer.status, answer.body, answer.stderr),
          };
        });
        results.push(...chunk);
        const sent = minimal ? `slashing protection: ${JSON.parse(body.slashing_protection).data.length} validators, minimal form\n` : "";
        this.nodeConnection.taskManager?.otherTasksHandler(
          ref,
          `Imported ${end} of ${keystores.length}`,
          answer.status === 200 && !chunk.some(isFailure),
          sent + Validators.keyLines(chunk) + "\n\n" + Validators.answerText(answer)
        );
      }
      const failed = results.filter(isFailure);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", !failed.length, Validators.summaryText(results, isFailure));
      return { code: 0, results };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err), results };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  /**
   * Import remote keys (signed by the Web3Signer at url) into a validator client, in chunks. A Prysm without
   * local keys is switched to remote signer mode and a Teku without signer url gets one, both restarted first.
   * Returns { code, results: [{ pubkey, status, message }], restarted } in key order, or { code, info }.
   */
  async importRemoteKeys(serviceID, pubkeys = [], url) {
    const holder = (await this.getValidatorHolders()).find((h) => h.id === serviceID);
    if (holder?.role !== "validator") return { code: 1, info: "remote keys cannot be imported into this service" };
    const signer = normalizeSignerUrl(url);
    if (signer.error) return { code: 1, info: "invalid url: " + signer.error };
    let keys = cleanKeys(pubkeys);
    if (!keys.length) return { code: 1, info: "no valid keys" };

    const ref = StringUtils.createRandomString();
    const task = `Importing ${count(keys.length, "remote key")}`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    const results = [];
    let restarted = false;
    try {
      await this.initClient(serviceID, ref);
      if (holder.service === "PrysmValidatorService") {
        const client = await this.nodeConnection.readServiceConfiguration(serviceID);
        const listed = await this.listHolderKeys(serviceID);
        if (listed.code) throw new Error(listed.info);
        const plan = prysmSignerPlan({
          command: client.command,
          localCount: listed.keys.filter((k) => !k.remote).length,
          remoteCount: listed.keys.filter((k) => k.remote).length,
          url: signer.url,
        });
        if (plan.mode === "blocked") {
          this.nodeConnection.taskManager?.otherTasksHandler(ref, "Prysm signer blocked", false, plan.reason);
          return { code: 1, info: plan.reason, reason: plan.reason };
        }
        if (plan.mode === "switch") {
          // set first: a switch that fails after the restart still changed the client
          restarted = true;
          await this.switchPrysmToSigner(client, signer.url, ref);
          // without a key file Prysm forgets its remote keys on restart (they can only use this signer)
          const kept = listed.keys.filter((k) => k.remote).map((k) => k.pubkey);
          keys = [...keys, ...cleanKeys(kept).filter((k) => !keys.includes(k))];
        }
      } else if (holder.service === "TekuValidatorService") {
        const client = await this.nodeConnection.readServiceConfiguration(serviceID);
        if (tekuSignerPlan(client.command).mode === "switch") {
          restarted = true;
          client.command = withTekuSignerFlag(client.command, signer.url);
          await this.restartWithCommand(client, "Teku", ref);
        }
      }

      const isFailure = (r) => r.status === "error";
      for (let i = 0; i < keys.length; i += REMOTE_IMPORT_CHUNK) {
        const chunk = keys.slice(i, i + REMOTE_IMPORT_CHUNK);
        const answer = await this.keymanagerRequest(serviceID, {
          method: "POST",
          path: "/eth/v1/remotekeys",
          body: { remote_keys: chunk.map((pubkey) => ({ pubkey, url: signer.url })) },
        });
        // the answer lists one status per requested key, in request order
        const chunkResults = chunk.map((pubkey, j) => {
          const entry = answer.body?.data?.[j];
          return {
            pubkey,
            status: entry ? (entry.status ?? "error") : "error",
            message: entry ? (entry.message ?? "") : Validators.curlFailure(answer.rc, answer.status, answer.body, answer.stderr),
          };
        });
        results.push(...chunkResults);
        this.nodeConnection.taskManager?.otherTasksHandler(
          ref,
          `Imported ${i + chunk.length} of ${keys.length}`,
          answer.status === 200 && !chunkResults.some(isFailure),
          `signer: ${signer.url}\n` + Validators.keyLines(chunkResults) + "\n\n" + Validators.answerText(answer)
        );
      }
      const failed = results.filter(isFailure);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", !failed.length, Validators.summaryText(results, isFailure));
      return { code: 0, results, restarted };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err), results, restarted };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  // A new client has no Prysm wallet, Nimbus API token or Teku API keystore until the first import creates it, as the staking page did
  async initClient(serviceID, ref) {
    const client = (await this.monitoring.serviceManager.readServiceConfigurations()).find((s) => s.id === serviceID);
    if (!client) throw new Error("no validator service " + serviceID);
    await this.monitoring.validatorAccountManager.initWallet(client, ref);
    this.nodeConnection.taskManager?.otherTasksHandler(
      ref,
      "Checked client setup",
      true,
      `${client.service} ${client.id}: wallet and API access ready`
    );
  }

  // Prysm cannot mix local and remote keys and needs the key file flag, or it does not start (v7)
  async switchPrysmToSigner(client, url, ref) {
    const volumes = (client.volumes || []).map((v) => (typeof v === "string" ? ServiceVolume.buildByConfig(v) : v));
    const hostWallets = volumes.find((v) => v?.servicePath === PRYSM_WALLETS)?.destinationPath;
    // a config-derived path, but it still goes into single quotes
    if (!hostWallets || hostWallets.includes("'")) throw new Error("Prysm's wallets volume was not found");
    const touch = await this.nodeConnection.sshService.exec("touch '" + hostWallets + "/remote-keys.txt'");
    if (touch.rc != 0) throw new Error("the remote key file could not be created: " + (touch.stderr || "rc " + touch.rc));

    client.command = withPrysmSignerFlags(client.command, url);
    await this.restartWithCommand(client, "Prysm", ref);
  }

  // Write the changed client config, restart it and wait until its keymanager API answers again
  async restartWithCommand(client, name, ref) {
    await this.nodeConnection.writeServiceConfiguration(client);
    const serviceManager = this.monitoring.serviceManager;
    await serviceManager.manageServiceState(client.id, "stopped");
    await serviceManager.manageServiceState(client.id, "started");

    // instead of a fixed sleep: poll the API
    for (let waited = 0; ; waited += RESTART_POLL_MS) {
      const answer = await this.keymanagerRequest(client.id, { method: "GET", path: "/eth/v1/remotekeys" }).catch(() => null);
      if (answer?.status === 200) break;
      if (waited + RESTART_POLL_MS > RESTART_READY_TIMEOUT_MS) throw new Error(`${name} did not come back with its keymanager API`);
      await new Promise((resolve) => setTimeout(resolve, RESTART_POLL_MS));
    }
    const command = Array.isArray(client.command) ? client.command.join("\n") : String(client.command);
    this.nodeConnection.taskManager?.otherTasksHandler(ref, `Restarted ${name} for signer`, true, "new command:\n" + command);
  }

  /**
   * What an exit of the given keys would do, checked against the chain and the holder's beacon node.
   * Returns { code: 0, role, keys: { pubkey: { index, status, activationEpoch, credentials, dvPubkey?, blocker } },
   * eligible, exportable, blsCredentials, beacon: { base, source, blocker }, currentEpoch, shardCommitteePeriod,
   * secondsPerEpoch, signEpoch, target } or { code, info }. target stays in the backend (stripped in IPC).
   */
  async prepareExit(serviceID, pubkeys = []) {
    try {
      const holders = await this.getValidatorHolders();
      const holder = holders.find((h) => h.id === serviceID);
      // reason picks the modal's translated message, info stays for the log
      if (!holder || !["validator", "share"].includes(holder.role)) {
        return { code: 1, reason: "notAvailable", info: "exit is not available for this service" };
      }
      if (holder.state !== "running") return { code: 1, reason: "notRunning", info: "the validator client is not running" };
      if (holder.role === "share" && holders.find((h) => h.id === holder.dvtVia)?.state !== "running") {
        return { code: 1, reason: "dvtNotRunning", info: "the distributed validator client is not running" };
      }

      const requested = [...new Set((pubkeys || []).map((p) => String(p).toLowerCase()))].filter((p) => PUBKEY.test(p));
      const listed = await this.listHolderKeys(serviceID);
      if (listed.code) throw new Error(listed.info);
      const present = new Set(listed.keys.map((k) => k.pubkey));
      const keys = {};
      // only the holder's own keys, so the renderer cannot exit keys of another client
      for (const p of requested) if (!present.has(p)) keys[p] = { blocker: { reason: "notOnChain" } };
      const own = requested.filter((p) => present.has(p));

      // shares are not on chain: their distributed validator is
      let chainKey = (p) => p;
      if (holder.role === "share") {
        const shares = Validators.mapShares(await this.monitoring.validatorAccountManager.getDVTKeys(holder.dvtVia));
        chainKey = (p) => shares.get(p);
        for (const p of own) if (!chainKey(p)) keys[p] = { blocker: { reason: "notInCluster" } };
      }
      const onChain = own.filter((p) => chainKey(p));

      const states = await this.getValidatorStates(onChain.map(chainKey), serviceID);
      if (states.code) return { code: 1, info: states.info };
      // without the head every key would look too young
      if (!states.headSlot) return { code: 1, reason: "noHead", info: "the beacon node did not report its head" };
      const spec = await this.getSpec(states.base);
      const shardCommitteePeriod = spec.shardCommitteePeriod ?? 256;
      const currentEpoch = Math.floor(states.headSlot / states.slotsPerEpoch);

      const syncing = await this.monitoring.queryBeaconApi(states.base, "/eth/v1/node/syncing");
      const beacon = {
        base: states.base,
        source: states.source,
        blocker: beaconBlocker(syncing.code ? null : syncing.data?.api_reponse?.data),
      };

      for (const p of onChain) {
        const state = states.byPubkey[chainKey(p)];
        keys[p] = {
          index: state?.index,
          status: state?.status,
          activationEpoch: state?.activationEpoch,
          credentials: state?.withdrawalCredentials,
          ...(holder.role === "share" ? { dvPubkey: chainKey(p) } : {}),
          blocker: exitBlocker(state, currentEpoch, shardCommitteePeriod),
        };
      }
      const eligible = requested.filter((p) => !keys[p].blocker);
      // a message signed now becomes valid once the key is active long enough, also for a pending key with an index
      const exportable =
        holder.role === "validator"
          ? requested.filter(
              (p) =>
                !keys[p].blocker || keys[p].blocker.reason === "tooYoung" || (keys[p].blocker.reason === "pending" && keys[p].index != null)
            )
          : [];
      const blsCredentials = requested.filter(
        (p) => (eligible.includes(p) || exportable.includes(p)) && String(keys[p].credentials).startsWith("0x00")
      );

      let signEpoch = null;
      let target = { prefix: "curl", base: states.base };
      if (holder.role === "validator" && holder.service === "PrysmValidatorService") {
        const client = await this.nodeConnection.readServiceConfiguration(serviceID);
        const command = Array.isArray(client?.command) ? client.command : String(client?.command ?? "").split(/\s+/);
        if (command.includes("--enable-beacon-rest-api")) {
          signEpoch = prysmExitEpoch(spec);
          if (signEpoch === null) {
            return {
              code: 1,
              reason: "prysmExitDomain",
              info: "Prysm's validator client cannot sign valid exits on this network (" + PRYSM_EXIT_ISSUE + ")",
            };
          }
        }
      }
      if (holder.role === "share") {
        // Charon only aggregates partial exits signed for the same epoch, and Obol tells operators to use Capella's
        signEpoch = spec.capellaForkEpoch;
        if (signEpoch == null) return { code: 1, reason: "noCapella", info: "the beacon node did not report the Capella fork epoch" };
        const curlTag = await this.nodeConnection.ensureCurlImage();
        target = {
          prefix: `docker run --rm -i --network=stereum curlimages/curl:${curlTag}`,
          base: `http://stereum-${holder.dvtVia}:3600`,
        };
      }

      return {
        code: 0,
        role: holder.role,
        keys,
        eligible,
        exportable,
        blsCredentials,
        beacon,
        currentEpoch,
        shardCommitteePeriod,
        secondsPerEpoch: states.slotsPerEpoch * states.secondsPerSlot,
        signEpoch,
        target,
      };
    } catch (err) {
      log.error("Preparing the exit failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  // share pubkey -> distributed validator pubkey, from a cluster lock's distributed_validators
  static mapShares(dvs = []) {
    const map = new Map();
    for (const dv of dvs || []) {
      const dvPubkey = String(dv?.distributed_public_key || "").toLowerCase();
      if (!PUBKEY.test(dvPubkey)) continue;
      for (const share of dv.public_shares || []) map.set(String(share).toLowerCase(), dvPubkey);
    }
    return map;
  }

  // Signed exits from the validator client: { signed: Map(pubkey -> message), failed: { pubkey: { message, error? } } }
  async signExits(serviceID, keys, indexByPubkey, epoch) {
    const answers = await this.keymanagerCalls(
      serviceID,
      // body [] as the staking page sent it, which every client accepted
      keys.map((pubkey) => ({
        method: "POST",
        path: `/eth/v1/validator/${pubkey}/voluntary_exit${epoch != null ? `?epoch=${epoch}` : ""}`,
        body: [],
      }))
    );
    const signed = new Map();
    const failed = {};
    keys.forEach((pubkey, i) => {
      const { status, body } = answers[i] ?? {};
      const message = checkSignedExit(body, indexByPubkey[pubkey]);
      if (message) signed.set(pubkey, message);
      else if (checkSignedExit(body, null)) failed[pubkey] = { message: "signed for another validator", error: "wrongIndex" };
      else failed[pubkey] = { message: body?.message || "HTTP " + status };
    });
    return { signed, failed };
  }

  /**
   * Sign and broadcast voluntary exits for the eligible keys (partial exits to Charon/Pluto for shares).
   * Returns { code: 0, results: { pubkey: { status, message?, reason?, eligibleEpoch? } }, partial, signEpoch }.
   */
  async exitKeys(serviceID, pubkeys) {
    // checked again here, the renderer's preflight is never trusted
    const prep = await this.prepareExit(serviceID, pubkeys);
    if (prep.code) return prep;
    if (prep.beacon.blocker) return { code: 1, beaconBlocker: prep.beacon.blocker, info: "beacon node " + prep.beacon.blocker };

    const partial = prep.role === "share";
    const results = {};
    for (const [pubkey, key] of Object.entries(prep.keys)) {
      if (key.blocker) results[pubkey] = { status: "skipped", ...key.blocker };
    }
    const indexByPubkey = Object.fromEntries(Object.entries(prep.keys).map(([p, k]) => [p, k.index]));
    const total = prep.eligible.length;
    if (!total) return { code: 0, results, partial, signEpoch: prep.signEpoch };

    const ref = StringUtils.createRandomString();
    const task = `Exiting ${count(total, "validator")}`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    try {
      for (let i = 0; i < total; i += EXIT_CHUNK) {
        const chunk = prep.eligible.slice(i, i + EXIT_CHUNK);
        const { signed, failed } = await this.signExits(serviceID, chunk, indexByPubkey, prep.signEpoch);
        for (const [pubkey, failure] of Object.entries(failed)) results[pubkey] = { status: "signFailed", ...failure };
        const sent = [...signed.keys()];
        const broadcast = {};
        if (sent.length) {
          const answers = await this.curlConfigRun(
            prep.target.prefix,
            sent.map((pubkey) =>
              Validators.curlBlock(
                prep.target.base,
                null,
                false,
                { method: "POST", path: "/eth/v1/beacon/pool/voluntary_exits", body: signed.get(pubkey) },
                [HTTP_WRITE_OUT]
              )
            )
          );
          sent.forEach((pubkey, j) => {
            const { status, body, raw } = answers[j];
            broadcast[pubkey] = `HTTP ${status}${status === 200 ? "" : ", answer: " + (body ? JSON.stringify(body) : raw || "(empty)")}`;
            results[pubkey] = status === 200 ? { status: "submitted" } : { status: "rejected", message: body?.message || `HTTP ${status}` };
          });
        }
        const chunkFailed = chunk.filter((p) => results[p].status !== "submitted");
        // signed messages stay out of the panel, only what the client and the beacon node answered
        const chunkLines = chunk.map((p) => {
          const r = results[p];
          const detail = broadcast[p] ?? r.message ?? "";
          return `${p} (index ${indexByPubkey[p]}): ${r.status}${detail ? " - " + detail : ""}`;
        });
        this.nodeConnection.taskManager?.otherTasksHandler(
          ref,
          `Sent ${Math.min(i + EXIT_CHUNK, total)} of ${total}`,
          !chunkFailed.length,
          [
            `signed by the validator client${prep.signEpoch != null ? ` for epoch ${prep.signEpoch}` : ""}`,
            `POST ${prep.target.base}/eth/v1/beacon/pool/voluntary_exits`,
            ...chunkLines,
          ].join("\n")
        );
      }

      const exitResults = prep.eligible.map((pubkey) => ({ pubkey, ...results[pubkey] }));
      const failed = exitResults.filter((r) => r.status !== "submitted");
      this.nodeConnection.taskManager?.otherTasksHandler(
        ref,
        "Result",
        !failed.length,
        Validators.summaryText(exitResults, (r) => r.status !== "submitted")
      );
      log.info(`${task}: ${total - failed.length} submitted, ${failed.length} failed`);
      return { code: 0, results, partial, signEpoch: prep.signEpoch };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err), results };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  /**
   * Signed exits to keep offline (validator holders only, epoch left to the client except for Prysm). The only path where
   * signed messages leave the backend. Returns { code: 0, messages, failed: [{ pubkey, message }], skipped }.
   */
  async exportExitMessages(serviceID, pubkeys) {
    const holder = (await this.getValidatorHolders()).find((h) => h.id === serviceID);
    if (holder?.role !== "validator") {
      return { code: 1, reason: "noExport", info: "signed exits can only be exported from a validator client" };
    }
    const prep = await this.prepareExit(serviceID, pubkeys);
    if (prep.code) return prep;

    const skipped = {};
    for (const [pubkey, key] of Object.entries(prep.keys)) {
      if (!prep.exportable.includes(pubkey)) skipped[pubkey] = key.blocker?.reason ?? "notOnChain";
    }
    const indexByPubkey = Object.fromEntries(Object.entries(prep.keys).map(([p, k]) => [p, k.index]));
    const total = prep.exportable.length;
    const messages = [];
    const failed = [];
    if (!total) return { code: 0, messages, failed, skipped };

    const ref = StringUtils.createRandomString();
    const task = `Signing ${count(total, "exit message")}`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    try {
      for (let i = 0; i < total; i += EXIT_CHUNK) {
        const chunk = prep.exportable.slice(i, i + EXIT_CHUNK);
        const result = await this.signExits(serviceID, chunk, indexByPubkey, prep.signEpoch);
        const chunkFailed = [];
        for (const pubkey of chunk) {
          if (result.signed.has(pubkey)) messages.push(result.signed.get(pubkey));
          else chunkFailed.push({ pubkey, ...result.failed[pubkey] });
        }
        failed.push(...chunkFailed);
        this.nodeConnection.taskManager?.otherTasksHandler(
          ref,
          `Signed ${Math.min(i + EXIT_CHUNK, total)} of ${total}`,
          !chunkFailed.length,
          chunk
            .map((p) => `${p} (index ${indexByPubkey[p]}): ${result.signed.has(p) ? "signed" : "failed - " + result.failed[p]?.message}`)
            .join("\n")
        );
      }
      this.nodeConnection.taskManager?.otherTasksHandler(
        ref,
        "Result",
        !failed.length,
        `${messages.length} signed, ${failed.length} failed` +
          (failed.length ? "\n\nfailed:\n" + failed.map((f) => `${f.pubkey}: ${f.message}`).join("\n") : "")
      );
      log.info(`${task}: ${messages.length} signed, ${failed.length} failed`);
      return { code: 0, messages, failed, skipped };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err) };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  // keys.yaml as an object; a missing file is empty, anything unreadable throws so it is never overwritten
  async readKeyEntries() {
    const result = await this.nodeConnection.sshService.exec("cat " + KEYS_FILE);
    if (result.rc != 0) {
      if (/No such file/.test(result.stderr || "")) return {};
      throw new Error("reading " + KEYS_FILE + " failed: " + (result.stderr || "rc " + result.rc));
    }
    const data = YAML.parse(result.stdout || "");
    if (data === null || data === undefined || data === "") return {};
    if (typeof data !== "object" || Array.isArray(data)) throw new Error(KEYS_FILE + " is not a map of keys");
    return data;
  }

  // { entries } with lowercased pubkeys, or { error }; holderIds are the valid validatorClientIDs
  static validateKeyPatch(patch, holderIds = []) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) return { error: "invalid patch" };
    const keys = Object.keys(patch);
    if (keys.length > KEY_PATCH_MAX) return { error: "too many keys" };
    const entries = {};
    for (const key of keys) {
      const pubkey = key.toLowerCase();
      if (!PUBKEY.test(pubkey)) return { error: "invalid public key " + key };
      const fields = patch[key];
      if (!fields || typeof fields !== "object" || Array.isArray(fields)) return { error: "invalid entry for " + pubkey };
      for (const [field, value] of Object.entries(fields)) {
        if (!KEY_FIELDS.includes(field)) return { error: "unknown field " + field };
        if (field === "keyName" || field === "groupName") {
          if (typeof value !== "string" || value.length > 30 || /\s/.test(value) || CONTROL_CHARS.test(value))
            return { error: "invalid " + field + " for " + pubkey };
        } else if (field === "groupID") {
          if (value !== null && !(typeof value === "string" && GROUP_ID.test(value))) return { error: "invalid groupID for " + pubkey };
        } else if (value !== null && !holderIds.includes(value)) {
          return { error: "unknown validator client for " + pubkey };
        }
      }
      entries[pubkey] = { ...entries[pubkey], ...fields };
    }
    return { entries };
  }

  // Commands writing text to file through quoted heredocs in chunks, so neither argv limits nor echo -e apply
  static keysYamlCommands(text, file = KEYS_FILE) {
    const lines = text.replace(/\n$/, "").split("\n");
    if (lines.some((line) => line === KEYS_MARKER || line === "=====EOF")) throw new Error("keys file contains a heredoc marker");
    const chunks = [];
    let current = [];
    let size = 0;
    for (const line of lines) {
      const bytes = Buffer.byteLength(line, "utf8") + 1;
      if (current.length && size + bytes > KEYS_CHUNK) {
        chunks.push(current.join("\n"));
        current = [];
        size = 0;
      }
      current.push(line);
      size += bytes;
    }
    chunks.push(current.join("\n"));
    // the move is chained to the last write, so a failed write never replaces the file
    return chunks.map((chunk, i) => {
      const move = i === chunks.length - 1 ? ` && mv -f ${file}.tmp ${file}` : "";
      return `cat ${i ? ">>" : ">"} ${file}.tmp <<'${KEYS_MARKER}'${move}\n${chunk}\n${KEYS_MARKER}`;
    });
  }

  /**
   * Merge per-key fields into /etc/stereum/keys.yaml (aliases and groups). Writes are serialized so
   * concurrent read-modify-writes never lose an update. Returns { code: 0, aliases } or { code: 1, info }.
   */
  async writeKeyEntries(patch) {
    const run = async () => {
      try {
        const needsHolders = Object.values(patch || {}).some((f) => f?.validatorClientID !== undefined && f?.validatorClientID !== null);
        const holderIds = needsHolders ? (await this.getValidatorHolders()).map((h) => h.id) : [];
        const { entries, error } = Validators.validateKeyPatch(patch, holderIds);
        if (error) return { code: 1, info: error };

        const merged = await this.readKeyEntries();
        // an existing mixed-case entry is updated in place instead of duplicated
        const existing = {};
        for (const key of Object.keys(merged)) {
          const lower = key.toLowerCase();
          if (!(lower in existing) || key === lower) existing[lower] = key;
        }
        for (const [pubkey, fields] of Object.entries(entries)) {
          const key = existing[pubkey] ?? pubkey;
          const current = merged[key] && typeof merged[key] === "object" ? merged[key] : {};
          merged[key] = { keyName: "", groupName: "", groupID: null, validatorClientID: null, ...current, ...fields };
        }

        // the real file is only replaced by the final mv, a failed chunk leaves just the .tmp file
        for (const cmd of Validators.keysYamlCommands(YAML.stringify(merged))) {
          const result = await this.nodeConnection.sshService.exec(cmd);
          if (result.rc != 0) throw new Error("writing " + KEYS_FILE + " failed: " + (result.stderr || "rc " + result.rc));
        }
        return { code: 0, aliases: merged };
      } catch (err) {
        log.error("Writing the keys file failed: ", err);
        return { code: 1, info: String(err?.message || err) };
      }
    };
    // the queue lives on the connection, so ValidatorAccountManager.writeKeys waits in it too
    const queue = this.nodeConnection;
    queue.keysWrite = (queue.keysWrite ?? Promise.resolve()).then(run, run);
    return queue.keysWrite;
  }

  // Merge EIP-3076 interchange data (object or JSON string) of several deletes into one
  static mergeInterchange(merged, next) {
    const data = typeof next === "string" ? Validators.parseJson(next) : next;
    if (!data?.data) return merged;
    if (!merged) return { metadata: data.metadata, data: [...data.data] };
    return { metadata: merged.metadata, data: [...merged.data, ...data.data] };
  }

  /**
   * Set (value given) or reset (value null, back to the client default) a per-key setting through the
   * keymanager API for many keys at once. setting: "graffiti" | "feerecipient".
   * Returns { code, ok: [pubkeys], failed: [pubkeys] } or { code, info } on invalid input.
   */
  async setKeySetting(serviceID, pubkeys, setting, value) {
    const keys = [...new Set((pubkeys || []).map((p) => String(p).toLowerCase()))].filter((p) => PUBKEY.test(p));
    if (!keys.length) return { code: 1, info: "no valid keys" };
    let body = null;
    if (value !== null && value !== undefined) {
      if (setting === "graffiti") {
        // graffiti is 32 bytes on chain, and control characters have no place in it
        if (Buffer.byteLength(value, "utf8") > 32 || [...value].some((c) => c.charCodeAt(0) < 32))
          return { code: 1, info: "invalid graffiti" };
        body = { graffiti: value };
      } else if (setting === "feerecipient") {
        if (!ADDRESS.test(value)) return { code: 1, info: "invalid fee recipient" };
        body = { ethaddress: value };
      } else {
        return { code: 1, info: "unknown setting " + setting };
      }
    }

    const ref = StringUtils.createRandomString();
    // the task panel wraps names past ~24 characters
    const task = `${body ? "Set" : "Reset"} ${setting === "graffiti" ? "graffiti" : "fee recipient"} (${keys.length})`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    try {
      const file = setting === "graffiti" ? await this.graffitiFileOf(serviceID) : null;
      if (file) return await this.setGraffitiInFile(file, keys, body ? value : null, ref);
      const method = body ? "POST" : "DELETE";
      const answers = await this.keymanagerCalls(
        serviceID,
        keys.map((pubkey) => ({ method, path: `/eth/v1/validator/${pubkey}/${setting}`, body }))
      );
      // 202 accepted on set, 204 no content on delete; an error in the body counts even then, as Lighthouse
      // answers 202 when it refuses a graffiti while --graffiti-file is set
      const accepted = (a) => [200, 202, 204].includes(a?.status) && !(Number(a?.body?.code) >= 400);
      const ok = keys.filter((_, i) => accepted(answers[i]));
      const failed = keys.filter((k) => !ok.includes(k));
      const lines = keys.map((pubkey, i) => {
        const { status, body: answer, raw } = answers[i] ?? {};
        const detail = accepted(answers[i]) ? "" : ", answer: " + (answer ? JSON.stringify(answer) : raw || "(empty)");
        return `${pubkey}: HTTP ${status ?? 0}${detail}`;
      });
      this.nodeConnection.taskManager?.otherTasksHandler(
        ref,
        `Applied to ${ok.length} of ${keys.length}`,
        !failed.length,
        [
          `${method} ${answers[0]?.url?.replace(keys[0], "{pubkey}") ?? setting}`,
          body ? `value: ${JSON.stringify(body)}` : "back to the client default",
          ...lines,
        ].join("\n")
      );
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", !failed.length, `${ok.length} applied, ${failed.length} failed`);
      return { code: 0, ok, failed };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err) };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  /**
   * Current graffiti or fee recipient of many keys in one batched call, for the bulk dialog.
   * Returns { code: 0, values: { pubkey: value }, failed: { pubkey: message } } or { code, info }.
   */
  async readKeySettings(serviceID, pubkeys, setting) {
    const keys = cleanKeys(pubkeys);
    if (!keys.length) return { code: 1, info: "no valid keys" };
    if (!["graffiti", "feerecipient"].includes(setting)) return { code: 1, info: "unknown setting " + setting };
    const ref = StringUtils.createRandomString();
    const task = `Read ${setting === "graffiti" ? "graffiti" : "fee recipient"} (${keys.length})`;
    this.nodeConnection.taskManager?.otherTasksHandler(ref, task);
    try {
      // a graffiti file wins over everything else in the client, so its value is the one used on proposals
      const values = {};
      const fromFile = [];
      const file = setting === "graffiti" ? await this.graffitiFileOf(serviceID) : null;
      if (file) {
        const parsed = Validators.parseGraffitiFile((await this.readGraffitiFile(file.path)).text);
        for (const pubkey of keys) {
          const value = parsed.keys[pubkey] ?? parsed.default;
          if (value !== undefined && value !== null) {
            values[pubkey] = value;
            fromFile.push(pubkey);
          }
        }
      }
      const asked = keys.filter((k) => !fromFile.includes(k));
      const answers = asked.length
        ? await this.keymanagerCalls(
            serviceID,
            asked.map((pubkey) => ({ method: "GET", path: `/eth/v1/validator/${pubkey}/${setting}` }))
          )
        : [];
      const failed = {};
      const defaultUnknown = [];
      asked.forEach((pubkey, i) => {
        const { status, body, raw } = answers[i] ?? {};
        const value = setting === "graffiti" ? Validators.cleanGraffiti(body?.data?.graffiti) : body?.data?.ethaddress;
        if (status === 200 && typeof value === "string") values[pubkey] = value;
        else if (Validators.DEFAULT_UNKNOWN.test(body?.message)) defaultUnknown.push(pubkey);
        else failed[pubkey] = body?.message || (raw ? String(raw).slice(0, 200) : `HTTP ${status ?? 0}`);
      });
      const lines = keys.map(
        (pubkey) =>
          `${pubkey}: ${
            pubkey in values
              ? JSON.stringify(values[pubkey]) + (fromFile.includes(pubkey) ? " (graffiti file)" : "")
              : defaultUnknown.includes(pubkey)
                ? "client default, not reported by the client"
                : "failed - " + failed[pubkey]
          }`
      );
      const failedCount = Object.keys(failed).length;
      this.nodeConnection.taskManager?.otherTasksHandler(
        ref,
        `Read ${keys.length - failedCount - defaultUnknown.length} of ${keys.length}`,
        !failedCount,
        [
          ...(file ? [`graffiti file ${file.path}`] : []),
          ...(asked.length ? [`GET ${answers[0]?.url?.replace(asked[0], "{pubkey}") ?? setting}`] : []),
          ...lines,
        ].join("\n")
      );
      this.nodeConnection.taskManager?.otherTasksHandler(
        ref,
        "Result",
        !failedCount,
        `${keys.length - failedCount} read, ${failedCount} failed`
      );
      return { code: 0, values, failed, defaultUnknown };
    } catch (err) {
      log.error(task + " failed: ", err);
      this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", false, String(err?.message || err));
      return { code: 2, info: String(err?.message || err) };
    } finally {
      this.nodeConnection.taskManager?.otherTasksHandler(ref);
    }
  }

  // Lighthouse refuses the keymanager graffiti API while it reads a graffiti file (Stereum always passes
  // --graffiti-file), so its graffiti lives in that file: { path } on the host, or null
  async graffitiFileOf(serviceID) {
    const client = await this.nodeConnection.readServiceConfiguration(serviceID);
    if (client?.service !== "LighthouseValidatorService") return null;
    const command = Array.isArray(client.command) ? client.command : String(client.command ?? "").split(/\s+/);
    const flag = command.find((c) => c.startsWith("--graffiti-file="));
    if (!flag) return null;
    const inContainer = flag.slice("--graffiti-file=".length);
    const volumes = (client.volumes || []).map((v) => (typeof v === "string" ? ServiceVolume.buildByConfig(v) : v));
    const volume = volumes.find((v) => v?.servicePath && inContainer.startsWith(v.servicePath + "/"));
    // a config-derived path, but it still goes into single quotes
    const path = volume ? volume.destinationPath + inContainer.slice(volume.servicePath.length) : null;
    return path && !path.includes("'") ? { path } : null;
  }

  // The graffiti file's text, empty when there is none yet: { text, rc }
  async readGraffitiFile(path) {
    const result = await this.nodeConnection.sshService.exec(`cat '${path}' 2>/dev/null || true`);
    return { text: String(result.stdout ?? ""), rc: result.rc };
  }

  // Lighthouse's graffiti file: "default: <text>" and "0x<pubkey>: <text>" lines, split at the first colon
  static parseGraffitiFile(text) {
    const keys = {};
    let fallback = null;
    for (const line of String(text ?? "").split("\n")) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const key = line.slice(0, i);
      const value = line.slice(i + 1).trim();
      if (key === "default") fallback = value;
      else if (/^0x[0-9a-fA-F]{96}$/.test(key)) keys[key.toLowerCase()] = value;
    }
    return { default: fallback, keys };
  }

  // The file with each key in changes set (value) or removed (null); other lines stay as they are, blank ones go,
  // since Lighthouse rejects the whole file over a single invalid line
  static updateGraffitiFile(text, changes) {
    const out = [];
    const done = new Set();
    for (const line of String(text ?? "").split("\n")) {
      if (!line.trim()) continue;
      const key = line.match(/^(0x[0-9a-fA-F]{96}):/)?.[1].toLowerCase();
      if (key && changes.has(key)) {
        if (!done.has(key) && changes.get(key) !== null) out.push(`${key}: ${changes.get(key)}`);
        done.add(key);
        continue;
      }
      out.push(line);
    }
    for (const [key, value] of changes) if (!done.has(key) && value !== null) out.push(`${key}: ${value}`);
    return out.length ? out.join("\n") + "\n" : "";
  }

  // Set (value) or remove (null) the keys' lines in the graffiti file; Lighthouse reads it on every proposal
  async setGraffitiInFile(file, keys, value, ref) {
    const before = await this.readGraffitiFile(file.path);
    const next = Validators.updateGraffitiFile(before.text, new Map(keys.map((k) => [k, value])));
    let write = { rc: 0, stderr: "" };
    for (const cmd of Validators.keysYamlCommands(next, file.path)) {
      write = await this.nodeConnection.sshService.exec(cmd);
      if (write.rc != 0) break;
    }
    const ok = write.rc == 0 ? keys : [];
    const failed = write.rc == 0 ? [] : keys;
    const parsed = Validators.parseGraffitiFile(next);
    this.nodeConnection.taskManager?.otherTasksHandler(
      ref,
      `Wrote graffiti file (${keys.length})`,
      write.rc == 0,
      [
        file.path,
        value !== null ? `value: ${JSON.stringify(value)}` : "lines removed, back to the file's default",
        `default: ${parsed.default ?? "(none)"}, ${Object.keys(parsed.keys).length} keys with their own graffiti`,
        ...(write.rc == 0
          ? keys.map((k) => `${k}: ${value !== null ? "set" : "removed"}`)
          : [`write failed (rc ${write.rc}): ${write.stderr}`]),
      ].join("\n")
    );
    this.nodeConnection.taskManager?.otherTasksHandler(ref, "Result", write.rc == 0, `${ok.length} applied, ${failed.length} failed`);
    return { code: 0, ok, failed };
  }

  // a key without its own graffiti uses the client's default, which some clients cannot report: Prysm looks it up
  // by validator index (none before the deposit), Lighthouse answers 500 without a --graffiti flag, Lodestar 404
  static DEFAULT_UNKNOWN = /could not find validator index|no graffiti found|no graffiti for pubkey/i;

  // The text the user typed: Prysm pads it to its 32 bytes on chain with zero bytes, Lighthouse answers with those
  // 32 bytes as hex (0x4c48...)
  static cleanGraffiti(value) {
    if (typeof value !== "string") return value;
    const text = /^0x[0-9a-fA-F]{64}$/.test(value) ? Buffer.from(value.slice(2), "hex").toString("utf8") : value;
    return text.replace(/\0+$/, "");
  }

  // Current per-key graffiti (without a task panel entry), { code, graffiti } or { code, info }
  async getGraffiti(serviceID, pubkey) {
    try {
      if (!PUBKEY.test(String(pubkey).toLowerCase())) throw new Error("invalid public key");
      const file = await this.graffitiFileOf(serviceID);
      if (file) {
        const parsed = Validators.parseGraffitiFile((await this.readGraffitiFile(file.path)).text);
        const value = parsed.keys[String(pubkey).toLowerCase()] ?? parsed.default;
        if (value !== undefined && value !== null) return { code: 0, graffiti: value };
      }
      const client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.monitoring.validatorAccountManager.keymanagerAPI(client, "GET", `/eth/v1/validator/${pubkey}/graffiti`);
      const data = Validators.parseJson(result.stdout);
      if (!data?.data && Validators.DEFAULT_UNKNOWN.test(data?.message)) return { code: 0, graffiti: null, defaultUnknown: true };
      if (!data?.data) throw new Error(data?.message || result.stderr || "no graffiti returned");
      return { code: 0, graffiti: Validators.cleanGraffiti(data.data.graffiti) ?? "" };
    } catch (err) {
      log.error("Reading the graffiti of " + pubkey + " failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  // A keymanager list (data array), reported to subtask(name, ok, text) with the answer as received.
  // noWallet: Prysm's "wallet not initialized" answer means no keys yet and returns null
  async keymanagerList(vam, client, path, subtask = () => {}, { noWallet = false } = {}) {
    const result = await vam.keymanagerAPI(client, "GET", path);
    const stdout = String(result.stdout ?? "").trim();
    const data = stdout ? Validators.parseJson(stdout) : null;
    let error = null;
    if (result.rc != 0 || !stdout) {
      const reason = String(result.stderr ?? "").trim() || Validators.curlExitReason(result.rc) || "rc " + result.rc;
      error = `keymanager ${path} failed: ${reason}`;
    } else if (!Array.isArray(data?.data)) {
      error = `keymanager ${path}: ${data?.message || "unexpected answer"}`;
    }
    const walletMissing = noWallet && !!error && /wallet not initialized/i.test(String(data?.message));
    const base = `${client.service.includes("Teku") ? "https" : "http"}://stereum-${client.id}:${validatorPorts[client.service]}`;
    subtask(
      `GET ${path}`,
      !error || walletMissing,
      [
        ...(walletMissing ? ["no wallet yet: Stereum creates it with the first import"] : []),
        `GET ${base}${path}`,
        `curl exit ${result.rc}${Validators.curlExitReason(result.rc) ? " (" + Validators.curlExitReason(result.rc) + ")" : ""}`,
        ...(String(result.stderr ?? "").trim() ? ["stderr: " + String(result.stderr).trim()] : []),
        ...(error && !walletMissing ? [error] : []),
        "answer:\n" + (data ? JSON.stringify(data, null, 2) : stdout || "(empty)"),
      ].join("\n")
    );
    if (walletMissing) return null;
    if (error) throw new Error(error);
    return data.data;
  }

  /**
   * Beacon states of the given keys in one exec, plus the chain time to date them.
   * Returns { code, byPubkey, source, base, headSlot, slotsPerEpoch, secondsPerSlot }. Keys the beacon
   * does not know are simply missing from byPubkey; code != 0 means nothing could be asked, so the
   * caller keeps the stats it has.
   */
  async getValidatorStates(pubkeys = [], serviceID = null) {
    const ids = [...new Set(pubkeys.map((p) => String(p).toLowerCase()))].filter((p) => PUBKEY.test(p));
    const beacon = await this.findHolderBeacon(serviceID);
    if (beacon.code) return { code: 1, info: "no beacon node available (" + beacon.info + ")", byPubkey: {} };
    const base = beacon.data.url;
    const source = beacon.data.source;

    const spec = await this.getSpec(base);
    const parts = [`curl -s '${base}/eth/v1/beacon/headers/head'; printf '\\n${STATES_MARKER}\\n'`];
    for (let i = 0; i < ids.length; i += STATES_CHUNK) {
      const body = JSON.stringify({ ids: ids.slice(i, i + STATES_CHUNK) });
      parts.push(
        `curl -s -X POST '${base}/eth/v1/beacon/states/head/validators' -H 'Content-Type: application/json' -d '${body}'; printf '\\n${STATES_MARKER}\\n'`
      );
    }
    const result = await this.nodeConnection.sshService.execShared(parts.join("\n"));
    if (result.rc != 0 && !result.stdout) return { code: 2, info: "state query failed: " + result.stderr, byPubkey: {}, source, base };

    const [head, ...chunks] = result.stdout.split(`\n${STATES_MARKER}\n`).map((s) => s.trim());
    const byPubkey = {};
    let answered = 0;
    for (const chunk of chunks.slice(0, Math.ceil(ids.length / STATES_CHUNK))) {
      const json = Validators.parseJson(chunk);
      if (!json) continue;
      // 404: none of the keys in this chunk are on chain yet, which is an answer too
      if (Array.isArray(json.data) || json.code == 404) answered++;
      for (const v of json.data || []) byPubkey[v.validator.pubkey.toLowerCase()] = Validators.toState(v);
    }
    if (ids.length && !answered) return { code: 3, info: "the beacon node did not answer the state query", byPubkey: {}, source, base };

    return {
      code: 0,
      byPubkey,
      source,
      base,
      headSlot: parseInt(Validators.parseJson(head)?.data?.header?.message?.slot) || null,
      slotsPerEpoch: spec.slotsPerEpoch,
      secondsPerSlot: spec.secondsPerSlot,
      // lets the duties tab show the chain clock before any duties are read
      genesisTime: spec.genesisTime ?? null,
    };
  }

  /**
   * The beacon node a holder's validators run on: the consensus client it depends on (through
   * Charon/Pluto for DV setups), so a node with several networks asks the right chain. Falls back to
   * the first available or a configured beacon node.
   */
  async findHolderBeacon(serviceID) {
    if (serviceID) {
      const infos = await this.monitoring.getServiceInfos();
      const byId = (id) => infos.find((i) => i.config?.serviceID === id);
      let dep = (byId(serviceID)?.config?.dependencies?.consensusClients || [])[0];
      if (dep && isObolDVTService(dep.service)) dep = (byId(dep.id)?.config?.dependencies?.consensusClients || [])[0];
      if (dep) {
        const status = await this.monitoring.getBeaconStatus();
        const own = status.code ? null : status.data.find((d) => d.sid === dep.id);
        if (own) {
          return {
            code: 0,
            data: { url: `http://${own.beacon.destinationIp}:${own.beacon.destinationPort}`, source: "local" },
          };
        }
      }
    }
    return this.monitoring.findBeaconPort();
  }

  /**
   * Many beacon API requests in as few execs as possible: one curl per request, its status code on the last
   * line and a marker after it, grouped into execs of at most EXEC_BUDGET bytes. requests: [{ path, ids? }],
   * ids makes it a POST with the JSON array as body. Only validated integers and indices are ever in path
   * and ids. Returns [{ status, body }] in request order ({ status: 0, body: null } when missing).
   */
  async beaconBatch(base, requests) {
    // a configured endpoint may carry a path; it goes into single quotes, so none may be in it
    if (!/^https?:\/\/[^\s'"\\]+$/.test(String(base))) throw new Error("invalid beacon node address");
    const lines = requests.map(({ path, ids }) => {
      const post = ids ? ` -X POST -H 'Content-Type: application/json' -d '${JSON.stringify(ids)}'` : "";
      return `curl -s -w '\\n%{http_code}'${post} '${base}${path}'; printf '\\n${BEACON_MARKER}\\n'`;
    });
    const groups = [];
    let current = [];
    let size = 0;
    for (const line of lines) {
      const bytes = Buffer.byteLength(line, "utf8") + 1;
      if (current.length && size + bytes > EXEC_BUDGET) {
        groups.push(current);
        current = [];
        size = 0;
      }
      current.push(line);
      size += bytes;
    }
    if (current.length) groups.push(current);

    const results = [];
    for (const group of groups) {
      const result = await this.nodeConnection.sshService.execShared(group.join("\n"));
      const parts = String(result?.stdout ?? "").split(`\n${BEACON_MARKER}\n`);
      for (let i = 0; i < group.length; i++) results.push(Validators.parseBeaconPart(parts[i]));
    }
    return results;
  }

  // "<body>\n<http code>" -> { status, body }
  static parseBeaconPart(part) {
    if (part === undefined) return { status: 0, body: null };
    const text = part.replace(/^\n+/, "");
    const cut = text.lastIndexOf("\n");
    const status = parseInt(cut < 0 ? text : text.slice(cut + 1)) || 0;
    const body = cut < 0 ? "" : text.slice(0, cut).trim();
    return { status, body: body ? Validators.parseJson(body) : null };
  }

  // Holder (not a share, its keys are not on chain) with the beacon node and chain timing it runs on
  async dutiesTarget(serviceID) {
    const holder = (await this.getValidatorHolders()).find((h) => h.id === serviceID);
    if (!holder || holder.role === "share") return { code: 1, info: "duties are not available for this service" };
    const beacon = await this.findHolderBeacon(serviceID);
    if (beacon.code) return { code: 1, info: "no beacon node available (" + beacon.info + ")" };
    const base = beacon.data.url;
    return { code: 0, holder, base, source: beacon.data.source, spec: await this.getSpec(base) };
  }

  /**
   * Proposer and sync committee duties of the given validator indices for the current epoch (proposals
   * also for the previous and the next one, sync also for the next period), in one batch on the holder's beacon node.
   * Returns { code: 0, epoch, slot, headSlot, finalizedEpoch, genesisTime, slotsPerEpoch, secondsPerSlot,
   * proposals: [{ slot, index, pubkey }], sync: { current, next, periodStart, nextPeriodStart } } or { code, info }.
   */
  async getDuties(serviceID, indices = []) {
    try {
      const ids = cleanIndices(indices);
      if (!ids.length) return { code: 0, empty: true };
      const target = await this.dutiesTarget(serviceID);
      if (target.code) return target;
      const { base, spec } = target;
      const { slotsPerEpoch, secondsPerSlot, genesisTime, epochsPerSyncCommitteePeriod } = spec;

      // the wall clock, or the head when the genesis time is unknown
      let slot = chainClock(spec, Date.now())?.slot;
      if (slot === undefined) {
        const [head] = await this.beaconBatch(base, [{ path: "/eth/v1/beacon/headers/head" }]);
        slot = parseInt(head.body?.data?.header?.message?.slot);
        if (head.status !== 200 || !Number.isFinite(slot)) return { code: 2, info: "the beacon node did not report its head" };
      }
      const epoch = Math.floor(slot / slotsPerEpoch);
      const periodStart = nextPeriodStart(epoch, epochsPerSyncCommitteePeriod);
      const chunks = chunked(ids, INDEX_CHUNK);

      const answers = await this.beaconBatch(base, [
        { path: "/eth/v1/beacon/headers/head" },
        { path: "/eth/v1/beacon/states/head/finality_checkpoints" },
        // the previous epoch too, since its rewards are accounted once it is over
        { path: `/eth/v1/validator/duties/proposer/${Math.max(epoch - 1, 0)}` },
        { path: `/eth/v1/validator/duties/proposer/${epoch}` },
        { path: `/eth/v1/validator/duties/proposer/${epoch + 1}` },
        ...chunks.map((chunk) => ({ path: `/eth/v1/validator/duties/sync/${epoch}`, ids: chunk })),
        ...chunks.map((chunk) => ({ path: `/eth/v1/validator/duties/sync/${periodStart}`, ids: chunk })),
      ]);
      const [head, finality, ...proposerAnswers] = answers.slice(0, 5);
      const headSlot = parseInt(head.body?.data?.header?.message?.slot);
      if (head.status !== 200 || !Number.isFinite(headSlot)) return { code: 2, info: "the beacon node did not report its head" };
      const finalized = parseInt(finality.body?.data?.finalized?.epoch);

      // a Set keeps the filter linear with thousands of keys; the next epoch is optional in the spec
      const own = new Set(ids);
      const proposals = [];
      for (const answer of epoch > 0 ? proposerAnswers : proposerAnswers.slice(1)) {
        if (answer.status !== 200 || !Array.isArray(answer.body?.data)) continue;
        for (const duty of answer.body.data) {
          const index = String(duty.validator_index);
          if (own.has(index)) proposals.push({ slot: parseInt(duty.slot), index, pubkey: String(duty.pubkey).toLowerCase() });
        }
      }
      const syncIndices = (list) => [
        ...new Set(list.flatMap((a) => (Array.isArray(a.body?.data) ? a.body.data.map((d) => String(d.validator_index)) : []))),
      ];
      const syncAnswers = answers.slice(5);

      return {
        code: 0,
        epoch,
        slot,
        headSlot,
        finalizedEpoch: Number.isFinite(finalized) ? finalized : null,
        genesisTime,
        slotsPerEpoch,
        secondsPerSlot,
        proposals: proposals.sort((a, b) => a.slot - b.slot),
        sync: {
          current: syncIndices(syncAnswers.slice(0, chunks.length)),
          next: syncIndices(syncAnswers.slice(chunks.length)),
          periodStart: periodStart - epochsPerSyncCommitteePeriod,
          nextPeriodStart: periodStart,
        },
      };
    } catch (err) {
      log.error("Reading the duties of " + serviceID + " failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  /**
   * Rewards of a completed epoch in one batch: attestations (finalized epoch), sync committee (per slot of
   * epoch, only with syncIndices) and the given proposals (consensus layer reward only).
   * Returns { code: 0, headSlot, attestation, sync, blocks: [{ slot, index, result, reward }], unsupported }.
   */
  async getRewards(serviceID, { indices = [], attestationEpoch, epoch, syncIndices = [], proposals = [], effectiveBalances = {} } = {}) {
    try {
      const target = await this.dutiesTarget(serviceID);
      if (target.code) return target;
      const { base, spec } = target;
      const ids = cleanIndices(indices);
      const syncIds = cleanIndices(syncIndices).slice(0, SYNC_COMMITTEE_SIZE);
      const blocks = (Array.isArray(proposals) ? proposals : [])
        .filter((p) => epochOrSlot(p?.slot) && INDEX.test(String(p?.index)))
        .slice(0, MAX_SLOTS)
        .map((p) => ({ slot: p.slot, index: String(p.index) }));

      const requests = [{ kind: "head", path: "/eth/v1/beacon/headers/head" }];
      if (epochOrSlot(attestationEpoch) && ids.length) {
        for (const chunk of chunked(ids, INDEX_CHUNK)) {
          requests.push({ kind: "attestation", path: `/eth/v1/beacon/rewards/attestations/${attestationEpoch}`, ids: chunk });
        }
      }
      if (epochOrSlot(epoch) && syncIds.length) {
        for (let slot = epoch * spec.slotsPerEpoch; slot < (epoch + 1) * spec.slotsPerEpoch; slot++) {
          requests.push({ kind: "sync", slot, path: `/eth/v1/beacon/rewards/sync_committee/${slot}`, ids: syncIds });
        }
      }
      for (const block of blocks) {
        requests.push({ kind: "header", slot: block.slot, path: `/eth/v1/beacon/headers/${block.slot}` });
        requests.push({ kind: "block", slot: block.slot, path: `/eth/v1/beacon/rewards/blocks/${block.slot}` });
      }

      const answers = await this.beaconBatch(base, requests);
      const of = (kind) => requests.map((r, i) => ({ ...r, ...answers[i] })).filter((a) => a.kind === kind);
      const headSlot = parseInt(answers[0].body?.data?.header?.message?.slot);
      const unsupported = {};

      let attestation = null;
      const attAnswers = of("attestation");
      if (attAnswers.length) {
        unsupported.attestation = allUnsupported(attAnswers);
        const ok = attAnswers.filter((a) => a.status === 200 && a.body?.data);
        if (ok.length === attAnswers.length) {
          const balances = {};
          for (const [index, balance] of Object.entries(effectiveBalances || {})) {
            if (INDEX.test(index) && Number.isSafeInteger(balance)) balances[index] = balance;
          }
          attestation = {
            epoch: attestationEpoch,
            ...attestationSummary(
              ok.map((a) => a.body),
              balances
            ),
          };
        }
      }

      let sync = null;
      const syncAnswers = of("sync");
      if (syncAnswers.length) {
        unsupported.sync = allUnsupported(syncAnswers);
        // a slot without any answer is unknown, not missed
        if (!unsupported.sync && syncAnswers.every((a) => a.status === 200 || a.status === 404)) {
          const summary = syncSummary(syncAnswers);
          sync = { epoch, total: summary.total, missedCount: summary.missedCount, missedSlots: summary.missedSlots };
        }
      }

      const results = [];
      const headers = of("header");
      const rewards = of("block");
      if (blocks.length) unsupported.block = allUnsupported(rewards.filter((r, i) => headers[i].status === 200));
      blocks.forEach((block, i) => {
        // a slot after the head has no outcome yet
        if (!Number.isFinite(headSlot) || block.slot > headSlot) return;
        const header = headers[i];
        if (header.status === 404) return results.push({ ...block, result: "missed", reward: 0 });
        if (header.status !== 200) return;
        const proposer = String(header.body?.data?.header?.message?.proposer_index);
        if (proposer !== block.index) return results.push({ ...block, result: "missed", reward: 0 });
        const total = parseInt(rewards[i].body?.data?.total);
        results.push({ ...block, result: "proposed", reward: rewards[i].status === 200 && Number.isFinite(total) ? total : null });
      });

      return {
        code: 0,
        headSlot: Number.isFinite(headSlot) ? headSlot : null,
        attestation,
        sync,
        blocks: results,
        unsupported,
      };
    } catch (err) {
      log.error("Reading the rewards of " + serviceID + " failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  /**
   * Cluster stats of a DVT holder: Obol (Charon/Pluto, a share shows its cluster) from Prometheus, SSV
   * from the public SSV API. Returns { code: 0, kind, service, stats, empty } or { code: 1, info }.
   */
  async getClusterStats(serviceID) {
    try {
      const holders = await this.getValidatorHolders();
      const holder = holders.find((h) => h.id === serviceID);
      if (holder?.role === "distributed" || holder?.role === "share") {
        const id = holder.role === "share" ? holder.dvtVia : holder.id;
        const service = holders.find((h) => h.id === id)?.service ?? null;
        const stats = (await this.monitoring.getObolClusterInformation(id)) ?? {};
        return { code: 0, kind: "obol", service, stats, empty: !Object.keys(stats).length };
      }
      if (holder?.role === "ssv") {
        const stats = (await this.monitoring.getSSVClusterInformation(holder.id)) ?? {};
        return { code: 0, kind: "ssv", service: holder.service, stats, empty: !Object.keys(stats).length };
      }
      return { code: 1, info: "no cluster for this service" };
    } catch (err) {
      // the SSV API call throws on any non-2xx answer
      log.error("Reading the cluster stats of " + serviceID + " failed: ", err);
      return { code: 1, info: String(err?.message || err) };
    }
  }

  /**
   * Lido CSM signing keys of the node operator (from the LCOM config) with their deposit queue position.
   * Calls share one run and a 5 minute cache, since the lookup opens and closes all RPC tunnels.
   * Returns { code: 0, installed, keys: { pubkey: position } } or { code: 1, installed: true, info }.
   */
  async getCsmKeys(force = false) {
    try {
      const lcom = await this.monitoring.getServiceInfos("LCOMService");
      if (!lcom?.length) return { code: 0, installed: false, keys: {} };
      if (!force && this.csmCache && Date.now() - this.csmCache.at < CSM_CACHE_MS) return this.csmCache.result;
      const list = await this.csmSigningKeys();
      if (!list) return { code: 1, installed: true, info: "CSM keys could not be read (node syncing or RPC unavailable)" };
      const result = { code: 0, installed: true, keys: csmQueueMap(list) };
      this.csmCache = { at: Date.now(), result };
      return result;
    } catch (err) {
      log.error("Reading the Lido CSM keys failed: ", err);
      return { code: 1, installed: true, info: String(err?.message || err) };
    }
  }

  static toState(v) {
    return {
      index: v.index,
      status: v.status,
      balance: parseInt(v.balance),
      effectiveBalance: parseInt(v.validator.effective_balance),
      slashed: v.validator.slashed === true || v.validator.slashed === "true",
      withdrawalCredentials: v.validator.withdrawal_credentials,
      activationEpoch: parseInt(v.validator.activation_epoch),
      exitEpoch: parseInt(v.validator.exit_epoch),
      withdrawableEpoch: parseInt(v.validator.withdrawable_epoch),
    };
  }

  static parseJson(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  // Chain timing per beacon node, cached since it never changes (falls back to mainnet values)
  async getSpec(base) {
    if (this.specByBase[base]) return this.specByBase[base];
    const res = await this.monitoring.queryBeaconApi(base, "/eth/v1/config/spec");
    const data = res.code ? {} : res.data.api_reponse?.data || {};
    const genesis = await this.monitoring.queryBeaconApi(base, "/eth/v1/beacon/genesis");
    const genesisTime = genesis?.code ? NaN : parseInt(genesis?.data?.api_reponse?.data?.genesis_time);
    const capella = parseInt(data.CAPELLA_FORK_EPOCH);
    const deneb = parseInt(data.DENEB_FORK_EPOCH);
    const spec = {
      slotsPerEpoch: parseInt(data.SLOTS_PER_EPOCH) || 32,
      secondsPerSlot: parseInt(data.SECONDS_PER_SLOT) || 12,
      // 256 on mainnet, hoodi, sepolia and gnosis
      shardCommitteePeriod: parseInt(data.SHARD_COMMITTEE_PERIOD) || 256,
      capellaForkEpoch: Number.isFinite(capella) ? capella : null,
      denebForkEpoch: Number.isFinite(deneb) ? deneb : null,
      epochsPerSyncCommitteePeriod: parseInt(data.EPOCHS_PER_SYNC_COMMITTEE_PERIOD) || 256,
      genesisTime: Number.isFinite(genesisTime) ? genesisTime : null,
    };
    if (!res.code && spec.genesisTime !== null) this.specByBase[base] = spec;
    return spec;
  }
}
