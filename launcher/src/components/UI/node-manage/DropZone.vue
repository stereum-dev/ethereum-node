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
        <div
          class="items"
          v-for="(item, index) in list"
          :key="index"
          ref="itemsList"
        >
          <img
            :src="item.sIcon"
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
  width: 56%;
  background-color: transparent;
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
  border-radius: 7px;
  margin: 0 auto;
}
.item-box .items img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.plus-icon-box {
  background-color: rgb(171, 171, 171);
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
  font-size: 1.1rem;
  color: rgb(65, 65, 65);
  border: 1px solid rgb(229, 229, 229);
  box-shadow: inset 0 1px 4px 1px #cecece, 0 1px 3px 1px #2d2d2d;
  cursor: pointer;
}

.plus-icon-box:hover {
  border: 1px solid rgb(46, 46, 46);
  box-shadow: none;
  font-size: 0.9rem;
}
.plus-icon-box:active {
  background-color: rgb(126, 126, 126);
  border: 1px solid rgb(159, 159, 159);
  box-shadow: none;
  font-size: 0.9rem;
}
.items img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(64, 168, 243);
  border-radius: 10px;
}
</style>
