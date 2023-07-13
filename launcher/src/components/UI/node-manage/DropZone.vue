<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }} {{ $t("pluginZone.client") }}</span>
      <div class="item-box" @dragenter.prevent @dragover.prevent @mousedown.prevent.stop>
        <div v-for="item in itemsList" :key="item.id" class="items">
          <img
            :src="item.sIcon"
            alt="icon"
            :class="{
              'chosen-plugin': item.active,
              'modify-plugin': item.modifierPanel,
            }"
            @mouseenter="cursorLocation = `${item.name}`"
            @mouseleave="cursorLocation = ''"
            @mouseup.right="selectedItem(item)"
            @click="modifyItem(item)"
          />
        </div>
      </div>
    </template>
    <template #plusIcon>
      <div class="plus-icon-box" @click="$emit('modalView', list)">
        <img src="/img/icon/manage-node-icons/fullscreen.png" alt="icon" />
      </div>
    </template>
  </manage-trapezoid>
</template>
<script>
import ManageTrapezoid from "./ManageTrapezoid.vue";
import { mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useFooter } from "@/store/theFooter";
export default {
  components: {
    ManageTrapezoid,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      itemsList: [],
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },
  watch: {
    list: {
      handler() {
        this.itemsList = this.list;
      },
      immediate: true,
    },
  },
  mounted() {
    this.itemsList = this.list;
  },
  methods: {
    selectedItem(item) {
      if (item.config.serviceID) {
        this.newConfiguration.forEach((s) => {
          if (s.config.serviceID === item.config.serviceID) s.active = !s.active;
        });
      }
      this.$emit("selectItem", item);
    },
    modifyItem(item) {
      if (item.modifierPanel) {
        this.newConfiguration.forEach((s) => (s.modifierPanel = false));
        return;
      }
      if (item.config.serviceID) {
        this.newConfiguration.forEach((s) => {
          if (s.config.serviceID === item.config.serviceID) {
            s.modifierPanel = true;
          } else {
            s.modifierPanel = false;
          }
        });
      }
      this.$emit("modifyItem", item);
    },
  },
};
</script>
<style scoped>
.showModal {
  display: none;
}
.title {
  width: max-content;
  min-width: 70px;
  height: 16%;
  color: #d1d1d1;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 1rem 0 1rem;
  background-color: #264744;
  border-radius: 0 15px 15px 0;
  position: absolute;
  left: -1px;
  top: -7%;
  box-shadow: 0 1px 3px rgb(47, 47, 47);
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.item-box {
  width: 99%;
  height: 80px;
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-auto-rows: minmax(80px, auto);
  row-gap: 1px;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
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
  border: 2px solid rgb(252, 107, 102);
  border-radius: 10px;
}
.modify-plugin {
  border: 2px solid rgb(221, 206, 78);
  border-radius: 7px;
}
</style>
