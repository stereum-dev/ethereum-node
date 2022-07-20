<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }}</span>
      <div class="item-box" @drag.prevent.stop>
        <div
          class="items"
          v-for="(item, index) in list"
          :key="index"
          ref="itemsList"
        >
          <img
            :src="item.sIcon"
            alt="icon"
            @click.self="pluginMenuHandler(item)"
            @dblclick.self="openDefaultBrowser(item)"
          />
          <plugin-menu v-if="item.displayPluginMenu">
            <div class="menu-content">
              <div class="power">
                <img
                  v-if="isServicePending"
                  class="pending"
                  src="/img/icon/plugin-menu-icons/turning_circle.gif"
                  alt="icon"
                />
                <img
                  v-else-if="item.state == 'running'"
                  @click="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/shutdown.png"
                  alt="icon"
                />
                <img
                  v-else-if="item.state == 'restarting'"
                  @click="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/restart.png"
                  alt="icon"
                />
                <img
                  v-else
                  @click="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/turn-on.png"
                  alt="icon"
                />
              </div>
              <div class="book" @click="expertModeHandler(item)">
                <img src="/img/icon/plugin-menu-icons/log7.png" alt="icon" />
              </div>
              <div class="restart">
                <img src="/img/icon/plugin-menu-icons/sync9.png" alt="icon" />
              </div>
              <div class="setting">
                <img
                  src="/img/icon/plugin-menu-icons/setting8.png"
                  alt="icon"
                />
              </div>
            </div>
          </plugin-menu>
          <expert-mode v-if="isExperModeForRamUsage">
            <div class="serviceName">
              <span class="nameSpan">{{ item.name }}</span>
              <span class="category">{{ item.category }}</span>
            </div>
            <div class="expertRow">
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
              <div class="ramTitleBox" @click="openRamUsage">
                <img
                  class="titleIcon"
                  src="../../../../public/img/icon/plugin-menu-icons/ram.png"
                  alt="icon"
                />
                <span>RAM Usage Limit</span>
                <img
                  v-if="isRamUsageActive"
                  src="../../../../public/img/icon/task-manager-icons/up.png"
                  alt=""
                />
                <img
                  v-else
                  src="../../../../public/img/icon/task-manager-icons/down.png"
                  alt=""
                />
              </div>
            </div>
            <div class="expertTable">
              <div class="expertMode" v-if="isExpertModeActive">
                <textarea class="editContent" v-model="e.value"></textarea>
              </div>
            </div>
            <div
              class="expertTable"
              v-for="(e, index) in item.expertOptions.filter(
                (p) => p.name === 'ram'
              )"
              :key="index"
            >
              <div class="ramSpace" v-if="isRamUsageActive">
                <span>Choose RAM Usage Limit</span>
                <select v-model="ramUsage" id="ramUsage">
                  <option
                    v-for="(rate, idx) in e.value"
                    :value="rate"
                    :key="idx"
                  >
                    {{ rate }}GB
                  </option>
                </select>
              </div>
            </div>
            <div class="btn-box">
              <div class="confirmBtn" @click="confirmExpertChanges(item)">
                <span>Confirm</span>
              </div>
            </div>
          </expert-mode>
        </div>
      </div>
    </template>
    <template #plusIcon>
      <div class="plus-icon-box" @click="$emit('modalView', list)">
        <img src="/img/icon/manage-node-icons/fullscreen1.png" alt="icon" />
      </div>
    </template>
  </manage-trapezoid>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import ManageTrapezoid from "../node-manage/ManageTrapezoid.vue";
