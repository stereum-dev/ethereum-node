#!/usr/bin/python
"""Renders a validator client's proposer settings from Charon's proposer-config.json.

Every validator client of an Obol cluster has to sign identical proposer and builder preferences,
so they all take them from the file Charon writes. This does what the start scripts of Obol's
charon-distributed-validator-node do, before Stereum starts the validator client.

An Ansible module (WANT_JSON): takes {service, image, command, volumes, proposer_config_path, builder_api (optional)}
from the JSON file Ansible passes, or from stdin, and prints {changed, command, written}.
"""
import json
import os
import re
import sys

# flags Stereum owns per client in a cluster, replaced on every start
OWNED = {
    "LodestarValidatorService": [
        r"^--proposerSettingsFile=",
        r"^--allowDangerousTrustedPayments$",
        r"^--builder\.(urls|minBid|boostFactor|maxExecutionPayment)=",
        r"^--suggestedFeeRecipient=",
        r"^--distributed$",
        r"^--payloadLocal(=.*)?$",
    ],
    "PrysmValidatorService": [
        r"^--proposer-settings-file=",
        r"^--builder-(urls|min-bid|boost-factor|max-execution-payment)=",
        r"^--suggested-fee-recipient=",
        r"^--distributed$",
    ],
    "TekuValidatorService": [
        r"^--validators-proposer-config=",
        r"^--validators-proposer-default-fee-recipient=",
        r"^--Xbuilder-(urls|min-bid|boost-factor|max-execution-payment)=",
        r"^--Xobol-dvt-integration-enabled(=.*)?$",
    ],
    "NimbusValidatorService": [
        r"^--payload-builder-url=",
        r"^--builder-(boost-factor|min-bid|max-execution-payment)=",
        r"^--suggested-fee-recipient=",
        r"^--suggested-gas-limit=",
        r"^--distributed$",
    ],
    "LighthouseValidatorService": [r"^--suggested-fee-recipient=", r"^--gas-limit=", r"^--distributed$"],
}

# where each client finds the files rendered for it, inside its container
FILES = {
    "LodestarValidatorService": "/opt/app/validator/proposer-settings.yml",
    "PrysmValidatorService": "/opt/app/data/db/proposer-settings.json",
    "TekuValidatorService": "/opt/app/data/proposer-config.json",
}
LIGHTHOUSE_VALIDATORS = "/opt/app/validator/validators"
NIMBUS_VALIDATORS = "/opt/app/validators"


def host_path(volumes, container_path):
    """A path inside the container on the host, through the volume that holds it."""
    best = None
    for volume in volumes:
        host, _, inside = str(volume).partition(":")
        inside = inside.split(":")[0]
        if container_path == inside or container_path.startswith(inside.rstrip("/") + "/"):
            if best is None or len(inside) > len(best[1]):
                best = (host, inside)
    if best is None:
        return None
    return best[0] + container_path[len(best[1]):]


CHECK_MODE = False


def write(path, content, written):
    """Writes a file when its content differs, keeping its owner or taking the one of its directory."""
    try:
        with open(path) as f:
            if f.read() == content:
                return
    except FileNotFoundError:
        pass
    if CHECK_MODE:
        written.append(path)
        return
    directory = os.path.dirname(path)
    os.makedirs(directory, exist_ok=True)
    owner = os.stat(path) if os.path.exists(path) else os.stat(directory)
    with open(path, "w") as f:
        f.write(content)
    try:
        os.chown(path, owner.st_uid, owner.st_gid)
    except PermissionError:
        pass
    written.append(path)


def per_key(config, pubkey, field):
    return (config.get("proposer_config") or {}).get(pubkey, {}).get(field) or config["default_config"].get(field)


def lighthouse_definitions(text, keys):
    """Sets the per-key fee recipient and gas limit, as text: a YAML round trip turns unquoted 0x keys into numbers."""
    blocks = re.split(r"\n(?=- )", text)
    out = []
    for block in blocks:
        match = re.search(r"^\s*-?\s*voting_public_key:\s*[\"']?(0x[0-9a-fA-F]+)", block, re.M)
        key = keys.get(match.group(1).lower()) if match else None
        if key:
            for field, value in (("suggested_fee_recipient", '"%s"' % key["fee_recipient"]), ("gas_limit", str(int(key["gas_limit"])))):
                line = re.compile(r"^(\s+)%s:.*$" % field, re.M)
                if line.search(block):
                    block = line.sub(lambda m: "%s%s: %s" % (m.group(1), field, value), block)
                else:
                    trailing = len(block) - len(block.rstrip("\n"))
                    block = block.rstrip("\n") + "\n  %s: %s" % (field, value) + "\n" * trailing
        out.append(block)
    return "\n".join(out)


