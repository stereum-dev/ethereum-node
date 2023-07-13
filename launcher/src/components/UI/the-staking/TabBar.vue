<template>
  <div class="tabbar">
    <div
      v-for="(item, index) in tabs"
      :key="index"
      :class="['tabbar-item', { active: index === activeIndex }]"
      class="tab"
      @click="getItem(item, index)"
      @mouseenter="cursorLocation = `${item.title}`"
      @mouseleave="cursorLocation = ''"
    >
      <img :src="item.imgPath" alt="icon" :class="{ 'animate-pulse': index === activeIndex }" @mousedown.prevent />
      <div class="title">
        <span> {{ optionsTitle }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0, // set the default active index to the first item
      optionsTitle: "ATTESTATION",
    };
  },
  computed: {
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },
  mounted() {},
  methods: {
    getItem(item, index) {
      this.activeIndex = index;
      this.optionsTitle = item.title;
      this.$emit("getTitle", this.optionsTitle, this.activeInde);
    },
  },
};
</script>
<style scoped>
.tabbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 40px;
}
.tabbar .tab {
  padding-bottom: 5px;
}
.tabbar-item {
  flex: 1;
  height: 100%;
  border-radius: 7px;
  padding-top: 3px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #076462a9;
  border: 1px solid #1e6e6da9;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
.tabbar-item img {
  width: 20px;
  height: 20px;
}

.tabbar-item.active {
  color: #333;
  border: 1px solid #308482;
  background-color: #237e7d;
  box-shadow: 1px 1px 5px 1px rgb(43, 43, 43);
  transition-duration: 200ms;
}
.tabbar-item.active .title {
  color: #fff;
}
.tabbar-item .title {
  width: 97.3%;
  height: 30%;
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #237e7d;
  border-radius: 0 0 8px 8px;
  position: absolute;
  bottom: 3px;
  left: 3px;
}
.title span {
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
}
.disabled {
  background-color: #050505;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