import PluginMenu from "./PluginMenu.vue";
import ExpertMode from "./ExpertMode.vue";
export default {
  components: {
    ManageTrapezoid,
    PluginMenu,
    ExpertMode,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "Title",
    },
    list: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      itemsList: [],
      isPluginMenuActive: false,
      isServiceOn: false,
      isServicePending: false,
      ramUsage: null,
      editableData: null,
      isExperModeForRamUsage: false,
      isRamUsageActive: false,
      isExpertModeActive: false,
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),
  },
  methods: {
    updateStates: async function () {
      let serviceInfos = await ControlService.listServices();
      this.installedServices.forEach((s, idx) => {
        let updated = false;
        serviceInfos.forEach((i) => {
          if (i.Names.replace("stereum-", "") === s.config.serviceID) {
            this.installedServices[idx].state = i.State;
            updated = true;
          }
        });
        if (!updated) {
          this.installedServices[idx].state = "exited";
        }
      });
    },
    stateHandler: async function (item) {
      this.isServiceOn = false;
      this.isServicePending = true;
      let state = "stopped";
      if (item.state === "exited") {
        state = "started";
        this.isServiceOn = true;
      }
      try {
        await ControlService.manageServiceState({
          id: item.config.serviceID,
          state: state,
        });
      } catch (err) {
        console.log(state.replace("ed", "ing") + " service failed:\n", err);
      }
      this.isServicePending = false;
      this.updateStates();
    },
    openDefaultBrowser(el) {
      let url = "https://www.google.com/";
      window.open(url, "_blank");
      el.displayPluginMenu = false;
    },
    pluginMenuHandler(el) {
      setTimeout(() => {
        this.list.map((item) => {
          if (item?.category === el.category && item?.id === el.id)
            el.displayPluginMenu = !el.displayPluginMenu;
        });
      }, 200);
    },
    hidePluginMenu(el) {
      el.displayPluginMenu = false;
    },
    hideExpertMode(el) {
      el.expertOptionsModal = false;
    },
    expertModeHandler(el) {
      this.list.map((item) => {
        if (item.category === el.category && item?.id === el.id)
          el.expertOptionsModal = true;
      });
    },
    confirmExpertChanges(el) {
      el.expertOptionsModal = false;
    },
    openExpertMode() {
      this.isRamUsageActive = false;
      this.isExpertModeActive = !this.isExpertModeActive;
    },
    openRamUsage() {
      this.isExpertModeActive = false;
      this.isRamUsageActive = !this.isRamUsageActive;
    },
    checkServicesForRamUsage() {
      this.list.filter(
        (service) => service?.name === "Teku" || service?.name === "Nethermind"
      );
      this.isExperModeForRamUsage = true;
    },
  },
};
</script>
<style scoped>
.showModal {
  display: none;
}
.title {
  width: auto;
  min-width: 70px;
  height: 20px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 5px;
  background-color: #285940;
  border-radius: 20px;
  position: absolute;
  left: 0;
  top: -13px;
  box-shadow: 0 1px 3px rgb(47, 47, 47);
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-box {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: repeat(2, 100px);
  row-gap: 3px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 99%;
  height: 100%;
  margin: 0 auto;
}
.item-box::-webkit-scrollbar {
  width: 1px;
}
.item-box .items {
  width: 95%;
  height: 95%;
  border-radius: 7px;
  margin: 0 auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.item-box .items img {
  width: 48px;
  height: 48px;
  border-radius: 5px;
  align-self: center;
}
.plus-icon-box {
  width: 30px;
  height: 20px;
  border-radius: 50px;
  position: absolute;
  top: 2px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.plus-icon-box img {
  width: 17px;
  border-radius: 3px;
}

.plus-icon-box img:hover {
  transform: scale(1.1);
  box-shadow: 0 1px 3px 1px rgb(27, 27, 27);
  transition-duration: 100ms;
}
.plus-icon-box img:active {
  transform: scale(1);
  box-shadow: none;
  transition-duration: 100ms;
}

.items img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(64, 168, 243);
  border-radius: 10px;
}
.menu-content {
  width: 100%;
  height: 100%;
  z-index: 900;
}
.menu-content .power {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 2px;
  left: 41%;
  z-index: 11;
  animation: power 1s;
}
@keyframes power {
  0% {
    opacity: 0;
    top: 40%;
    left: 41%;
  }
  100% {
    top: 2px;
    left: 41%;
  }
}
.menu-content .power img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
  z-index: 900;
}
.menu-content .power .pending {
  width: 17px;
  height: 17px;
  background-color: rgb(71, 70, 70);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
  z-index: 1000;
}
.menu-content .book {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 80%;
  top: 39%;
  animation: book 1s;
}
@keyframes book {
  0% {
    opacity: 0;
    top: 39%;
    left: 42%;
  }
  100% {
    left: 80%;
    top: 39%;
  }
}
.menu-content .book img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .restart {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 39%;
  left: 2%;
  animation: restart 1s;
  z-index: 11;
}
@keyframes restart {
  0% {
    opacity: 0;
    top: 39%;
    left: 42%;
  }
  100% {
    top: 39%;
    left: 2%;
  }
}

.menu-content .restart img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 3px 1px rgb(48, 48, 48);
}
.menu-content .setting {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 78%;
  left: 41%;
  animation: setting 1s;
}
@keyframes setting {
  0% {
    opacity: 0;
    top: 40%;
    left: 42%;
  }
  100% {
    top: 78%;
    left: 41%;
  }
}
.menu-content .setting img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .power img:hover,
.menu-content .book img:hover,
.menu-content .restart img:hover,
.menu-content .setting img:hover {
  transform: scale(1.1);
}

