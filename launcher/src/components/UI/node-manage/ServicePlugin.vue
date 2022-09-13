<template>
  <div class="service-container" onmousedown="return false">
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/up-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 0"
    />
    <div class="service-bg" ref="serviceBg">
      <div
        v-for="item in installedServices.filter(
          (service) => service.category === 'service'
        )"
        :key="item.id"
        class="service-item"
      >
        <img
          :src="item.hIcon"
          alt="icon"
          @dblclick="selectedItem(item)"
          :class="{ 'chosen-plugin': item.active }"
        />
      </div>
    </div>
    <img
      class="service-arrow"
      src="../../../../public/img/icon/manage-node-icons/down-arrow.png"
      alt="icon"
      @click="$refs.serviceBg.scrollTop = 1000"
    />
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
  },
  methods: {
    selectedItem(item) {
      item.active = !item.active;
      this.$emit("selectItem", item);
    },
  },
};
</script>
<style scoped>
.service-container {
  width: 96%;
  height: 98%;
  background-color: #3b3b3b;
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
  height: 25px;
}
.service-item {
  width: 60px;
  height: 60px;
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
  background: #707070;
  border-radius: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.service-bg::-webkit-scrollbar {
  display: none;
}

.service-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-item img {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.service-item img:active {
  box-shadow: none;
}
.chosen-plugin {
  width: 55px;
  height: 55px;
  border: 2px solid rgb(64, 168, 243);
  border-radius: 7px;
}
.service-arrow {
  border-radius: 50px;
  box-shadow: 1px 2px 3px 1px rgb(63, 63, 63);
}
.service-arrow:active {
  box-shadow: none;
}
</style>
