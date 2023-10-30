<template>
  <div class="flex justify-center z-10">
    <div class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20" @click="$emit('hideModal')"></div>
    <div
      x-transition:enter="transition duration-500 ease-out"
      x-transition:enter-start="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
      x-transition:enter-end="translate-y-0 opacity-100 sm:scale-100"
      x-transition:leave="transition duration-150 ease-in"
      x-transition:leave-start="translate-y-0 opacity-100 sm:scale-100"
      x-transition:leave-end="translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95"
      class="w-full h-full absolute top-0 left-0 z-30 overflow-y-auto bg-[#2d3438] rounded-md flex flex-col justify-start items-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex flex-col justify-start items-start w-full border-b pb-1 border-gray-600">
        <span class="text-xl text-gray-200 font-bold uppercase">{{ item.name }}</span>
        <p class="text-sm text-gray-200 capitalize">
          {{ item.category }}
          <span v-if="item.category != 'service'">client</span>
        </p>
        <span class="text-sm text-gray-200">ID: {{ item.config.serviceID }}</span>
      </div>
      <div class="w-full h-[30px] space-y-4 mt-2" :class="{ shorterRowBox: isExpertModeActive }">
        <!-- expert mode row -->
        <div
          v-if="!ssvExpertModeActive && !prometheusExpertModeActive"
          class="z-10 dataTitleBox"
          @click="openExpertMode"
        >
          <img class="titleIcon" src="/img/icon/plugin-menu-icons/crown2.png" alt="icon" />

          <span>Expert Mode</span>
          <img v-if="isExpertModeActive" src="/img/icon/task-manager-icons/up.png" alt="" />
          <img v-else src="/img/icon/task-manager-icons/down.png" alt="" />
        </div>
        <div
          v-if="item.service === 'SSVNetworkService' && !isExpertModeActive && !prometheusExpertModeActive"
          class="dataTitleBox"
          @click="openSSVExpertMode"
        >
          <img class="titleIcon" src="/img/icon/plugin-menu-icons/ssv-config.png" alt="icon" />
          <span>SSV Configuration</span>
          <img v-if="ssvExpertModeActive" src="/img/icon/task-manager-icons/up.png" alt="" />
          <img v-else src="/img/icon/task-manager-icons/down.png" alt="" />
        </div>
        <div
          v-if="item.service === 'PrometheusService' && !isExpertModeActive"
          class="dataTitleBox"
          @click="openPrometheusExpertMode"
        >
          <span></span>
          <span>Prometheus Configuration</span>
          <img v-if="prometheusExpertModeActive" src="/img/icon/task-manager-icons/up.png" alt="" />
          <img v-else src="/img/icon/task-manager-icons/down.png" alt="" />
        </div>

        <!--
        option needs: {
          title: string,
          type: "select",
          value: array,
          changeValue: null
          icon: string (path)
          unit: string
          }
        -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'select')"
          :key="index"
          class="selectBox"
          :class="{
            invisible: isExpertModeActive || ssvExpertModeActive || prometheusExpertModeActive,
          }"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span class="text-center">{{ option.title }}</span>
          <div class="spaceParent">
            <select id="value" v-model="option.changeValue" @change="somethingIsChanged(option)">
              <option v-for="(rate, idx) in option.value" :key="idx" :value="rate">{{ rate }} {{ option.unit }}</option>
            </select>
          </div>
        </div>

        <!-- Fee recipient -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'text')"
          :key="index"
          class="toggleTextBox"
          :class="{
            invisible: isExpertModeActive || ssvExpertModeActive || prometheusExpertModeActive,
          }"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span>{{ option.title }}</span>
          <Transition name="slide-up">
            <img
              v-if="option.buttonState"
              class="buttonOff"
              src="/img/icon/plugin-menu-icons/confirm.png"
              alt="icon"
              @click="buttonOff(option)"
            />
            <img
              v-else
              class="buttonOn"
              src="/img/icon/plugin-menu-icons/edit2.png"
              alt="icon"
              @click="buttonOn(option)"
            />
          </Transition>
          <input
            v-model="option.changeValue"
            class="toggleTextInput"
            type="text"
            :class="{
              disabled:
                !option.buttonState &&
                (option.changeValue === null || option.changeValue === '0x0000000000000000000000000000000000000000'),
            }"
            @input="somethingIsChanged(option)"
          />
        </div>

        <!--
        option needs: {
          title: string,
          type: "action",
          action: string,
          icon: string (path)
          }
        -->
        <!-- toggle btn -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'action')"
          :key="index"
          class="actionBox"
          :class="{
            invisible: isExpertModeActive || ssvExpertModeActive || prometheusExpertModeActive,
          }"
        >
          <img :src="option.icon" alt="icon" />
          <span class="actionBoxTitle">{{ option.title }}</span>
          <div class="w-full flex justify-end items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="option.changeValue"
                :disabled="option.disabled"
                type="checkbox"
                name="check-button"
                class="sr-only peer"
                checked
                @change="somethingIsChanged(option)"
              />
              <div
                class="w-12 h-5 rounded-full peer bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-green-600 peer-checked:shadow-inner peer-checked:border-green-600 peer-checked:shadow-gray-600"
              ></div>
            </label>
          </div>
        </div>
        <!-- toggle btn -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'toggle')"
          :key="index"
          class="actionBox"
          :class="{
            invisible: isExpertModeActive || ssvExpertModeActive || prometheusExpertModeActive,
          }"
        >
          <img :src="option.icon" alt="icon" />
          <span class="actionBoxTitle">{{ option.title }}</span>
          <div class="w-full flex justify-end items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="option.changeValue"
                :disabled="option.disabled"
                type="checkbox"
                name="check-button"
                class="sr-only peer"
                checked
                @change="somethingIsChanged(option)"
              />
              <div
                class="w-12 h-5 rounded-full peer bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-green-600 peer-checked:shadow-inner peer-checked:border-green-600 peer-checked:shadow-gray-600"
              ></div>
            </label>
          </div>
        </div>
      </div>
      <!-- expert mode textarea -->
      <div
        class="expertTable"
        :class="{
          showExpertTable: isExpertModeActive || ssvExpertModeActive || prometheusExpertModeActive,
        }"
      >
        <div v-if="isExpertModeActive" class="expertMode">
          <textarea
            v-model="item.yaml"
            class="font-mono w-full h-full bg-[#171a1b] whitespace-pre text-sm text-gray-200 p-4 overflow-x-scroll overflow-y-scroll"
            @input="somethingIsChanged"
          ></textarea>
        </div>
        <div v-if="ssvExpertModeActive" class="expertMode">
          <textarea
            v-model="item.ssvConfig"
            class="overflow-x-scroll overflow-y-scroll font-mono w-full h-full bg-[#171a1b] whitespace-pre text-sm text-gray-200 p-4"
            @input="somethingIsChanged"
          ></textarea>
        </div>
        <div v-if="prometheusExpertModeActive" class="expertMode">
          <textarea
            v-model="item.prometheusConfig"
            class="overflow-x-scroll overflow-y-scroll font-mono w-full h-full bg-[#171a1b] whitespace-pre text-sm text-gray-200 p-4"
            @input="somethingIsChanged"
          ></textarea>
        </div>
      </div>
      <div class="w-full flex justify-between items-center absolute bottom-1 px-2">
        <!-- service version -->
        <p class="w-1/4 text-sm text-gray-200">
          version: <span>{{ item.config.imageVersion }}</span>
        </p>
        <!-- close text -->
        <span class="w-1/4 text-sm text-red-400">{{ $t("exitValidatorModal.clickClose") }}</span>
        <!-- confirm button box -->
        <button
          v-if="!nothingsChanged"
          class="w-1/8 px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#609879] rounded-lg hover:bg-[#4c7960] focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          @click="confirmExpertChanges(item, false)"
        >
          Confirm
        </button>

        <button v-else class="w-1/8 px-6 py-2 font-medium tracking-wide text-white capitalize rounded-lg disabled">
          <span>Confirm</span>
        </button>
        <button
          v-if="!nothingsChanged"
          class="w-1/8 px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#609879] rounded-lg hover:bg-[#4c7960] focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          @click="confirmExpertChanges(item, true)"
        >
          Confirm & Restart
        </button>
        <button v-else class="w-1/8 px-6 py-2 font-medium tracking-wide text-white capitalize rounded-lg disabled">
          <span>Confirm & Restart</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useNodeStore } from "@/store/theNode";