def lighthouse_builders(builder, existing):
    """Lighthouse's builder file as YAML text; the per-key validator_configs Lighthouse keeps in it are copied verbatim."""
    builder = builder or {"min_bid": "0", "builder_boost_factor": "100", "builders": []}
    lines = [
        "min_bid: %d" % int(builder.get("min_bid", "0")),
        "builder_boost_factor: %d" % int(builder.get("builder_boost_factor", "100")),
        "builders:" if builder["builders"] else "builders: []",
    ]
    for b in builder["builders"]:
        lines += [
            "  - enabled: true",
            "    url: %s" % b["url"],
            "    max_execution_payment: %d" % int(b.get("max_execution_payment") or builder.get("max_execution_payment", "0")),
        ]
        if b.get("min_bid"):
            lines.append("    min_bid: %d" % int(b["min_bid"]))
        if b.get("builder_boost_factor"):
            lines.append("    builder_boost_factor: %d" % int(b["builder_boost_factor"]))
    kept = re.search(r"^validator_configs:.*\Z", existing or "", re.M | re.S)
    if kept:
        lines.append(kept.group(0).rstrip("\n"))
    return "\n".join(lines) + "\n"


def nimbus_limits(image):
    """Whether a Nimbus image knows the minimum bid and max payment flags (26.10.1 on); an unknown tag doesn't."""
    match = re.search(r":(?:multiarch-)?v?(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.]+)?$", str(image or ""))
    if not match:
        return False
    version = tuple(int(x) for x in match.groups()[:3])
    # a pre-release of 26.10.1 comes before it
    return version > (26, 10, 1) or (version == (26, 10, 1) and not match.group(4))


def builder_flags(prefix, builder, first_only=False, limits=True):
    """Teku's and Nimbus' builder flags, in the order Stereum's other builder settings use; Nimbus takes the first builder."""
    if not builder or not builder.get("builders"):
        return []
    boost = "--%sboost-factor=%s" % (prefix, builder.get("builder_boost_factor", "100"))
    min_bid = ["--%smin-bid=%s" % (prefix, builder["min_bid"])] if builder.get("min_bid", "0") != "0" else []
    max_payment = "--%smax-execution-payment=%s" % (prefix, builder.get("max_execution_payment", "0"))
    if first_only:
        if not limits:
            # older Nimbus doesn't know the minimum bid and max payment flags
            return ["--payload-builder-url=%s" % builder["builders"][0]["url"], boost]
        # Nimbus counts no promised payment above its max, so it is always set
        return ["--payload-builder-url=%s" % builder["builders"][0]["url"], boost] + min_bid + [max_payment]
    flags = ["--%surls=%s" % (prefix, ",".join(b["url"] for b in builder["builders"]))] + min_bid
    if builder.get("max_execution_payment", "0") != "0":
        flags.append(max_payment)
    return flags + [boost]


