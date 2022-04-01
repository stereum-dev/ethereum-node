<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }}</span>
      <div
        class="item-box"
        @drop="onDrop($event, sidebarPlugins)"
        @dragenter.prevent
        @dragover.prevent
        onmousedown="return false"
      >
        <div
          class="items"
          v-for="(item, index) in list"
          :key="index"
          ref="itemsList"
        >
          <img
            :src="item.source"
            alt="icon"
            @click="selectedItem(item)"
            :class="{ 'chosen-plugin': item.active }"
          />
        </div>
      </div>
    </template>
    <template #plusIcon>
      <div class="plus-icon-box" @click="$emit('modalView', list)">
        <span>+</span>
      </div>
    </template>
  </manage-trapezoid>
</template>
<script>
import ManageTrapezoid from "./ManageTrapezoid.vue";
export default {
  components: {
    ManageTrapezoid,
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
    };
  },
  methods: {
    selectedItem(item) {
      item.active = !item.active;
      this.$emit("itemSelect", item);
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
  justify-content: space-between;
  align-self: center;
  align-items: center;
  row-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 21%;
  left: 21.6%;
  height: 63px;
  width: 230px;
  background-color: transparent;
  border-bottom: 5px solid #656565;
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
  border: 1px solid rgb(96, 95, 95);
  border-radius: 10px;
  margin: 0 auto;
}
.item-box .items img {
  width: 50px;
  height: 50px;
}
.plus-icon-box {
  background-color: rgb(237, 237, 237);
  width: 30px;
  height: 20px;
  border-radius: 50px;
  position: absolute;
  top: 2px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: rgb(65, 65, 65);
  border: 1px solid rgb(67, 67, 67);
  box-shadow: inset 0 1px 4px 1px #8e8e8e, 0 1px 5px #3e3e3e;
  cursor: pointer;
}

.plus-icon-box:hover {
  border: 1px solid green;
  /* box-shadow: 0 1px 4px 1px rgb(142, 142, 142); */
}
.plus-icon-box:active {
  background-color: #fff;
  border: 1px solid rgb(159, 159, 159);
  box-shadow: none;
  font-size: 14px;
}
.items img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(86, 172, 138);
  border-radius: 13px;
}
</style>
