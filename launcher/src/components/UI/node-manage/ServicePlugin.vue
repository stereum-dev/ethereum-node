<template>
  <div class="service-container" onmousedown="return false">
    <img
      class="service-arrow"
      src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.resetScrollTop = 0"
    />
    <div class="service-bg">
      <div
        v-for="item in list"
        :key="item.id"
        :class="{ 'chosen-plugin': item.active }"
        class="service-item"
        @click="selectedItem(item)"
      >
        <img draggable="false" :src="item.source" alt="icon" />
      </div>
    </div>
    <img
      draggable="false"
      class="service-arrow"
      src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 1000"
    />
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
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
.service-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 95%;
  margin-bottom: 10px;
  background: #4f4f4f;
  align-self: center;
  border-radius: 20px;
  overflow: hidden;
  padding: 5px;
  box-sizing: border-box;
}

.service-arrow {
  width: 50%;
  height: 25px;
}
.service-item {
  width: 60px;
  height: 60px;
  border: 2px solid gray;
  border-radius: 13px;
}
.service-bg {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: repeat(4, 22%);
  align-items: center;
  justify-items: center;
  padding-top: 20px;
  width: 90%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #707070;
  border-radius: 20px;
  gap: 3px;
  cursor: pointer;
}
.service-bg::-webkit-scrollbar {
  display: none;
}

.service-item img {
  width: 60px;
  height: 60px;
  border-radius: 13px;
  box-shadow: 1px 1px 5px 1px rgb(132, 130, 130);
}
.service-item img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(86, 172, 138);
  border-radius: 13px;
}
.service-arrow {
  border-radius: 50px;
  box-shadow: 1px 2px 3px 1px rgb(63, 63, 63);
}
.service-arrow:active {
  box-shadow: none;
}
</style>
