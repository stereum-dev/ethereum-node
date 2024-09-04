<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12 p-1">
    <div
      class="w-full h-full col-start-5 col-end-21 row-start-3 row-end-11 grid grid-cols-12 grid-rows-12 p-2 mx-auto bg-[#1E2429] rounded-md"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 bg-teal-600 rounded-md py-1 px-2 flex justify-between items-center z-10">
        <span class="text-sm text-gray-200 font-normal uppercase">{{ $t("ImportConfigHeader.toImport") }}</span>
        <span class="text-sm text-gray-200 font-normal uppercase">{{ $t("ImportConfigHeader.rem") }}</span>
      </div>
      <div
        class="col-start-1 col-span-full row-start-2 row-span-full overflow-x-hidden overscroll-y-auto flex flex-col justify-start items-start space-y-2 mt-2"
      >
        <TransitionGroup name="fade">
          <div v-if="setups.length" class="serviceTitle">
            <span class="text-sm text-gray-300 font-semibold uppercase">Setups</span>
          </div>
          <div
            v-for="(setup, index) in setups.filter((item) => item.name !== 'commonServices')"
            :key="`${setup.name} + ${index}`"
            class="table-row duration-500"
          >
            <div class="col-start-1 col-end-6 row-start-1 row-span-1 w-full h-full grid grid-cols-6">
              <span
                class="col-start-1 col-span-1 w-[27px] h-[27px] rounded-full self-center justify-self-start"
                :style="getIconColor(setup)"
              ></span>
              <div class="pluginName">
                <span>
                  {{ setup.name }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="configServices.length" class="configTitle">
            <span class="text-sm text-gray-300 font-semibold uppercase">{{ $t("importingList.nodeConf") }}</span>
          </div>
          <div
            v-for="(plugin, index) in categoryConfig.filter((item) => item.category !== undefined)"
            :key="`${plugin.name} + ${index}`"
            class="table-row duration-500"
          >
            <div class="plugins">
              <img :src="plugin?.icon" alt="icon" class="pluginIcon" />
              <div class="pluginName">
                <span>
                  {{ plugin?.name ? plugin?.name : plugin?.service }}
                </span>
              </div>
              <div class="pluginCategory">
                <span>
                  {{ plugin?.category }}
                </span>
              </div>
            </div>
            <div class="remove">
              <img src="/img/icon/import-config-icons/cancel-import.png" alt="remove" @click="removeServiceFromList(plugin, index)" />
            </div>
          </div>
          <div v-if="configServices.length" class="serviceTitle">
            <span class="text-sm text-gray-300 font-semibold uppercase">Services</span>
          </div>
          <div v-for="(plugin, index) in categoryService" :key="`${plugin.name} + ${index}`" class="table-row duration-500">
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
              <img src="/img/icon/import-config-icons/cancel-import.png" alt="remove" @click="removeServiceFromList(plugin, index)" />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import jsYaml from "js-yaml";
export default {
  data() {
    return {
      back: "uploadConfig",
      title: "IMPORTED CONFIG",
      categoryService: [],
      categoryConfig: [],
      setups: [],
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
    this.getAllSetups();
  },
  methods: {
    getAllSetups() {
      const configs = this.configServices.filter((item) => item.category === undefined && item.name === undefined);

      const content = configs[0].content;

      this.setups = this.extractNameAndColor(content);
    },

    extractNameAndColor(content) {
      try {
        const setups = jsYaml.load(content);
        const extractedData = [];

        // eslint-disable-next-line no-unused-vars
        for (const [key, details] of Object.entries(setups)) {
          if (details) {
            // Assuming `name` and `color` are directly under each key in the parsed YAML
            const { name, color } = details;
            if (name && color) {
              extractedData.push({ name, color });
            }
          }
        }
        return extractedData;
      } catch (error) {
        console.error("Failed to parse YAML content", error);
        return [];
      }
    },

    removeServiceFromList(item, index) {
      if (item.category === "service") {
        this.removedServices = this.removedServices.concat(this.categoryService.splice(index, 1));
      } else {
        this.removedServices = this.removedServices.concat(this.categoryConfig.splice(index, 1));
      }
      this.configServices = this.categoryConfig.concat(this.categoryService);
    },
    extractNetwork() {
      this.configNetwork = this.networkList.find((network) => network?.network === this.configServices[0]?.network);
    },
    categoryFilter() {
      this.removedServices = [];
      this.configServices.forEach((item) => {
        if (item.category === "service") {
          this.categoryService.push(item);
        } else {
          this.categoryConfig.push(item);
        }
      });
    },

    getIconColor(item) {
      let clr = item.color;
      if (clr === "default") {
        return { backgroundColor: "#38b2ac" };
      } else {
        return { backgroundColor: clr };
      }
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
  max-height: "35px";
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
