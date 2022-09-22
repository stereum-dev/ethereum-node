<template>
  <div class="expert-parent">
    <div class="opacityBackground" @click="$emit('hideModal')"></div>
    <div class="expert-modal" :style="{ left: `${position}%` }">
      <div class="serviceDetails">
        <span class="nameSpan">{{ item.name }}</span>
        <p class="category">
          {{ item.category }}
          <span v-if="item.category != 'service'">client</span>
        </p>
        <span class="serviceId">ID: {{ item.config.serviceID }}</span>
      </div>
      <div class="expertRow" :class="{ shorterRowBox: isExpertModeActive }">
        <div class="dataTitleBox" @click="openExpertMode">
          <img
            class="titleIcon"
            src="../../../../public/img/icon/plugin-menu-icons/crown2.png"
            alt="icon"
          />
          <span>Expert Mode</span>
          <img
            v-if="isExpertModeActive"
            src="../../../../public/img/icon/task-manager-icons/up.png"
            alt=""
          />
          <img
            v-else
            src="../../../../public/img/icon/task-manager-icons/down.png"
            alt=""
          />
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
          class="selectBox"
          :class="{ unvisible: isExpertModeActive }"
          v-for="(option, index) in item.expertOptions.filter(
            (option) => option.type === 'select'
          )"
          :key="index"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span>{{ option.title }}</span>
          <div class="spaceParent">
            <select
              v-model="option.changeValue"
              id="value"
              @change="option.changed = true"
              @input="somethingIsChanged"
            >
              <option
                v-for="(rate, idx) in option.value"
                :value="rate"
                :key="idx"
              >
                {{ rate }} {{ option.unit }}
              </option>
            </select>
          </div>
        </div>

        <!--
        option needs: {
          title: string,
          type: "text",
          changeValue: string,
          icon: string (path)
          }
        -->
        <div
          class="toggleTextBox"
          v-for="(option, index) in item.expertOptions.filter(
            (option) => option.type === 'text'
          )"
          :key="index"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span>{{ option.title }}</span>
          <img
            class="buttonOff"
            src="/img/icon/plugin-menu-icons/confirm.png"
            alt="icon"
            v-if="option.buttonState"
            @click="buttonOff(option)"
          />
          <img
            class="buttonOn"
            src="/img/icon/plugin-menu-icons/edit2.png"
            alt="icon"
            v-else
            @click="buttonOn(option)"
          />
          <input
            class="toggleTextInput"
            type="text"
            @input="somethingIsChanged"
            v-model="option.changeValue"
            :class="{ disabled: !option.buttonState }"
            @change="option.changed = true"
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
        <div
          class="actionBox"
          v-for="(option, index) in item.expertOptions.filter(
            (option) => option.type === 'action'
          )"
          :key="index"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img :src="option.icon" alt="icon" />
          <span class="actionBoxTitle">{{ option.title }}</span>
          <div class="toggleBox">
            <label class="switch">
              <input
                :disabled="option.disabled"
                type="checkbox"
                v-model="option.changeValue"
                name="check-button"
                @change="somethingIsChanged()"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <!-- expert mode textarea -->
      <div class="expertTable">
        <div class="expertMode" v-if="isExpertModeActive">
          <textarea
            class="editContent"
            @input="somethingIsChanged"
            v-model="item.yaml"
          ></textarea>
        </div>
      </div>
      <div class="btn-box">
        <!-- service version -->
        <p class="serviceVersion">
          version: <span>{{ item.config.imageVersion }}</span>
        </p>
        <!-- close text -->
        <span class="exit-btn">Click outside to close</span>
        <!-- confirm button box -->
        <div
          class="confirmBtn"
          v-if="!nothingsChanged"
          @click="confirmExpertChanges(item)"
        >
          <span>Confirm</span>
        </div>
        <div class="disabledBtn" v-else>
          <span>Confirm</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
