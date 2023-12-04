<template>
  <div class="obol-modal-plugin_parent">
    <div class="obol-modal-plugin_header">
      <span>{{ distrubutedValidatorGenerator ? "DISTRIBUTED VALIDATOR GENERATION" : "GENERATING NEW ENR" }}</span>
    </div>
    <div
      class="obol-modal-plugin_spaceWindow"
      :style="{
        backgroundImage: backupDistributedValidator || distributedCompleted ? distrubutedValidatorAnimation : '',
      }"
    >
      <div v-if="!backupDistributedValidator" class="obol-modal-plugin_wapper">
        <span v-if="!distrubutedValidatorGenerator">{{ generatedENR }}</span>
        <div v-else class="span-wrapper">
          <span v-for="item in dummmmmmmy" :key="item">{{ item }}</span>
        </div>
      </div>
    </div>
    <div
      :class="[
        'obol-modal-plugin_btn',
        !enrIsGenerating ? 'activeBtn' : '',
        deactivateBtnToWaitForLogs ? 'deactivate' : '',
      ]"
      @click="btnHandling"
    >
      {{ enrBtnToShow }}
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  data() {
    return {
      enrGeneratedSuccess: false,
      enrGeneratedFailed: false,
      enrGeneratedContinue: false,
      dummmmmmmy: [],
      backupDistributedValidator: false,
      distrubutedValidatorAnimation: "url('./img/icon/service-icons/obol_animation.gif')",
      nukeNode: "url('./img/icon/service-icons/obol_animation.gif')",
      distributedCompleted: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      enrIsGenerating: "enrIsGenerating",
      generatorPlugin: "generatorPlugin",
      obolDashboard: "obolDashboard",
      generatedENR: "generatedENR",
      continueForExistENR: "continueForExistENR",
      distrubutedValidatorGenerator: "distrubutedValidatorGenerator",
      deactivateBtnToWaitForLogs: "deactivateBtnToWaitForLogs",
      depositFile: "depositFile",
    }),
    enrBtnToShow() {
      if (
        this.enrIsGenerating &&
        !this.enrGeneratedSuccess &&
        !this.enrGeneratedFailed &&
        !this.enrGeneratedContinue &&
        !this.distrubutedValidatorGenerator
      ) {
        return "GENERATING..."; //generating
      } else if (
        this.enrGeneratedSuccess &&
        !this.enrGeneratedFailed &&
        !this.enrIsGenerating &&
        !this.enrGeneratedContinue &&
        !this.distrubutedValidatorGenerator
      ) {
        return "BACKUP ENR"; //generated
      } else if (
        this.enrGeneratedFailed &&
        !this.enrGeneratedSuccess &&
        !this.enrIsGenerating &&
        !this.enrGeneratedContinue &&
        !this.distrubutedValidatorGenerator
      ) {
        return "RETURN"; //failed
      } else if (
        this.enrGeneratedContinue &&
        !this.enrGeneratedFailed &&
        !this.enrIsGenerating &&
        !this.enrGeneratedSuccess &&
        !this.distrubutedValidatorGenerator
      ) {
        return "CONTINUE"; //continue
      } else if (this.distrubutedValidatorGenerator && !this.enrIsGenerating) {
        return "Y of X CONNECTED";
      } else if (this.backupDistributedValidator && !this.enrIsGenerating) {
        return "BACKUP";
      } else if (this.distributedCompleted && !this.enrIsGenerating && !this.backupDistributedValidator) {
        return "COMPLETE";
      }

      return "RETURN"; //failed
    },
  },

  mounted() {
    if (!this.distrubutedValidatorGenerator && this.enrIsGenerating) {
      this.randomDummyText();
    }
    this.generatedENR = "";
    if (this.distrubutedValidatorGenerator && !this.enrIsGenerating) {
      this.randomDummyLog();
    }
  },
  methods: {
    btnHandling() {
      if (this.enrBtnToShow === "GENERATING...") {
        console.log("GENERATING...");
      } else if (this.enrBtnToShow === "BACKUP ENR") {
        this.saveToFile();
        this.enrIsGenerating = false;
        this.enrGeneratedSuccess = false;
        this.enrGeneratedFailed = false;
        this.enrGeneratedContinue = true;
      } else if (this.enrBtnToShow === "RETURN") {
        this.enrIsGenerating = true;
        this.enrGeneratedSuccess = false;
        this.enrGeneratedFailed = false;
        this.enrGeneratedContinue = false;
        this.generatorPlugin = false;
        this.obolDashboard = false;
        this.continueForExistENR = false;
      } else if (this.enrBtnToShow === "CONTINUE") {
        this.enrIsGenerating = true;
        this.enrGeneratedSuccess = false;
        this.enrGeneratedFailed = false;
        this.enrGeneratedContinue = false;
        this.generatorPlugin = false;
        this.obolDashboard = true;
        this.continueForExistENR = true;
      } else if (this.enrBtnToShow === "Y of X CONNECTED") {
        this.backupDistributedValidator = true;
        this.distrubutedValidatorGenerator = false;
        this.distributedCompleted = false;
      } else if (this.enrBtnToShow === "BACKUP") {
        this.backupDistributedValidator = false;
        this.distrubutedValidatorGenerator = false;
        this.distributedCompleted = true;
      } else if (this.enrBtnToShow === "COMPLETE") {
        this.backupDistributedValidator = false;
        this.distrubutedValidatorGenerator = false;
        this.distributedCompleted = false;
        this.generatorPlugin = false;
        this.obolDashboard = true;
        this.continueForExistENR = true;
        this.depositFile = true;
      }
    },
    //dummy enr generator
    randomDummyText() {
      setTimeout(() => {
        let text = "";
        let possible =
          "IS4QHCYrYZbAKWCBRlAy5zzaDZXJBGkcnh4MHcBFZntXNFrdvJjX04jRzjzCBOonrkTfj499SZuOh8R33Ls8RRcy5wBgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQPKY0yuDUmstAHYpMa2_oxVtw0RW_QAdpzBQA8yWM0xOIN1ZHCCdl8";

        const randomNumber = Math.random();

        if (randomNumber < 0.5) {
          this.enrIsGenerating = false;
          this.enrGeneratedSuccess = false;
          this.enrGeneratedFailed = true;
          this.enrGeneratedContinue = false;
          console.log("failed");
        } else {
          for (let i = 0; i < 100; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          this.enrIsGenerating = false;
          this.enrGeneratedSuccess = true;
          this.enrGeneratedFailed = false;
          this.enrGeneratedContinue = false;
          this.generatedENR = "enr:-" + text;
        }
      }, 3000);
    },
    //dummy log generator
    randomDummyLog() {
      let testLog = [
        "Unable to find image 'obolnetwork/charon:v0.17.2' locally",
        "v0.17.2: Pulling from obolnetwork/charon",
        "0bc8ff246cb8: Pull complete",
        "354ff387eaea: Pull complete",
        "df297ee79abd: Pull complete",
        "20bedba6b33d: Pull complete",
        "defe620960ca: Pull complete",
        "eab7f61f4ebd: Pull complete",
        "4f4fb700ef54: Pull complete",
        "77703a2bc7cb: Pull complete",
        "Digest: sha256:95f07300a8e78d0d9b98aa7eec30fb40b03ef48d9ad32312390b3f984f9ec7f1",
        "Status: Downloaded newer image for obolnetwork/charon:v0.17.2",
        '16:03:12.139 INFO cmd        Parsed config                            {"data-dir": ".charon", "definition-file": "https://api.obol.tech/dv/0x6a4b32218e6fed4ab78a70d609c0694d096c886bde9c292af376b19ef08d84df", "help": "false", "keymanager-address": "", "keymanager-auth-token": "xxxxx", "log-color": "auto", "log-format": "console", "log-level": "info", "no-verify": "false", "p2p-allowlist": "", "p2p-denylist": "", "p2p-disable-reuseport": "false", "p2p-external-hostname": "", "p2p-external-ip": "", "p2p-relays": "[https://0.relay.obol.tech]", "p2p-tcp-address": "[]", "publish": "true", "publish-address": "https://api.obol.tech", "shutdown-delay": "1s"}',
        '16:03:12.139 INFO dkg        Charon DKG starting                      {"version": "v0.17.2", "git_commit_hash": "eb8870d", "git_commit_time": "2023-11-08T14:23:43Z"}',
        '16:03:12.431 INFO dkg        Cluster definition downloaded from URL   {"URL": "https://api.obol.tech/dv/0x6a4b32218e6fed4ab78a70d609c0694d096c886bde9c292af376b19ef08d84df", "definition_hash": "0x1da92423171bb88dd2967d305597194f326e47b5993891c22b7946296c3ca059"}',
        "16:03:12.453 INFO dkg        Starting local P2P networking peer",
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "lovely-pen", "index": 0, "address": "0x0Dc93087891FE8a59A31109C7ac643cdE7835711"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "tired-father", "index": 1, "address": "0x3b9988E318874E5a2fBf32e3521951756d4f43af", "you": "⭐️"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "jealous-sale", "index": 2, "address": "0x48aB8492ff201c8eae9F89B17143dEd620b3bd06"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "wild-wood", "index": 3, "address": "0x5b3Bca24f0CaCB5240F238865DB55bCAcf83228D"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "puzzled-nest", "index": 4, "address": "0x6Da1d70907D948b63cf229BC4678Cb41F4EFFB46"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "motionless-site", "index": 5, "address": "0xE32c61f880Fcae8898AA32840A15330AE30758ff"}',
        '16:03:12.453 INFO dkg        Peer summary                             {"peer": "vivacious-country", "index": 6, "address": "0xF2890F9E1aE105cF07366D8d667a438F99A167Ab"}',
        '16:03:12.551 INFO dkg        Resolved new relay                       {"peer": "dazzling-mirror", "url": "https://0.relay.obol.tech", "addrs": "[/ip4/34.141.223.64/tcp/3610]"}',
        "16:03:13.454 INFO dkg        LibP2P not accepting incoming connec,tions since --p2p-tcp-addresses empty",
        "16:03:13.472 INFO dkg        Waiting to connect to all peers...",
        '16:03:14.318 INFO dkg        Connected to peer 1 of 6                 {"peer": "puzzled-nest"}',
        '16:03:14.337 INFO dkg        Connected to peer 2 of 6                 {"peer": "lovely-pen"}',
        '16:03:14.377 INFO dkg        Connected to peer 3 of 6                 {"peer": "motionless-site"}',
        '16:03:14.606 INFO dkg        Connected to peer 4 of 6                 {"peer": "vivacious-country"}',
        '16:03:14.770 INFO dkg        Connected to peer 5 of 6                 {"peer": "wild-wood"}',
        '16:03:15.398 INFO dkg        Connected to peer 6 of 6                 {"peer": "jealous-sale"}',
        "16:03:15.649 INFO dkg        All peers connected, starting DKG ceremony",
        "16:03:42.363 ERRO dkg        Sync failed to peer: client connect: open connection: failed to dial: failed to dial 16Uiu2HAmDop5bmMMZPBr5L1D8VGTjTuVCRWPWJPubUetWJoXyKNg:",
        '  * [/ip4/34.141.223.64/tcp/3610/p2p/16Uiu2HAmEDxrw91R8XANWfLFyFoNxm9CzDSM48KeLrC2xjsTS7oN/p2p-circuit] error opening relay circuit: NO_RESERVATION (204) {"peer": "lovely-pen"}',
        "        dkg/sync/client.go:235 .connect",
        "        dkg/sync/client.go:83 .Run",
        "        dkg/dkg.go:456 .func1",
        '16:03:42.363 WARN dkg        Couldnt publish lock file to Obol API: failed to call POST endpoint: Post "https://api.obol.tech/lock": context canceled',
        "        app/obolapi/api.go:97 .httpPost",
        "        app/obolapi/api.go:66 .PublishLock",
        "        dkg/dkg.go:1043 .writeLockToAPI",
        "        dkg/dkg.go:338 .Run",
        "        cmd/dkg.go:35 .func1",
        "        cmd/cmd.go:80 .func1",
        "        main.go:21 .main",
      ];
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex < testLog.length) {
          this.dummmmmmmy.push(testLog[currentIndex]);
          currentIndex++;
        } else {
          this.deactivateBtnToWaitForLogs = false;
          clearInterval(intervalId);
        }
      }, 500);
    },
    //export enr to file
    saveToFile() {
      const dataToSave = this.generatedENR;
      const blob = new Blob([dataToSave], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ENR.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
.deactivate {
  opacity: 0.5;
  box-shadow: none;
  pointer-events: none;
  cursor: not-allowed;
}
.obol-modal-plugin_parent {
  width: 95%;
  height: 90%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.obol-modal-plugin_header {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1% 0;
}
.obol-modal-plugin_header span {
  color: #dbdbdb;
  font-size: 1.2rem;
  font-weight: 600;
}
.obol-modal-plugin_spaceWindow {
  width: 90%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  padding: 1%;
  cursor: text;
  color: #dbdbdb;
  font-size: 100%;
  font-weight: 400;
  overflow-y: scroll;
  background-size: cover;
  background-position: center;
}
.obol-modal-plugin_wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
}
.span-wrapper {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.obol-modal-plugin_spaceWindow span {
  width: 100%;
  height: 20%;
  font-size: 1rem;
  font-weight: 400;
  flex-shrink: 0;
  word-wrap: break-word;
}
.obol-modal-plugin_btn {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  cursor: pointer;
  color: #dbdbdb;
  font-size: 1rem;
  font-weight: 600;
  margin: 2% 0;
}
.obol-modal-plugin_btn:hover {
  transition-duration: 100ms;
  background-color: #1e3a3f;
}
.obol-modal-plugin_btn:active {
  transition-duration: 100ms;
  background-color: #1e3a3f;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.activeBtn {
  color: #2fe4ab;
}
.distributed-confirmed {
  background-size: cover;
  background-position: center;
}
</style>
