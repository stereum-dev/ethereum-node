<template>
  <div class="service-container" onmousedown="return false">
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/up-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 0"
    />
    <div class="service-bg" ref="serviceBg">
      <div
        v-for="item in installedServices.filter(
          (service) => service.category === 'service'
        )"
        :key="item.id"
        class="service-item"
      >
        <img
          :src="item.hIcon"
          alt="icon"
          @click="pluginMenuHandler(item)"
          @dblclick="openDefaultBrowser(item)"
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
              <img src="/img/icon/plugin-menu-icons/logs3.png" alt="icon" />
            </div>
            <div class="restart">
              <img src="/img/icon/plugin-menu-icons/sync3.png" alt="icon" />
            </div>
            <div class="setting">
              <img src="/img/icon/plugin-menu-icons/setting4.png" alt="icon" />
            </div>
          </div>
        </plugin-menu>
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
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import PluginMenu from "./PluginMenu.vue";

export default {
  components: { PluginMenu },
  props: ["list"],
  data() {
    return {
      isPluginMenuActive: false,
      isServiceOn: false,
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
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
  },
};
</script>
<style scoped>
.service-container {
  width: 96%;
  height: 98%;
  background-color: #3b3b3b;
  border-radius: 20px;
  overflow: auto;
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
.service-item {
  width: 60px;
  height: 60px;
}
.service-bg {
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
  cursor: pointer;
  overflow-x: hidden;
  overflow-y: auto;
}
.service-bg::-webkit-scrollbar {
  display: none;
}

.service-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-item img {
  width: 50px;
  height: 50px;
}
.service-item img:active {
  box-shadow: none;
}
.chosen-plugin {
  width: 55px;
  height: 55px;
  border: 2px solid rgb(64, 168, 243);
  border-radius: 7px;
}
.service-arrow {
  border-radius: 50px;
  box-shadow: 1px 2px 3px 1px rgb(63, 63, 63);
}
.service-arrow:active {
  box-shadow: none;
}
</style>
