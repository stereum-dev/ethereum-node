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
                  v-if="item.state == 'running'"
                  @click="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/shutdown.png"
                  alt="icon"
                />
                <img
                  v-else
                  @click="stateHandler(item)"
                  src="/img/icon/plugin-menu-icons/turn-on.png"
                  alt="icon"
                />
              </div>
              <div class="book">
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
export default {
  components: {
    ManageTrapezoid,
    PluginMenu,
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
    };
  },
  beforeMount() {
    this.updateStates();
  },
  updated() {
    this.updateStates();
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
      let url = "https://www.google.com/";
      window.open(url, "_blank");
      el.displayPluginMenu = false;
    },
    pluginMenuHandler(el) {
      setTimeout(() => {
        this.list.filter((item) => {
          item.id === el.id;
          el.displayPluginMenu = !el.displayPluginMenu;
        });
      }, 200);
    },
    hidePluginMenu(el) {
      el.displayPluginMenu = false;
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
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, 63px);
  row-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  margin-top: 10px;
  background-color: transparent;
}
.item-box::-webkit-scrollbar {
  width: 1px;
}
.item-box .items {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 50px;
  height: 50px;
  border-radius: 7px;
  margin: 0 auto;
  cursor: pointer;
}
.item-box .items img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
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
}
.menu-content .power {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -2%;
  left: 27%;
  animation: power 1s;
}
@keyframes power {
  0% {
    opacity: 0;
    top: 39%;
    left: 27%;
  }
  100% {
    top: -2%;
    left: 27%;
  }
}
.menu-content .power img {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}

.menu-content .book {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 40%;
  left: 36.1%;
  animation: book 1s;
}
@keyframes book {
  0% {
    opacity: 0;
    top: 39%;
    left: 27%;
  }
  100% {
    top: 40%;
    left: 36.1%;
  }
}
.menu-content .book img {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.menu-content .restart {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 40%;
  left: 17.2%;
  animation: restart 1s;
}
@keyframes restart {
  0% {
    opacity: 0;
    top: 39%;
    left: 27%;
  }
  100% {
    top: 40%;
    left: 17.2%;
  }
}

.menu-content .restart img {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 1px 3px 1px rgb(48, 48, 48);
}
.menu-content .setting {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 80%;
  left: 27%;
  animation: setting 1s;
}
@keyframes setting {
  0% {
    opacity: 0;
    top: 39%;
    left: 27%;
  }
  100% {
    width: 28px;
    height: 28px;
    top: 80%;
    left: 27%;
  }
}
.menu-content .setting img {
  width: 90%;
  height: 90%;
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
</style>
