<template>
  <div class="service-container" @mousedown.prevent.stop>
    <img class="service-arrow" src="../../../../public/img/icon/manage-node-icons/white-arrow-up.png" alt="icon"
      @click="$refs.serviceBg.scrollTop = 0" />
    <div class="service-bg" ref="serviceBg">
      <div v-for="item in itemsList" :key="item.id" class="service-item">
        <img :src="item.hIcon ? item.hIcon : item.sIcon" alt="icon" @mouseup.right="selectedItem(item)"
          @click="modifyItem(item)" :class="{
            'chosen-plugin': item.active,
            'modify-plugin': item.modifierPanel,
          }" />
      </div>
    </div>
    <img class="service-arrow" src="../../../../public/img/icon/manage-node-icons/white-arrow-down.png" alt="icon"
      @click="$refs.serviceBg.scrollTop = 1000" />
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";

export default {
  props: ["list"],
  data() {
    return {
      itemsList: [],
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
    }),
  },
  watch: {
    list: {
      handler: function (val) {
        this.itemsList = val;
      },
      immediate: true,
    },
  },
  methods: {
    selectedItem(item) {
      if (item.config.serviceID) {
        item.active = !item.active;
      }
      this.$emit("selectItem", item);
    },
    modifyItem(item) {
      if(item.modifierPanel){
        this.newConfiguration.forEach(s => s.modifierPanel = false)
        return
      }
      this.newConfiguration.map((i) => {
        if (i.id != item.id) {
          i.modifierPanel = false;
        } else if (i.id == item.id && i.service !== 'PrometheusNodeExporterService') {
          i.modifierPanel = true;
          this.$emit("modifyItem", item);
        }
      });
    },
  },
};
</script>
<style scoped>
.service-container {
  width: 96%;
  height: 95%;
  background: #4c4c4e;
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
  height: 10%;
  cursor: pointer;
}

.service-arrow:active {
  transform: scale(0.9);
  transition-duration: 0.1s;
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
  background: #797979;
  border-radius: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}

.service-bg::-webkit-scrollbar {
  display: none;
}

.service-item {
  width: 65%;
  height: 70%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.service-item img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.service-item img:active {
  box-shadow: none;
}

.chosen-plugin {
  border: 2px solid rgb(255, 70, 70);
  border-radius: 7px;
}

.modify-plugin {
  border: 2px solid rgb(221, 206, 78);
  border-radius: 7px;
}
</style>
