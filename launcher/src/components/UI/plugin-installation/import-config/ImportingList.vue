<template>
  <installation-box :back="back" :title="title" :next="nextRouteHandler ? 'importingSyncing' : 'importingVerify'">
    <div class="list-parent">
      <div class="content-box shadow-md shadow-gray-700">
        <div class="table">
          <div class="table-header">
            <img :src="configNetwork.icon ? configNetwork.icon : ''" alt="Icon" />
            <span>{{ configNetwork.name ? configNetwork.name : "" }}</span>
          </div>

          <div class="table-content">
            <div class="container_content gap-y-1">
              <TransitionGroup name="fade" class="container">
                <div v-if="configServices.length" class="configTitle">
                  <span>Node Config</span>
                </div>
                <div v-for="(plugin, index) in categoryConfig" :key="index" class="table-row duration-500">
                  <div class="plugins">
                    <img :src="plugin.icon" alt="icon" class="pluginIcon" />
                    <div class="pluginName">
                      <span>
                        {{ plugin.name ? plugin.name : plugin.service }}
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
                      @click="removeServiceFromList(plugin, index)"
                    />
                  </div>
                </div>
                <div v-if="configServices.length" class="serviceTitle">
                  <span>Services</span>
                </div>
                <div v-for="(plugin, index) in categoryService" :key="index" class="table-row duration-500">
                  <div class="plugins">
                    <img :src="plugin.icon" alt="icon" class="pluginIcon" />
                    <div class="pluginName">
                      <span>
                        {{ plugin.name }}
                      </span>
                    </div>
                    <div class="pluginCategory ml-2">
                      <span>
                        {{ plugin.category }}
                      </span>
                    </div>
                  </div>
                  <div class="remove">
                    <img
                      src="/img/icon/click-installation/cancel.png"
                      alt="remove"
                      @click="removeServiceFromList(plugin, index)"
                    />
                  </div>
                </div>
              </TransitionGroup>
            </div>
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
import { useNodeManage } from "@/store/nodeManage";
export default {
  data() {
    return {
      back: "uploadConfig",
      title: "IMPORTED CONFIG",
      categoryService: [],
      categoryConfig: [],
    };
  },

  computed: {
    ...mapWritableState(useNodeManage, {
      networkList: "networkList",
    }),
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
    ...mapWritableState(useClickInstall, {
      configServices: "configServices",
      configNetwork: "configNetwork",
      removedServices: "removedServices",
    }),
    nextRouteHandler() {
      if (this.configServices.some((item) => item.category !== "service")) {
        return true;
      } else {
        return false;
      }
    },
  },

  created() {
    this.extractNetwork();
  },
  mounted() {
    this.categoryFilter();
  },
  methods: {
    removeServiceFromList(item, index) {
      if (item.category === "service") {
        this.removedServices = this.removedServices.concat(this.categoryService.splice(index, 1));
      } else {
        this.removedServices = this.removedServices.concat(this.categoryConfig.splice(index, 1));
      }
      this.configServices = this.categoryConfig.concat(this.categoryService);
    },
    extractNetwork() {
      this.configNetwork = this.networkList.find((network) => network.network === this.configServices[0].network);
    },
    categoryFilter() {
      this.removedServices = []
      this.configServices.forEach((item) => {
        if (item.category === "service") {
          this.categoryService.push(item);
        } else {
          this.categoryConfig.push(item);
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
  padding: 10px 5px 5px 5px;
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
  width: 98%;
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
  width: 25px;
  grid-column: 1/2;
  grid-row: 1/2;
  align-self: center;
  margin-left: 5px;
}
.table-header span {
  grid-column: 2/6;
  grid-row: 1/2;
  font-size: 1rem;
  font-weight: 500;
  color: #e1e1e1;
  text-align: center;
  align-self: center;
  text-transform: uppercase;
}
.table-content {
  width: 100%;
  height: 89%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.table-content::-webkit-scrollbar {
  width: 5px;
  background-color: #2d3134;
  padding: 20px 0;
  z-index: -1;
}
.table-content::-webkit-scrollbar-thumb {
  background-color: #9fb7bb;
  border-radius: 5px;
}

.table-row {
  width: 100%;
  height: 35px;
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
.plugins .pluginCategory {
  grid-column: 4/6;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center;
  padding-left: 20px;
}
.pluginCategory span {
  text-align: right;
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
.container_content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px 5px 5px 5px;
  align-items: center;
}

.container_content .configTitle,
.container_content .serviceTitle {
  width: 100%;
  height: 20px;
  background-color: #286a6a;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_content .configTitle span,
.container_content .serviceTitle span {
  min-width: 90px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: #e1e1e1;
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