.menu-content .book img:active,
.menu-content .restart img:active,
.menu-content .setting img:active,
.menu-content .power img:active {
  transform: scale(1);
}
.menu-content .power .pending:hover {
  transform: scale(1);
}

.expert-modal .serviceName {
  width: 95%;
  height: 20%;
  border-bottom: 1px solid #adadad;
  border-radius: 9px 9px 0 0;
  margin: 10px auto;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
}
.serviceName .nameSpan {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 5px;
  color: #d3d3d3;
}
.serviceName .category {
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 5px;
  color: #ababab;
}
.expertRow {
  width: 95%;
  height: 35%;
  margin: 5px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  z-index: 1003;
}
.expertRow .ramTitleBox,
.expertRow .dataTitleBox {
  width: 100%;
  height: 30px;
  margin: 2px auto;
  padding: 3px 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-duration: 200ms;
}
.expertRow .ramTitleBox:hover,
.expertRow .dataTitleBox:hover {
  border: 1px solid #d6d6d6;
  color: #d9d9d9;
}
.expertRow .ramTitleBox:active,
.expertRow .dataTitleBox:active {
  border: 1px solid #2d2d2d;
}

.expertRow .ramTitleBox img,
.expertRow .dataTitleBox img {
  width: 20px;
  height: 20px;
}
.titleIcon {
  width: 25px;
  height: 25px;
}
.expertTable {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expertTable .ramSpace {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.expertTable .ramSpace span {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(196, 196, 196);
  margin-bottom: 20px;
}
.expertTable .ramSpace select {
  width: 50%;
  height: 30px;
  border-radius: 5px;
  background-color: rgb(83, 83, 83);
  padding: 0 5px;
  text-align: center;
  color: rgb(203, 203, 203);
}
.expertTable .ramSpace select option {
  font-size: 0.7rem;
  font-weight: 800;
  color: rgb(203, 203, 203);
}
.expertTable .expertMode {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expertTable .expertMode .editContent {
  width: 95%;
  height: 95%;
  background-color: rgb(46, 46, 46);
  resize: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d9d9d9;
}

.expert-modal .btn-box {
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.expert-modal .btn-box .exit-btn {
  width: 20%;
  height: 30px;
  padding: 3px;
  border: 2px solid rgb(203, 203, 203);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.expert-modal .btn-box .exit-btn span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #d6d6d6;
  text-align: center;
}
.expert-modal .btn-box .exit-btn:hover {
  transform: scale(1.1);
  border: 2px solid #cf4646;
  color: #cf4646;
}
.expert-modal .btn-box .exit-btn:hover span {
  color: #cf4646;
}
.expert-modal .btn-box .exit-btn:active {
  transform: scale(1);
}
.expert-modal .btn-box .confirmBtn {
  width: 20%;
  height: 30px;
  padding: 3px;
  border: 2px solid #78c098;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.expert-modal .btn-box .confirmBtn span {
  font-size: 0.8rem;
  font-weight: 700;
  color: #78c098;
  text-align: center;
}
.expert-modal .btn-box .confirmBtn:hover {
  transform: scale(1.1);
  background-color: #78c098;
}
.expert-modal .btn-box .confirmBtn:hover span {
  color: #2a2a2a;
}
.expert-modal .btn-box .confirmBtn:active {
  transform: scale(1);
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
</style>
