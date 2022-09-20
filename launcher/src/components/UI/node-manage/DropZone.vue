<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }}</span>
      <div
        class="item-box"
        @dragenter.prevent
        @dragover.prevent
        onmousedown="return false"
      >
        <div class="items" v-for="(item, index) in itemsList" :key="index">
          <img
            :src="item.sIcon"
            alt="icon"
            @mouseup.right="selectedItem(item)"
            @click="modifyItem(item)"
            :class="{
              'chosen-plugin': item.active,
              'modify-plugin': item.modifierPanel,
            }"
          />
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
import ManageTrapezoid from "./ManageTrapezoid.vue";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
export default {
  components: {
    ManageTrapezoid,
  },
  props: ["title", "list"],
  data() {
    return {
      itemsList: this.list,
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
  },
  methods: {
    selectedItem(item) {
      item.active = !item.active;
      this.$emit("selectItem", item);
    },
    modifyItem(item) {
      this.installedServices.map((i) => {
        if (i.id != item.id) {
          i.modifierPanel = false;
        } else if (i.id == item.id) {
          i.modifierPanel = true;
        }
      });
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
  border: 2px solid rgb(252, 107, 102);
  border-radius: 10px;
}
.modify-plugin {
  border: 2px solid rgb(221, 206, 78);
  border-radius: 7px;
}
</style>