import { useRestartService } from "@/composables/services";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    position: {
      type: [Number, String],
      required: false,
    },
  },
  data() {
    return {
      updateSelect: "auto",
      enterPortIsEnabled: false,
      isExpertModeActive: false,
      ssvExpertModeActive: false,
      prometheusExpertModeActive: false,
      prometheusConfig: null,
      ramUsage: null,
      isRamUsageActive: false,
      bindingIsOn: false,
      bindingIp: "126.0.23.22",
      enteredPort: "9006",
      checkedPrunning: null,
      editableData: null,
      changed: false,
      nothingsChanged: true,
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useNodeStore, {
      hideConnectedLines: "hideConnectedLines",
    }),
  },
  mounted() {
    this.readService();
  },
  // watch: {
  //   changed: function (newValue, oldValue) {

  //   },
  // },
  methods: {
    openDocs(docsUrl) {
      window.open(docsUrl, "_blank");
      if (this.currentNetwork.network === "gnosis") window.open("https://docs.gnosischain.com/node/", "_blank");
    },

    somethingIsChanged(item) {
      if (item && item.title) item.changed = true;
      this.nothingsChanged = false;
    },

    async readService() {
      this.item.yaml = await ControlService.getServiceYAML(this.item.config.serviceID);

      // this.updateSelect = this.checkAutoUpdate(
      //   [...this.item.yaml.match(new RegExp("(autoupdate: )(.*)(\\n)"))][2]
      // );

      if (this.item.service === "SSVNetworkService") {
        this.item.ssvConfig = await ControlService.readSSVNetworkConfig(this.item.config.serviceID);
      }
      if (this.item.service === "PrometheusService") {
        this.item.prometheusConfig = await ControlService.readPrometheusConfig(this.item.config.serviceID);
        this.prometheusConfig = this.item.prometheusConfig;
      }
      this.item.expertOptions = this.item.expertOptions.map((option) => {
        if (this.item.yaml.includes("isPruning: true")) {
          option.disabled = true;
          if (option.type === "action") option.changeValue = true;
        } else {
          if (option.type === "action") option.changeValue = false;
          option.disabled = false;
        }
        if (option.type === "select" || option.type === "text" || option.type === "toggle") {
          if (this.item.service === "LighthouseValidatorService" && option.title === "Doppelganger") {
            option.changeValue = this.item.yaml.indexOf(option.pattern[0]) === -1 ? false : true;
          } else {
            option.changeValue = this.item.yaml.match(new RegExp(option.pattern[0]))
              ? [...this.item.yaml.match(new RegExp(option.pattern[0]))][2]
              : "";
          }
        }
        return {
          ...option,
          buttonState: false,
          runningAction: false,
        };
      });
    },

    async writeService() {
      this.item.yaml = this.item.yaml.replace(
        new RegExp("(autoupdate: )(.*)(\\n)"),
        "$1" + this.checkAutoUpdate() + "$3"
      );

      const ipReg = /^(\d{1,3}\.){3}\d{1,3}$/;
      this.item.expertOptions.forEach((option) => {
        let validValue = false;
        if (option.type === "select" && option.value.length > 0) {
          for (const el of option.value) {
            validValue = el === option.changeValue ? true : validValue;
          }
        }
        if (
          option.changeValue != undefined &&
          option.changeValue != null &&
          (!isNaN(option.changeValue) || option.changeValue.match(ipReg) || validValue)
        ) {
          if (option.changed) {
            for (let i = 0; i < option.pattern.length; i++) {
              if (this.item.service === "LighthouseValidatorService" && option.title === "Doppelganger") {
                this.item.yaml =
                  option.changeValue && !this.item.yaml.match(new RegExp(option.pattern[i]))
                    ? this.item.yaml.replace("  - vc\n", `  - vc\n  ${option.pattern[i]}\n`)
                    : this.item.yaml.replace(new RegExp(option.pattern[i]), "\n").replace(/^\s*\n/m, "");
              } else if (option.title === "External IP Address") {
                let reg = "";
                let replacement = "";
                const extIPCmd = [
                  {
                    name: "Lighthouse",
                    reg: "  - bn\n",
                    replacement: `  - bn\n  - --enr-address=${option.changeValue}\n`,
                  },
                  {
                    name: "Lodestar",
                    reg: "  - beacon\n",
                    replacement: `  - beacon\n  - --enr.ip=${option.changeValue}\n`,
                  },
                  {
                    name: "Nimbus",
                    reg: "command:\n",
                    replacement: `command:\n  - --nat:extip:${option.changeValue}\n`,
                  },
                  {
                    name: "Prysm",
                    reg: "--accept-terms-of-use=true",
                    replacement: `--accept-terms-of-use=true --p2p-host-ip=${option.changeValue}`,
                  },
                  {
                    name: "Teku",
                    reg: "command:\n",
                    replacement: `command:\n  - --p2p-advertised-ip=${option.changeValue}\n`,
                  },
                ];
                for (const el of extIPCmd) {
                  if (el.name === this.item.name) {
                    reg = el.reg;
                    replacement = el.replacement;
                  }
                }
                this.item.yaml =
                  option.changeValue === "" && this.item.yaml.match(new RegExp(option.pattern[i]))
                    ? this.item.yaml.replace(new RegExp(option.pattern[i]), "\n").replace(/^\s*\n/m, "")
                    : option.changeValue !== "" && this.item.yaml.match(new RegExp(option.pattern[i]))
                    ? this.item.yaml.replace(new RegExp(option.pattern[i]), "$1" + option.changeValue + "$3")
                    : option.changeValue !== "" && !this.item.yaml.match(new RegExp(option.pattern[i]))
                    ? this.item.yaml.replace(new RegExp(reg), replacement)
                    : this.item.yaml;
              } else if (option.title === "External TCP/UDP port" && (i === 2 || i === 3)) {
                let tcp_udp = i === 2 ? "/tcp" : "/udp";
                this.item.yaml = this.item.yaml.replace(
                  new RegExp(option.pattern[i], "m"),
                  "$1" + ":" + option.changeValue + ":" + option.changeValue + tcp_udp
                );
              } else {
                this.item.yaml = this.item.yaml.replace(
                  new RegExp(option.pattern[i]),
                  "$1" + option.changeValue + "$3"
                );
              }
            }
          }
          option.changed = false;
        }
      });

      if (this.item.service === "SSVNetworkService")
        await ControlService.writeSSVNetworkConfig({
          serviceID: this.item.config.serviceID,
          config: this.item.ssvConfig,
        });
      if (this.item.service === "PrometheusService" && this.item.prometheusConfig != this.prometheusConfig) {
        if (!this.item.yaml.includes("overwrite: false")) {
          this.item.yaml = this.item.yaml.trim() + "\noverwrite: false";
        }
        await ControlService.writePrometheusConfig({
          serviceID: this.item.config.serviceID,
          config: this.item.prometheusConfig,
        });
      }
      await ControlService.writeServiceYAML({
        id: this.item.config.serviceID,
        data: this.item.yaml,
        service: this.item.service,
      });
    },

    checkAutoUpdate(val) {
      if (val != undefined && val != null && !isNaN(val)) {
        val = val == "true";
        return val ? "auto" : "manual";
      }
      return this.updateSelect == "manual" ? "false" : "true";
    },
    openExpertMode() {
      this.isExpertModeActive = !this.isExpertModeActive;
    },
    openSSVExpertMode() {
      this.ssvExpertModeActive = !this.ssvExpertModeActive;
    },
    openPrometheusExpertMode() {
      this.prometheusExpertModeActive = !this.prometheusExpertModeActive;
    },
    endpointPortTrunOff() {
      this.enterPortIsEnabled = false;
    },
    endpointPortTrunOn() {
      this.enterPortIsEnabled = true;
    },
    buttonOn(option) {
      option.buttonState = true;
    },
    buttonOff(option) {
      option.buttonState = false;
    },
    //Prunning & Resync Handler
    actionHandler(el) {
      if (el.name === "Geth") {
        el.expertOptions
          .filter((item) => {
            return item.title === "Pruning";
          })
          .map((item) => {
            if (item.changeValue) {
              item.displayWarningModal = true;
              this.$emit("prunningWarning", item);
            }
          });
      }
      if (el.category === "execution" || el.category === "consensus") {
        el.expertOptions
          .filter((item) => {
            return item.title === "Resync";
          })
          .map((item) => {
            if (item.changeValue) {
              item.displayResyncModal = true;
              this.$emit("resyncWarning", item);
            }
          });
      }
    },
    // Resync Handler
    // actionResyncHandler(el) {
    //   if (el.category === "execution" || el.category === "consensus") {
    //     el.expertOptions
    //       .filter((item) => {
    //         return item.title === "Resync";
    //       })
    //       .map((item) => {
    //         if (item.changeValue) {
    //           item.displayResyncModal = true;
    //           this.$emit("resyncWarning", item);
    //         }
    //       });
    //   }
    // },
    async confirmExpertChanges(el, restart) {
      this.$emit("hideModal");
      this.hideConnectedLines = false;
      await this.writeService();
      el.expertOptionsModal = false;
      this.actionHandler(el);
      if (restart) await useRestartService(el);
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar-corner:vertical {
  background: black !important;
  border-color: #232323;
}
::-webkit-scrollbar-corner:horizontal {
  background: black !important;
  border-color: #232323;
}
::-webkit-scrollbar-track:vertical {
  background-color: transparent;
}
::-webkit-scrollbar-track:horizontal {
  background-color: transparent;
}
.expert-modal {
  width: 64%;
  height: 84%;
  background-color: #33393e;
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 5px;
  border: 3px solid #adadad;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 1002;
  cursor: default;
}
.expert-modal .serviceDetails {
  width: 95%;
  height: 30px;
  max-height: 30px;
  border-bottom: 1px solid #adadad;
  border-radius: 9px 9px 0 0;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.serviceDetails .nameSpan {
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: 4px;
  color: #d3d3d3;
  text-transform: uppercase;
}
.serviceDetails .category {
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: -5%;
  color: #ababab;
  text-transform: uppercase;
}
.serviceDetails .serviceId {
  font-size: 0.7rem;
  font-weight: 500;
  color: #ababab;
  justify-self: end;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.dataTitleBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 3px 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-duration: 200ms;
  z-index: 10;
}
.docBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 2px 2px 2px 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 100%;
  transition-duration: 200ms;
}
.docBox .docTitle {
  width: 100%;
  height: 100%;
  grid-column: 5/8;
  grid-row: 1/2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.docBox .openBtn {
  grid-column: 9/11;
  grid-row: 1/2;
  /* width: 100%;
  height: 100%; */
  padding-top: 2px;
  background-color: #264744;
  border-radius: 35px;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  color: #dbdbdb;
  cursor: pointer;
}
.docBox .openBtn:hover {
  background-color: #1a2e2a;
}
.docBox .openBtn:active {
  transform: scale(0.95);
}
.selectBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;
}
.selectBox .spaceParent {
  grid-column: 3/4;
  grid-row: 1;
  width: 100%;
  height: 21px;
  margin-top: 1px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.selectBox .spaceParent select {
  width: 78%;
  height: 94%;
  margin-right: 3px;
  border-radius: 25px;
  color: #4c4c4c;
  padding: 0;
  padding-left: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.spaceParent select option {
  height: 10px;
}

.selectBox img {
  grid-column: 1/2;
  margin-left: 20px;
  width: 20px;
  height: 20px;
}
.toggleTextBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 1px 4px 0 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  transition-duration: 200ms;
}

.dataTitleBox:hover {
  border: 1px solid #d6d6d6;
  color: #d9d9d9;
}

.dataTitleBox:active {
  border: 1px solid #2d2d2d;
}

.dataTitleBox img,
.docBox img {
  width: 20px;
  height: 20px;
}
.actionBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 1px 3px 1px 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: default;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  transition-duration: 200ms;
  position: relative;
}
.actionBox img {
  grid-column: 1/2;
  grid-row: 1;
  width: 20px;
  height: 20px;
}
.actionBox .actionBoxTitle {
  grid-column: 2/5;
  grid-row: 1;
  text-align: center;
  margin-left: -14px;
  text-transform: uppercase;
}
.updateService {
  grid-column: 5/6;
  grid-row: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 10px;
}
.updateService select,
.spaceParent select {
  text-align-last: center;
  color: #232323;
  font-size: 85%;
  border-radius: 10px;
  height: 85%;
  width: 100%;
}

*:focus {
  outline: none;
}
.actionBox .initiateAction {
  grid-column: 5/6;
  grid-row: 1;
  width: 100%;
  height: 96%;
  background-color: rgb(49, 88, 66);
  border-radius: 20px;
  border: 1px solid #8a8a8a;
  padding: 2px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(207, 207, 207);
  box-shadow: 0 1px 3px 1px rgb(91, 91, 91);
  justify-self: end;
  cursor: pointer;
  transition-duration: 200ms;
}
.actionBox .initiateAction:hover {
  border: 1px solid #a2a2a2;
  background-color: rgb(39, 68, 51);
}
.actionBox .initiateAction:active {
  transform: scale(0.95);
}
.actionBox .startAction {
  grid-column: 5/6;
  grid-row: 1;
  width: 100%;
  height: 99%;
  background-color: #238dce;
  border-radius: 20px;
  border: 1px solid #0c81c9;
  padding: 2px;
  font-size: 0.6rem;
  font-weight: 400;
  text-transform: capitalize;
  color: rgb(239, 239, 239);
  justify-self: end;
  text-align: center;
}
.actionBox .toggleBox {
  grid-column: 5/6;
  grid-row: 1;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  color: rgb(235, 235, 235);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 35%;
  height: 94%;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  height: 100%;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 3px 3px 5px #454747 inset;
  background-color: rgb(216, 216, 216);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 70%;
  width: 35%;
  left: 5%;
  bottom: 15%;
  background-color: #abb0b2;
  box-shadow: 0 1px 3px 1px rgb(89, 89, 89);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  display: flex;
  justify-content: center;
  align-items: center;
}

input:checked + .slider {
  background-color: #1ea669;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);

  background-color: #e6e6e6;
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
.toggleTextBox .toggleTextInput {
  grid-column: 5/7;
  grid-row: 1;
  width: 100%;
  height: 94%;
  border-radius: 20px;
  padding: 0;
  padding-left: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(44, 44, 44);
  justify-self: end;
}
.disabled {
  opacity: 0.6 !important;
  background-color: rgb(104, 104, 104) !important;
  pointer-events: none !important;
}
.toggleTextBox span {
  grid-column: 2/5;
  grid-row: 1;
  width: 96%;
  height: 100%;
  text-align: center;
  text-transform: capitalize;
}
.toggleTextBox .buttonOn {
  grid-column: 4/5;
  grid-row: 1;
  width: 20px;
  height: 20px;
  cursor: pointer;
  justify-self: end;
  margin-right: 10px;
}
.toggleTextBox .buttonOff {
  grid-column: 4/5;
  grid-row: 1;
  width: 20px;
  height: 20px;
  justify-self: end;
  margin-right: 10px;
  cursor: pointer;
}
.portOff:active,
.portOn:active,
.buttonOff:active,
.buttonOn:active {
  transform: scale(0.9);
  box-shadow: none;
}
.toggleTextBox .titleIcon {
  grid-column: 1/2;
  grid-row: 1;
  width: 20px;
  height: 20px;
  align-self: center;
}
.expertTable {
  width: 100%;
  height: 100%;
  max-height: 320px;
  justify-content: center;
  align-items: center;
  display: none;
}
.showExpertTable {
  display: flex;
}

.expertTable .expertMode {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expertTable .expertMode .editContent {
  width: 98%;
  height: 98%;
  background-color: rgb(46, 46, 46);
  border-color: #404248;
  border-radius: 5px;
  resize: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d9d9d9;
  white-space: nowrap;
  font-family: "Courier New";
}
.editContent::-webkit-scrollbar {
  background-color: transparent;
  width: 4px;
  height: 5px;
}
.editContent::-webkit-scrollbar-thumb {
  background-color: #7787a1;
  border-radius: 6px;
  cursor: pointer !important;
}
.editContent::-webkit-scrollbar-thumb:hover {
  background-color: #496fad;
  transform: scale(1.1);
}

.expert-modal .btn-box {
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 50px;
}
.expert-modal .btn-box .exit-btn {
  grid-column: 2/3;
  margin: 0 auto;
  grid-row: 1;
  color: #e24949;
  font-size: 0.6rem;
  font-weight: 500;
  align-self: flex-end;
}

.expert-modal .btn-box .confirmBtn {
  grid-column: 3/4;
  grid-row: 1;
  margin-right: 20px;
  width: 90%;
  height: 25px;
  padding: 3px;
  border: 2px solid #609879;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  justify-self: flex-end;
  transition-duration: 150ms;
}
.expert-modal .btn-box .confirmBtn span {
  font-size: 0.8rem;
  font-weight: 700;
  color: #609879;
  text-align: center;
}
.expert-modal .btn-box .confirmBtn:hover {
  background-color: #609879;
}
.expert-modal .btn-box .confirmBtn:hover span {
  color: #e0e0e0;
}
.expert-modal .btn-box .confirmBtn:active {
  transform: scale(0.95);
}
.expertMode::-webkit-scrollbar {
  width: 5px;
  margin: 5px 0;
}

.invisible {
  display: none !important;
}
.disabledBtn {
  grid-column: 3/4;
  grid-row: 1;
  margin-right: 20px;
  width: 90%;
  height: 25px;
  padding: 3px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  justify-self: flex-end;
  transition-duration: 150ms;
  pointer-events: none !important;
  box-shadow: none !important;
  opacity: 0.7 !important;
  color: #335844;
  border: 2px solid #335844;
}
.serviceVersion {
  font-size: 0.9rem;
  font-weight: 400;
  color: #a7a7a7;
  align-self: flex-end;
  justify-self: flex-start;
  text-align: center;
  text-transform: capitalize;
  margin-left: 8px;
}
.serviceVersion span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #a7a7a7;
  align-self: flex-end;
  justify-self: flex-start;
  text-align: center;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
