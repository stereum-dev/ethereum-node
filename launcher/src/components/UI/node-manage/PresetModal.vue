<template>
  <div class="modal-container">
    <div class="modal-content">
      <div class="plugins">
        <div class="title">
          <span>THE PRESETS</span>
        </div>
        <div class="plugin-content">
          <div
            class="plugin-item"
            v-for="(plugin, index) in clickPresets"
            :key="index"
            @click="selectItemToInstall(plugin)"
          >
            <img :src="plugin.icon" alt="icon" 
              :class="{
                selectedItem: plugin.id === this.selectedPreset?.id,
              }"
            />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>CHOOSE A PRESET</span>
        </div>
        <div class="description">
          <p>
            Stereum gives you the choice of choosing different use case focused
            pre-sets. You don't automatically commit to the changes, it just
            recommends you a selection. Try them out!
          </p>
        </div>

        <router-link class="install-btn" :to="{ path: '/install' }">
          <button>INSTALL</button>
        </router-link>
      </div>
    </div>
    <div class="close-preset" @click="$emit('closePreset')">
      <img
        src="../../../../public/img/icon/manage-node-icons/close3.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
export default {
  props: ["modalStatus"],
  computed: {
    ...mapState(useNodeManage, {
      clickPresets: "clickPresets",
    }),
    ...mapWritableState(useClickInstall, {
      plugins: "presets",
      selectedPreset: "selectedPreset",
      selectedNetworks: "selectedNetworks",
    }),
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
  },
  methods: {
    selectItemToInstall: async function (item) {
      const constellation = await ControlService.getOneClickConstellation(item.name);
      let includedPlugins = this.allServices.filter(service => constellation.includes(service.service));
      if(includedPlugins.map(e => e.service).includes("BloxSSVService") || includedPlugins.map(e => e.service).includes("RocketpoolService")){
        includedPlugins.splice(includedPlugins.findIndex(e => (e.service != 'BloxSSVService' && e.service != 'RocketpoolService' && e.category === 'validator')),1)
      }
      item.includedPlugins = includedPlugins;
      this.selectedPreset = item;
      this.$emit("disableBtn");
    },
  }
};
</script>
<style scoped>
.modal-container {
  width: 100%;
  height: 100%;
  border-radius: 0 35px 0 0;
  background: rgb(26, 25, 33);
  border: 3px solid rgb(139, 176, 187);
  position: absolute;
  bottom: 0;
  left: 0.5%;
}
.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content .plugins {
  width: 39%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 20px;
}
.plugins .title {
  width: 100%;
  height: 20%;
  padding-top: 4px;
  text-align: center;
}
.plugins .title span {
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  font-weight: 900;
}
.plugins .plugin-content {
  width: 100%;
  height: 77%;
  overflow: hidden;
  border-top: 1px solid rgb(63, 70, 99);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
.plugin-content .plugin-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.plugin-item img {
  width: 70px;
  height: 70px;
  justify-self: center;
  align-self: center;
  border-radius: 10px;
  box-shadow: 0 0 5px 1px rgb(19, 19, 19);
}
.modal-content .content {
  width: 50%;
  height: 90%;
  border-left: 1px solid rgb(63, 70, 99);
  margin-left: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.content .title {
  width: 80%;
  height: 20%;
  border-bottom: 1px solid rgb(63, 70, 99);
  text-align: center;
}
.content .title span {
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  font-weight: 900;
}
.content .description {
  width: 80%;
  height: 60%;
}
.content .description p {
  color: rgb(183, 183, 183);
  font-size: 15px;
  font-weight: 500;
  text-align: justify;
  overflow: hidden;
}
.content .install-btn {
  width: 30%;
  height: 11%;
  border: 3px solid rgb(160, 160, 160);
  border-radius: 30px;
  background-color: #254f4c;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 1px 2px 8px #000000;
}
.content .install-btn:hover {
  background-color: rgb(27, 62, 60);

  box-shadow: none;
}
.content .install-btn:active {
  font-size: 1rem;
  box-shadow: inset 1px 1px 8px 1px #000000;
}
.install-btn button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}
.close-preset {
  width: 25px;
  height: 25px;
  border-radius: 50px;
  position: fixed;
  margin: 5px;
  padding: 1px;
  top: 11%;
  right: 1%;
  background-color: #171b1f;
  border: 2px solid #63707e;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-preset:hover {
  background-color: #141515;
  border: 2px solid #cf503f;
  transform: scale(1.1);
  transition: all 200ms;
}
.close-preset:active {
  background-color: #141515;
  border: 2px solid #63707e;
  transform: scale(1);
  transition: all 200ms;
}
.close-preset img {
  width: 17px;
  height: 17px;
  border-radius: 50px;
}
.selectedItem {
  border: 2px solid rgb(53, 178, 246) !important;
  border-radius: 10px !important;
  box-shadow: 0px 1px 5px 2px rgb(31, 31, 31) !important;
}
</style>
