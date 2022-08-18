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
            :item="item"
            position="18.8%"
            long="54%"
          ></the-expert>
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
import TheExpert from "./TheExpert.vue";
export default {
  components: {
    ManageTrapezoid,
    PluginMenu,
    TheExpert,
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
      let url = el.linkUrl;
      window.open(url, "_blank");
      el.displayPluginMenu = false;
    },
    pluginMenuHandler(el) {
      setTimeout(() => {
        this.list.map((item) => {
          if (item?.category === el.category && item?.id === el.id)
            el.displayPluginMenu = !el.displayPluginMenu;
        });
      }, 100);
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
  row-gap: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 99%;
  height: 100px;
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
  top: 29%;
  left: 7%;
  z-index: 11;
  animation: power 500ms;
}
@keyframes power {
  0% {
    opacity: 0;
    top: 29%;
    left: 41%;
  }
  100% {
    top: 29%;
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
.menu-content .book {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 78%;
  left: 41%;
  animation: book 500ms;
}
@keyframes book {
  0% {
    opacity: 0;
    top: 40%;
    left: 41%;
  }
  100% {
    top: 78%;
    left: 41%;
  }
}
.menu-content .book img {
  width: 17px;
  height: 17px;
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
.menu-content .power .pending:hover {
  transform: scale(1);
}
</style>
