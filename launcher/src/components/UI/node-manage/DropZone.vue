<template>
  <manage-trapezoid>
    <span class="title">{{ title }}</span>
    <div
      class="item-box"
      @drop="onDrop($event, sidebarPlugins)"
      @dragenter.prevent
      @dragover.prevent
    >
      <div class="items" v-for="(item, index) in list" :key="index">
        <img :src="item.source" alt="icon" />
      </div>
    </div>
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
};
</script>
<style scoped>
.title {
  width: auto;
  height: 20px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 5px;
  background-color: #334b3f;
  border-radius: 20px;
  position: absolute;
  left: 0;
  top: -10px;
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
  border-top: 1px solid #656565;
  border-bottom: 1px solid #656565;
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
</style>
