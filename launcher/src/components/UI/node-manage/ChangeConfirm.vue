<template>
  <div class="menu-container">
    <div class="confirm-box">
      <div class="confirm-bg-1">
        <div class="confirm-bg-2">
          <div class="check-icon">
            <img
              src="../../../../public/img/icon/manage-node-icons/check-mark.png"
              alt="icon"
            />
          </div>
        </div>
      </div>
      <base-button class="confirm-btn">CONFIRM</base-button>
    </div>
    <div class="table-container">
      <div class="table-header">
        <span>CHANGES TO CONFIRM</span>
      </div>
      <div class="table-box">
        <div class="table-item" v-for="item in confirmChanges" :key="item.id">
          <div class="left-icon">
            <img :src="item.contentIcon" alt="" />
          </div>
          <span>{{ item.content }}</span>
          <div class="right-icon">
            <img
              src="../../../../public/img/icon/manage-node-icons/plugin-item-icon.png"
              alt="icon"
            />
          </div>
        </div>
      </div>
      <div class="table-footer"></div>
    </div>
    <div class="trash-box">
      <div class="trash-bg-1">
        <div class="trash-bg-2">
          <div class="trash-icon">
            <img
              src="../../../../public/img/icon/manage-node-icons/trash-icon.png"
              alt="icon"
            />
          </div>
        </div>
      </div>
      <button class="trash-btn" @click="clickOnRemoveBtn">DELETE</button>
    </div>
  </div>
</template>
<script>
import BaseButton from "../BaseButton.vue";
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
export default {
  components: { BaseButton },
  props: ["confirmChanges"],
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices"
    }),
    ...mapWritableState(useNodeStore, {
      selectedItemToRemove: "selectedItemToRemove",
    }),
  },
  methods: {
    clickOnRemoveBtn() {
      this.installedServices = this.installedServices.filter(item => {
        return item.id !== this.selectedItemToRemove.id;
      })
    },
  },
};
</script>
<style scoped>
.menu-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.confirm-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.change-menu .confirm-bg-1 {
  width: 70px;
  height: 70px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .confirm-bg-2 {
  width: 55px;
  height: 55px;
  background-color: #2c2f30;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .check-icon {
  width: 46px;
  height: 46px;
  background-color: #33393e;
  border: 1px solid #2b3034;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 2px 1px rgb(75, 75, 75);
}
.change-menu img {
  width: 40px;
  height: 40px;
}
.confirm-btn {
  font-size: 0.8rem;
  font-weight: bold;
  width: 85px;
  height: 35px;
  outline-style: none;
}
.table-container {
  margin: 5px auto 0 auto;
  width: 80%;
  height: 43%;
  background-color: #707070;
  border: 1px solid rgb(63, 63, 63);
  border-radius: 18px;
  padding: 5px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.table-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 10%;
  background-color: #707070;
  border: 1px solid rgb(84, 84, 84);
  box-shadow: 0 1px 4px 1px rgb(33, 33, 33);
  border-radius: 50px;
  margin: 0 auto;
  position: absolute;
  top: 3px;
  right: 4px;
}
.table-header span {
  color: rgb(180, 193, 193);
  font-size: 8px;
  font-weight: 900;
}
.table-box {
  width: 95%;
  height: 83%;
  margin: 0 auto;
  background-color: #3b3a3a;
  border-left: 2px solid gray;
  border-right: 2px solid gray;
  border-radius: 10px;
  padding-top: 22px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.table-item {
  width: 95%;
  height: 25px;
  margin: 5px auto;
  background-color: #1c1e1f;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-item .right-icon {
  width: 20px;
  height: 20px;
  border-radius: 100%;
}
.table-item .left-icon {
  width: 20px;
  height: 20px;
  background-color: #336666;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-item .right-icon img {
  width: 15px;
  height: 15px;
  border-radius: 100%;
}
.table-item .left-icon img {
  width: 14px;
  height: 14px;
}
.table-item span {
  color: rgb(194, 191, 191);
  font-size: 8px;
  font-weight: 700;
}

.table-box img {
  width: 90%;
  height: 200px;
}
.trash-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-bg-1 {
  width: 70px;
  height: 70px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-bg-2 {
  width: 55px;
  height: 55px;
  background-color: #454646;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-icon {
  width: 50px;
  height: 50px;
  background-color: #33393e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trash-icon img {
  width: 70px;
  height: 70px;
}
.trash-btn {
  font-size: 0.8rem;
  font-weight: 900;
  width: 85px;
  height: 35px;
  outline-style: none;
  border-radius: 50px;
  background-color: rgb(42, 42, 42);
  color: rgb(215, 215, 215);
}
::-webkit-scrollbar {
  width: 1px;
  background-color: transparent;
}
</style>