def render(service, config, builder_api, volumes, written, image=""):
    """The flags a client gets; files are written on the way."""
    d = config["default_config"]
    entries = config.get("proposer_config") or {}
    builder = d.get("builder")
    flags = []

    if service == "LodestarValidatorService":
        out = {"proposer_config": {}, "default_config": {"fee_recipient": d["fee_recipient"], "builder": {"gas_limit": d["gas_limit"]}}}
        if builder:
            out["default_config"]["builder"].update(
                {
                    "min_bid": builder.get("min_bid"),
                    "boost_factor": builder.get("builder_boost_factor"),
                    "max_execution_payment": builder.get("max_execution_payment"),
                    "builders": builder.get("builders"),
                }
            )
        for pubkey, entry in entries.items():
            out["proposer_config"][pubkey] = {
                "fee_recipient": entry.get("fee_recipient") or d["fee_recipient"],
                "builder": {"gas_limit": entry.get("gas_limit") or d["gas_limit"]},
            }
        write(host_path(volumes, FILES[service]), json.dumps(out, separators=(",", ":")), written)
        flags.append("--proposerSettingsFile=%s" % FILES[service])
        if builder and builder.get("max_execution_payment", "0") != "0":
            flags.append("--allowDangerousTrustedPayments")
        # the stateful gloas block form, which Charon expects from distributed validators
        flags += ["--distributed", "--payloadLocal=true"]

    elif service == "PrysmValidatorService":
        default_builder = {"enabled": builder_api, "gas_limit": d["gas_limit"]}
        default_builder.update(builder or {})
        out = {
            "version": 2,
            "proposer_config": {
                pubkey: {
                    "fee_recipient": entry.get("fee_recipient") or d["fee_recipient"],
                    "gas_limit": entry.get("gas_limit") or d["gas_limit"],
                    "builder": {"enabled": builder_api, "gas_limit": entry.get("gas_limit") or d["gas_limit"]},
                }
                for pubkey, entry in entries.items()
            },
            "default_config": {"fee_recipient": d["fee_recipient"], "gas_limit": d["gas_limit"], "builder": default_builder},
        }
        write(host_path(volumes, FILES[service]), json.dumps(out, separators=(",", ":")), written)
        flags += ["--proposer-settings-file=%s" % FILES[service], "--distributed"]

    elif service == "TekuValidatorService":
        out = {
            "proposer_config": {
                pubkey: {
                    "fee_recipient": entry.get("fee_recipient") or d["fee_recipient"],
                    "builder": {"enabled": builder_api, "gas_limit": entry.get("gas_limit") or d["gas_limit"]},
                }
                for pubkey, entry in entries.items()
            },
            "default_config": {"fee_recipient": d["fee_recipient"], "builder": {"enabled": builder_api, "gas_limit": d["gas_limit"]}},
        }
        write(host_path(volumes, FILES[service]), json.dumps(out, separators=(",", ":")), written)
        flags.append("--validators-proposer-config=%s" % FILES[service])
        # its builder settings are global, per-builder overrides don't apply
        flags += builder_flags("Xbuilder-", builder)
        flags.append("--Xobol-dvt-integration-enabled=true")

    elif service == "NimbusValidatorService":
        flags += builder_flags("builder-", builder, first_only=True, limits=nimbus_limits(image))
        flags += ["--suggested-fee-recipient=%s" % d["fee_recipient"], "--suggested-gas-limit=%s" % d["gas_limit"], "--distributed"]
        # per-key settings live next to each key
        for pubkey in entries:
            directory = host_path(volumes, "%s/%s" % (NIMBUS_VALIDATORS, pubkey))
            if directory and os.path.isdir(directory):
                write(os.path.join(directory, "suggested_fee_recipient.hex"), per_key(config, pubkey, "fee_recipient") + "\n", written)
                write(os.path.join(directory, "suggested_gas_limit.json"), str(per_key(config, pubkey, "gas_limit")) + "\n", written)

    elif service == "LighthouseValidatorService":
        flags += ["--suggested-fee-recipient=%s" % d["fee_recipient"], "--gas-limit=%s" % d["gas_limit"], "--distributed"]
        validators = host_path(volumes, LIGHTHOUSE_VALIDATORS)
        if validators:
            path = os.path.join(validators, "builder_definitions.yml")
            existing = open(path).read() if os.path.exists(path) else None
            if builder or existing is not None:
                write(path, lighthouse_builders(builder, existing), written)
            definitions = os.path.join(validators, "validator_definitions.yml")
            if entries and os.path.exists(definitions):
                keys = {k.lower(): {"fee_recipient": per_key(config, k, "fee_recipient"), "gas_limit": per_key(config, k, "gas_limit")} for k in entries}
                text = open(definitions).read()
                write(definitions, lighthouse_definitions(text, keys), written)
    return flags


def main():
    global CHECK_MODE
    if len(sys.argv) > 1:
        with open(sys.argv[1]) as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)
    CHECK_MODE = bool(data.get("_ansible_check_mode"))
    service = data["service"]
    command = list(data.get("command") or [])
    with open(data["proposer_config_path"]) as f:
        config = json.load(f)
    written = []
    builder_api = data.get("builder_api")
    # older Ansible templates booleans into strings
    if isinstance(builder_api, str):
        builder_api = builder_api.strip().lower() in ("true", "yes", "1") if builder_api.strip() else None
    if builder_api is None:
        # a copy of a remote Charon's file says whether Charon serves the builder API, else its builders do
        builder_api = config["builder_api"] if isinstance(config.get("builder_api"), bool) else bool((config["default_config"].get("builder") or {}).get("builders"))
    flags = render(service, config, builder_api, data.get("volumes") or [], written, data.get("image") or "")
    owned = [re.compile(p) for p in OWNED.get(service, [])]
    kept = [c for c in command if not any(p.search(str(c)) for p in owned)]
    # Nimbus needs --payload-builder for its builder URL
    if any(f.startswith("--payload-builder-url=") for f in flags) and not any(re.match(r"^--payload-builder(=true)?$", str(c)) for c in kept):
        kept.append("--payload-builder")
    new_command = kept + flags
    print(json.dumps({"changed": new_command != command or bool(written), "command": new_command, "written": written}))


if __name__ == "__main__":
    main()
