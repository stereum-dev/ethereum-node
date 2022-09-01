<template>
  <div class="modal-bg" @click="$emit('hideModal')">
    <div class="modal-box">
      <div class="modal-box-title">
        <span>INTRODUCTION</span>
      </div>
      <div class="modal-items">
        <div class="item" v-for="(item, index) in steps" :key="index" @click="$emit('showItem')">
          <div class="icon-box">
            <img :src="item.icon" alt="icon" />
          </div>
          <div class="item-text">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
      <span class="click">Click outside to close</span>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useTutorialStore } from "@/store/tutorialSteps";
export default {
  computed: {
    ...mapWritableState(useTutorialStore, {
      modalIsVisible: "modalIsVisible",
      steps: "steps",
    }),
  },
  methods: {

  },
};
</script>
<style scoped>
.modal-bg {
  width: 100%;
  height: 100%;
  background-color: #181818e1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius:0 35px 5px 5px;

  z-index: 200;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
.modal-box {
  width: 45%;
  height: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #3a6868;
  border: 1px solid #989898;
  border-radius: 15px;
  position: relative;
}
.modal-box .modal-box-title {
  width: 90%;
  height: 40px;
  border: 2px solid #7b7e83;
  border-radius: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box-title span {
  font-size: 1rem;
  font-weight: 600;
  color: #c3c3c3;
}
.modal-items {
  width: 90%;
  height: 65%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
}
.item {
  width: 32%;
  height: 80%;
  border: 2px solid #7b7e83;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px rgb(68, 68, 68);
}
.item:hover {
  border: 2px solid rgb(79, 174, 160);
  box-shadow: 0 1px 5px 1px rgb(68, 68, 68);
  transition-duration: 200ms;
  transform: scale(1.02);
}
.item:active {
  border: 2px solid rgb(79, 174, 160);
  transition-duration: 200ms;
  transform: scale(1);
}
.item .icon-box {
  background-color: #33393e;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 100px;
}
.item-text {
  width: 100%;
  height: 35%;
  border-top: 2px solid #7b7e83;
  background: #93979e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-text span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #303030;
}
.modal-items::-webkit-scrollbar {
  display: none;
}
.click {
  font-size: 0.7rem;
  color: #d8d8d8;
}
</style>
