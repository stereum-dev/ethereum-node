<template>
  <installation-box :back="back" :title="title" :next="next">
    <div class="list-parent">
      <div class="content-box shadow-md shadow-gray-700">
        <div class="table">
          <div class="table-header">
            <img :src="configNetwork_icon" alt="Icon" />
            <span>{{ configNetwork }}</span>
          </div>

          <div class="table-content">
            <div class="content_header">
              <span>Plugins To Import</span>
              <span>Remove</span>
            </div>
            <TransitionGroup name="fade" class="container">
              <div v-for="(plugin, index) in configPlugins" :key="index" class="table-row duration-500">
                <div class="plugins">
                  <img :src="plugin.icon" alt="icon" class="pluginIcon" />
                  <div class="pluginName">
                    <span>
                      {{ plugin.name }}
                    </span>
                  </div>
                  <div class="pluginCategory">
                    <span>
                      {{ plugin.category }}
                    </span>
                  </div>
                </div>
                <div class="remove">
                  <img
                    src="/img/icon/click-installation/cancel.png"
                    alt="remove"
                    @click="removeServiceFromList(plugin.service)"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </installation-box>
</template>

<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";
export default {
  data() {
    return {
      back: "uploadConfig",
      title: "IMPORTED CONFIG",
      next: "importingSyncing",
      configNetwork_icon: "/img/icon/click-installation/testnet-icon.png",
      configNetwork: "Ethereum - Testnet",
    };
  },

  computed: {
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
    ...mapWritableState(useClickInstall, {
      unzippedData: "unzippedData",
      configPlugins: "configPlugins",
    }),
  },
  mounted() {
    this.checkPluginsToImport();
  },
  methods: {
    checkPluginsToImport() {
      this.configPlugins = this.allServices.filter((service) => {
        return this.unzippedData.some((d) => d.name.toLowerCase() === service.service.toLowerCase());
      });
    },
    removeServiceFromList(item) {
      this.configPlugins.forEach((element, index) => {
        if (element.service === item) {
          this.configPlugins.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style scoped>
.list-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  z-index: 2;
}
.content-box {
  width: 100%;
  height: 100%;
  background-color: #2d3134;
  border: 4px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  padding-bottom: 5px;
  border-radius: 20px;
}
.table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.table-header {
  width: 100%;
  height: 11%;
  max-height: 40px;
  margin-top: 2px;
  padding: 1px 5px;
  background-color: transparent;
  border: 2px solid rgb(76, 129, 137);
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.table-header img {
  width: 30px;
  grid-column: 1/2;
  grid-row: 1/2;
}
.table-header span {
  grid-column: 2/6;
  grid-row: 1/2;
  font-size: 1rem;
  font-weight: 500;
  color: #e1e1e1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-content {
  width: 100%;
  height: 89%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.content_header {
  width: 100%;
  height: 8%;
  margin-top: 3px;
  padding: 1px 10px;
  background-color: #4c8189;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content_header span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #e1e1e1;
}
.table-row {
  width: 100%;
  height: 35px;
  margin-top: 5px;
  padding: 2px 10px;
  background-color: #32363a;
  border: 1px solid #616569;
  box-shadow: 1px 1px 5px 1px rgb(35, 35, 35);
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.table-row .plugins {
  grid-column: 1/6;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.table-row .plugins .pluginIcon {
  width: 28px;
  grid-column: 1/2;
  grid-row: 1/2;
}
.table-row .plugins .pluginName {
  grid-column: 2/4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pluginName span {
  font-size: 1rem;
  font-weight: 500;
  color: #e1e1e1;
}
.plugin .pluginCategory {
  grid-column: 4/7;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.pluginCategory span {
  font-size: 0.7rem;
  font-weight: 500;
  color: #d2c878;
}
.table-row .remove {
  grid-column: 6/7;
  grid-row: 1/2;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.table-row .remove img {
  width: 20px;
  cursor: pointer;
}
.container {
  padding: 0;
  position: relative;
}
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from {
  opacity: 0;
  transform: scaleX(0.1) translate(30px, 0);
}
.fade-leave-to {
  opacity: 0;
  transform: scaleX(0.01) translate(0, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