export default {
  props: ["item", "position", "prunningWarning"],
  data() {
    return {
      enterPortIsEnabled: false,
      isExpertModeActive: false,
      ramUsage: null,
      editableData: null,
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
  computed: {},

  mounted() {
    this.readService();
  },
  // watch: {
  //   changed: function (newValue, oldValue) {

  //   },
  // },
  methods: {
    somethingIsChanged() {
      this.nothingsChanged = false;
    },
    async readService() {
      this.item.yaml = await ControlService.getServiceYAML(
        this.item.config.serviceID
      );
      this.item.expertOptions = this.item.expertOptions.map((option) => {
        if(this.item.yaml.includes("isPruning: true")){
          option.disabled = true
        }else{
          option.disabled = false
        }
        if (option.type === "select" || option.type === "text") {
          option.changeValue = [...this.item.yaml.match(option.pattern)][2];
        }
        return {
          ...option,
          buttonState: false,
          runningAction: false,
        };
      });
    },
    async writeService() {
      this.item.expertOptions.forEach((option) => {
        if (option.changeValue) {
          if (option.changed) {
            this.item.yaml = this.item.yaml.replace(
              option.pattern,
              "$1" + option.changeValue + "$3"
            );
          }
          option.changed = false;
        }
      });
      await ControlService.writeServiceYAML({
        id: this.item.config.serviceID,
        data: this.item.yaml,
        service: this.item.service,
      });
    },
    openExpertMode() {
      this.isExpertModeActive = !this.isExpertModeActive;
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
            return item.title === "Prunning";
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
    async confirmExpertChanges(el) {
      await this.writeService();
      el.expertOptionsModal = false;
      this.actionHandler(el);
    },
  },
};
</script>
<style scoped>
.expert-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.opacityBackground {
  width: 100vw;
  height: 100%;
  border-radius: 0 35px 0 0;
  background-color: rgb(8, 8, 8);
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  cursor: default;
}
.expert-modal {
  width: 64%;
  height: 84%;
  background-color: #33393e;
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 5px;
  border: 3px solid #adadad;
  position: absolute;
  top: 10.4%;
  left: 19%;
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
.expertRow {
  width: 95%;
  height: max-content;
  max-height: 101px;
  margin: 3px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  z-index: 1003;
}

.expertRow .dataTitleBox {
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-duration: 200ms;
}
.expertRow .selectBox {
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
  width: 86%;
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

.expertRow .selectBox img {
  grid-column: 1/2;
  margin-left: 20px;
  width: 20px;
  height: 20px;
}
.expertRow .toggleTextBox {
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

.expertRow .dataTitleBox:hover {
  border: 1px solid #d6d6d6;
  color: #d9d9d9;
}

.expertRow .dataTitleBox:active {
  border: 1px solid #2d2d2d;
}

.expertRow .dataTitleBox img {
  width: 20px;
  height: 20px;
}
.expertRow .actionBox {
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
}
.expertRow .actionBox img {
  grid-column: 1/2;
  grid-row: 1;
  width: 20px;
  height: 20px;
}
.expertRow .actionBox .actionBoxTitle {
  grid-column: 3/4;
  grid-row: 1;
  text-align: center;
  margin-left: -14px;
}
.expertRow .actionBox .initiateAction {
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
.expertRow .actionBox .initiateAction:hover {
  border: 1px solid #a2a2a2;
  background-color: rgb(39, 68, 51);
}
.expertRow .actionBox .initiateAction:active {
  transform: scale(0.95);
}
.expertRow .actionBox .startAction {
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
  background-color: rgb(173, 173, 173);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 0;
  bottom: 8%;
  background-color: #abb0b2;
  box-shadow: 0 1px 3px 1px rgb(89, 89, 89);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #e6e6e6;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
  background-color: #1ea669;
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
.expertRow .toggleTextBox .titleIcon {
  grid-column: 1/2;
  grid-row: 1;
  width: 20px;
  height: 20px;
  align-self: center;
}
.expertTable {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expertTable .expertMode {
  width: 100%;
  height: 100%;
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

/* Track */
.expertMode::-webkit-scrollbar-track {
  background: transparent;
  margin: 20px 0;
  cursor: pointer;
}

/* Handle */
.expertMode::-webkit-scrollbar-thumb {
  background: rgb(112, 199, 249);
  border-radius: 3px;
}

/* Handle on hover */
.expertMode::-webkit-scrollbar-thumb:hover {
  background: rgb(24, 161, 241);
}

.unvisible {
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
</style>
