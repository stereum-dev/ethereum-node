<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }} {{ $t("pluginZone.client") }}</span>
      <div class="item-box" @drag.prevent.stop>
        <div
          class="items"
          v-for="(item, index) in list"
          :key="index"
          ref="itemsList"
          @mouseleave="mouseLeaveToHide(item)"
        >
          <!-- double click func to open logs -->
          <!-- @dblclick.self="displayPluginLogPage(item)" -->
          <img
            :src="item.sIcon"
            alt="icon"
            @click="pluginMenuHandler(item)"
            @dblclick.self="displayPluginLogPage(item)"
          />
          <plugin-menu v-if="item.displayPluginMenu">
            <div class="menu-content">
              <div class="power">
                <img
                  v-if="item.serviceIsPending"
                  class="pending"
                  src="/img/icon/plugin-menu-icons/turning_circle.gif"
                  alt="icon"
                />
                <img
                  v-else-if="item.state == 'running'"
                  @click.stop="stateHandler(item)"
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
                  @click.stop="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/turn-on.png"
                  alt="icon"
                />
              </div>
              <div class="setting" @click="expertModeHandler(item)">
                <img
                  src="/img/icon/plugin-menu-icons/setting8.png"
                  alt="icon"
                />
              </div>
            </div>
          </plugin-menu>
          <the-expert
            @hide-modal="hideExpertMode(item)"
            v-if="item.expertOptionsModal"
            @prunning-warning="runGethPrunningWarning"
            @resync-warning="runResyncWarning"
            :item="item"
            position="18.8%"
            long="54%"
          ></the-expert>
          <prunning-modal
            :item="item"
            v-if="gethPrunningWarningModal"
            @cancel-warning="hidePrunningWarningsModal"
            @confirm-btn="confirmRunningGethPrunning(item)"
          ></prunning-modal>
          <resync-modal
            :item="item"
            v-if="resyncWarningModal"
            @cancel-warning="hideResyncWarningsModal"
            @confirm-btn="confirmRunningResync($event, item)"
          >
          </resync-modal>
          <Transition>
            <plugin-logs
              :item="itemToLogs"
              v-if="isPluginLogPageActive"
              @close-log="closePluginLogsPage"
            ></plugin-logs>
          </Transition>
        </div>
      </div>
    </template>
    <template #plusIcon>
      <div class="plus-icon-box" @click="$emit('modalView', list)">
        <img src="/img/icon/manage-node-icons/fullscreen.png" alt="icon" />
      </div>
    </template>
  </manage-trapezoid>
</template>
<script>
import { toRaw } from "vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import ManageTrapezoid from "../node-manage/ManageTrapezoid.vue";
import PluginMenu from "./PluginMenu.vue";
import PluginLogs from "./PluginLogs.vue";
import TheExpert from "./TheExpert.vue";
import PrunningModal from "./PrunningModal.vue";
import ResyncModal from "./ResyncModal.vue";
export default {
  components: {
    ManageTrapezoid,
    PluginMenu,
    TheExpert,
    PrunningModal,
    ResyncModal,
    PluginLogs,
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
      gethPrunningWarningModal: false,
      resyncWarningModal: false,
      isPluginLogPageActive: false,
      options: null,
      itemToLogs: {},
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
      item.yaml = await ControlService.getServiceYAML(item.config.serviceID);
      if (!item.yaml.includes("isPruning: true")) {
        this.isServiceOn = false;
        item.serviceIsPending = true;
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
        item.serviceIsPending = false;
        this.updateStates();
      }
    },
    pluginMenuHandler(el) {
      setTimeout(() => {
        this.list.map((item) => {
          if (item?.category === el.category && item?.id === el.id)
            el.displayPluginMenu = !el.displayPluginMenu;
        });
      }, 300);
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
    // Check if service is Geth
    runGethPrunningWarning(option) {
      if (option.changeValue && option.displayWarningModal) {
        this.gethPrunningWarningModal = true;
      } else if (!option.changeValue || !option.displayWarningModal) {
        this.gethPrunningWarningModal = false;
      }
    },
    //Double check & run Resync modal
    runResyncWarning(option) {
      if (option.changeValue && option.displayResyncModal) {
        this.resyncWarningModal = true;
      } else if (!option.changeValue || !option.displayWarningModal) {
        this.resyncWarningModal = false;
      }
    },
    // Prunning Functions
    hidePrunningWarningsModal(el) {
      this.gethPrunningWarningModal = false;
      el.expertOptions
        .filter((item) => {
          return item.title === "Prunning";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
    },
    async confirmRunningGethPrunning(service) {
      this.gethPrunningWarningModal = false;
      service.expertOptions
        .filter((item) => {
          return item.title === "Prunning";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
      await ControlService.chooseServiceAction({
        action: "pruneGeth",
        service: toRaw(service),
        data: {},
      });
    },

    // Resync Functions
    hideResyncWarningsModal(el) {
      this.resyncWarningModal = false;
      el.expertOptions
        .filter((item) => {
          return item.title === "Resync";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
    },
    async confirmRunningResync(data, service) {
      this.resyncWarningModal = false;
      service.expertOptions
        .filter((item) => {
          return item.title === "Resync";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
      await ControlService.chooseServiceAction({
        action: "reSync",
        service: toRaw(service),
        data: { checkpointURL: data },
      });
    },
    mouseLeaveToHide(el) {
      setTimeout(() => {
        el.displayPluginMenu = false;
      }, 2000);
    },
    displayPluginLogPage(el) {
      el.expertOptionsModal = false;
      this.itemToLogs = el;
      this.isPluginLogPageActive = true;
    },
    closePluginLogsPage() {
      this.isPluginLogPageActive = false;
    },
  },
};
</script>
<style scoped>
.showModal {
  display: none;
}

.title {
  width: max-content;
  min-width: 70px;
  height: 16%;
  color: #d1d1d1;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 1rem 0 1rem;
  background-color: #264744;
  border-radius: 0 15px 15px 0;
  position: absolute;
  left: 0;
  top: -7%;
  box-shadow: 0 1px 3px rgb(47, 47, 47);
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}

.item-box {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-auto-rows: minmax(80px, auto);
  row-gap: 1px;
  width: 99%;
  min-height: 80px;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.item-box::-webkit-scrollbar {
  width: 1px;
}

.item-box .items {
  width: 95%;
  height: 95%;
  border-radius: 7px;
  margin: 0 auto;
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
  cursor: pointer;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
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
}

.menu-content .power {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 23%;
  left: 7%;
  z-index: 11;
  animation: power 500ms;
}

@keyframes power {
  0% {
    opacity: 0;
    top: 23%;
    left: 41%;
  }

  100% {
    top: 23%;
    left: 7%;
  }
}

.menu-content .power img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}

.menu-content .power .pending {
  width: 17px;
  height: 17px;
  background-color: rgb(71, 70, 70);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
  z-index: 1000;
  pointer-events: none;
}

.menu-content .setting {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 7%;
  top: 52%;
  animation: setting 500ms;
}

@keyframes setting {
  0% {
    opacity: 0;
    top: 52%;
    left: 42%;
  }

  100% {
    left: 7%;
    top: 52%;
  }
}

.menu-content .setting img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}

.menu-content .restart img {
  width: 17px;
  height: 17px;
  border-radius: 100%;
  box-shadow: 0 1px 3px 1px rgb(48, 48, 48);
}

.menu-content .power img:hover,
.menu-content .setting img:hover,
.menu-content .restart img:hover {
  transform: scale(1.1);
}

.menu-content .setting img:active,
.menu-content .restart img:active,
.menu-content .power img:active {
  transform: scale(1);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
