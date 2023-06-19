<template>
  <div class="service-container">
    <img
      class="service-arrow"
      src="/img/icon/manage-node-icons/white-arrow-up.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 0"
    />
    <div ref="serviceBg" class="item-box">
      <div v-for="(item, index) in list" :key="index" class="items" @mouseleave="mouseLeaveToHide(item)">
        <img
          :src="item.hIcon ? item.hIcon : item.sIcon"
          alt="icon"
          @click="pluginMenuHandler(item)"
          @dblclick="displayPluginLogPage(item)"
        />
        <plugin-menu v-if="item.displayPluginMenu">
          <div class="menu-content">
            <div class="power">
              <img
                v-if="item.serviceIsPending"
                class="pending"
                src="/img/icon/plugin-menu-icons/turning_circle.gif"
                alt="icon"
                @click="stateHandler(item)"
              />
              <img
                v-else-if="item.state == 'running'"
                src="/img/icon/plugin-menu-icons/shutdown.png"
                alt="icon"
                @click.once="stateHandler(item)"
              />
              <img v-else src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" @click.stop="stateHandler(item)" />
            </div>
            <div class="setting" @click="expertModeHandler(item)">
              <img src="/img/icon/plugin-menu-icons/setting8.png" alt="icon" />
            </div>
          </div>
        </plugin-menu>
        <the-expert
          v-if="item.expertOptionsModal"
          :item="item"
          position="18.8%"
          wide="39%"
          @hide-modal="hideExpertMode(item)"
        ></the-expert>
        <Transition>
          <plugin-logs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage"></plugin-logs>
        </Transition>
        <div class="state-icon" :class="serviceStateStatus(item)"></div>
      </div>
    </div>
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/white-arrow-down.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 1000"
    />
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import PluginMenu from "./PluginMenu.vue";
import PluginLogs from "../the-node/PluginLogs.vue";
import TheExpert from "./TheExpert.vue";

export default {
  components: { PluginMenu, TheExpert, PluginLogs },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      itemsList: [],
      isPluginMenuActive: false,
      isServiceOn: false,
      isServicePending: false,
      isPluginLogPageActive: false,
      itemToLogs: {},
    };
  },

  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),
  },
  beforeMount() {
    this.updateStates();
  },
  updated() {
    this.updateStates();
  },
  methods: {
    serviceStateStatus(item) {
      if (item.state === "running") {
        return "green";
      } else if (item.serviceIsPending) {
        return "orange";
      } else {
        return "red";
      }
    },
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
    },
    pluginMenuHandler(el) {
      setTimeout(() => {
        this.list.map((i) => {
          if (i?.id === el.id && i?.name === el.name) el.displayPluginMenu = !el.displayPluginMenu;
        });
      }, 300);
    },
    hideExpertMode(el) {
      el.expertOptionsModal = false;
    },
    expertModeHandler(el) {
      this.list.map((item) => {
        if (item.category === el.category && item?.id === el.id) el.expertOptionsModal = true;
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
.green {
  background-color: #0eac0e;
}

.orange {
  background-color: orange;
}

.red {
  background-color: red;
}
.service-container {
  width: 96%;
  height: 95%;
  background: #4c4c4e;
  border-radius: 20px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.service-arrow {
  width: 50%;
  height: 10%;
  cursor: pointer;
}
.service-arrow:active {
  transform: scale(0.9);
  transition-duration: 0.1s;
}

.item-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, 1fr);
  padding: 10px;
  width: 90%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #797979;
  border-radius: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.item-box::-webkit-scrollbar {
  display: none;
}

.items {
  width: 65%;
  height: 70%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.state-icon {
  width: 15%;
  height: 15%;
  display: flex;
  position: absolute;
  z-index: 1;
  top: 7%;
  left: 75%;
  border-radius: 50%;
}
.items img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.menu-content {
  width: 100%;
  height: 100%;
}
.menu-content .power {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 6%;
  left: -35%;
  animation: power 500ms;
}
@keyframes power {
  0% {
    opacity: 0;
    top: 6%;
    left: 34%;
  }
  100% {
    top: 6%;
    left: -35%;
  }
}
.menu-content .power img {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(61, 61, 61);
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
  width: 16px;
  height: 16px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 52%;
  left: -35%;
  animation: setting 500ms;
}
@keyframes setting {
  0% {
    opacity: 0;
    top: 52%;
    left: 34%;
  }
  100% {
    top: 52%;
    left: -35%;
  }
}
.menu-content .setting img {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(71, 71, 71);
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
  animation: restart 500ms;
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
