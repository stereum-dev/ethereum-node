<template>
  <div class="obol-modal-plugin_parent">
    <div class="obol-modal-plugin_header">
      <span>{{ distrubutedValidatorGenerator ? "DISTRIBUTED VALIDATOR GENERATION" : "GENERATING NEW ENR" }}</span>
    </div>
    <div class="obol-modal-plugin_spaceWindow">
      <span v-if="!distrubutedValidatorGenerator">{{ generatedENR }}</span>
      <div v-else class="span-wrapper">
        <span v-for="item in dummmmmmmy" :key="item">{{ item }}</span>
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
        console.log("BACKUP ENR");
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
        console.log("Y of X CONNECTED");
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
        "2021-08-04 12:00:00.000000 | INFO | 0x00000000",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000001",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000002",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000003",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000004",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000005",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000006",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000007",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000008",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000009",
        "2021-08-04 12:00:00.000000 | INFO | 0x00000010",
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
      }, 1000);
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
</style>
