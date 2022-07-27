<template>
  <div class="service-container" onmousedown="return false">
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/up-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 0"
    />
    <div class="item-box" ref="serviceBg">
      <div v-for="(param, index) in list" :key="index" class="items">
        <img
          :src="param.hIcon"
          alt="icon"
          @click="pluginMenuHandler(param)"
          @dblclick="openDefaultBrowser(param)"
        />
        <plugin-menu v-if="param.displayPluginMenu">
          <div class="menu-content">
            <div class="power">
              <img
                v-if="param.state == 'running'"
                @click="stateHandler(param)"
                src="/img/icon/plugin-menu-icons/shutdown.png"
                alt="icon"
              />
              <img
                v-else
                @click="stateHandler(param)"
                src="/img/icon/plugin-menu-icons/turn-on.png"
                alt="icon"
              />
            </div>
            <div class="setting" @click="expertModeHandler(param)">
              <img src="/img/icon/plugin-menu-icons/setting8.png" alt="icon" />
            </div>
            <div class="restart">
              <img src="/img/icon/plugin-menu-icons/sync9.png" alt="icon" />
            </div>
            <div class="book">
              <img src="/img/icon/plugin-menu-icons/log7.png" alt="icon" />
            </div>
          </div>
        </plugin-menu>
        <the-expert
          @hide-modal="hideExpertMode(param)"
          v-if="param.expertOptionsModal"
          :item="param"
        ></the-expert>
      </div>
    </div>
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/down-arrow.png"
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
import TheExpert from "./TheExpert.vue";

export default {
  components: { PluginMenu, TheExpert },
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
    };
  },
  beforeMount() {
    this.updateStates();
  },
  updated() {
    this.updateStates();
  },
  updated() {},
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
      this.updateStates();
    },
    openDefaultBrowser(el) {
      let url = el.linkUrl;
      window.open(url, "_blank");
      el.displayPluginMenu = false;
    },
    pluginMenuHandler(el) {
      this.list.map((i) => {
        if (i?.id === el.id && i?.name === el.name)
          el.displayPluginMenu = !el.displayPluginMenu;
      });
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
  },
};
</script>
<style scoped>
.service-container {
  width: 96%;
  height: 98%;
  background-color: #3b3b3b;
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
  height: 25px;
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
  background: #707070;
  border-radius: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.item-box::-webkit-scrollbar {
  display: none;
}

.items {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.items img {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.service-arrow {
  border-radius: 50px;
  box-shadow: 1px 2px 3px 1px rgb(63, 63, 63);
}
.service-arrow:active {
  box-shadow: none;
}
.menu-content {
  width: 100%;
  height: 100%;
}
.menu-content .power {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0%;
  left: 5%;
  animation: power 500ms;
}
@keyframes power {
  0% {
    opacity: 0;
    top: 34%;
    left: 34%;
  }
  100% {
    top: 0%;
    left: 5%;
  }
}
.menu-content .power img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}

.menu-content .setting {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0%;
  left: 65%;
  animation: setting 500ms;
}
@keyframes setting {
  0% {
    opacity: 0;
    top: 34%;
    left: 34%;
  }
  100% {
    top: 0%;
    left: 65%;
  }
}
.menu-content .setting img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .restart {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 65%;
  left: 3%;
  animation: restart 500ms;
}
@keyframes restart {
  0% {
    opacity: 0;
    top: 34%;
    left: 34%;
  }
  100% {
    top: 65%;
    left: 3%;
  }
}

.menu-content .restart img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .book {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 65%;
  left: 66%;
  animation: book 500ms;
}
@keyframes book {
  0% {
    opacity: 0;
    top: 34%;
    left: 34%;
  }
  100% {
    top: 65%;
    left: 66%;
  }
}
.menu-content .book img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .power img:hover,
.menu-content .setting img:hover,
.menu-content .restart img:hover,
.menu-content .book img:hover {
  transform: scale(1.1);
}

.menu-content .setting img:active,
.menu-content .restart img:active,
.menu-content .book img:active,
.menu-content .power img:active {
  transform: scale(1);
}
</style>
