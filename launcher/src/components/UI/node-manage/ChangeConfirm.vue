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
      <button class="confirm-btn" @click="confirmHandler">
        {{ $t("changeConfirm.confirm") }}
      </button>
    </div>
    <div class="table-container">
      <div class="table-box">
        <div class="tableRow" v-for="item in confirmChanges" :key="item.id">
          <div class="left-icon">
            <img :src="item.contentIcon" alt="icon" />
          </div>
          <div class="taskName">
            <span>{{ item.content }}</span>
          </div>
          <div class="right-icon">
            <img :src="item.service.icon" alt="icon" />
          </div>
        </div>
      </div>
      <div class="table-footer">
        <span>{{ $t("changeConfirm.change") }}</span>
      </div>
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
      <button class="trash-btn" @click="clickOnRemoveBtn">
        {{ $t("changeConfirm.delete") }}
      </button>
    </div>
  </div>
</template>
<script>
import { toRaw } from "vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
export default {
  computed: {
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
      selectedItemToRemove: "selectedItemToRemove",
      confirmChanges: "confirmChanges",
      actionContents: "actionContents",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
  },
  methods: {
    getActions(action, service) {
      let item = this.actionContents.find((item) => item.content === action);
      if (item) return { ...item, service: toRaw(service) };
      return undefined;
    },
    clickOnRemoveBtn() {
      this.newConfiguration = this.newConfiguration.filter(
        (item) => !this.selectedItemToRemove.includes(item)
      );
      this.selectedItemToRemove.forEach((item) => {
        this.confirmChanges.push(toRaw(this.getActions("DELETE", item)));
      });
      this.installedServices.forEach((item) => {
        item.active = false;
      });
      this.selectedItemToRemove = [];
    },
    async confirmHandler() {
      await ControlService.handleServiceChanges(toRaw(this.confirmChanges));
      setTimeout(() => {
        this.newConfiguration = this.installedServices
      }, 4000);
      
      this.confirmChanges = [];
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
  justify-content: space-between;
  align-items: center;
}
.confirm-box {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.change-menu .confirm-bg-1 {
  width: 48%;
  height: 57%;
  margin: 5px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .confirm-bg-2 {
  width: 85%;
  height: 85%;
  background-color: #454646;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .check-icon {
  width: 90%;
  height: 90%;
  background-color: #2e2f2f;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.check-icon img {
  width: 62%;
  height: 68%;
  background-color: #33393e;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 1px 3px 1px rgb(33, 33, 33);
}

.table-container {
  margin: 5px auto 0 auto;
  width: 90%;
  height: 45%;
  background-color: #707070;
  border: 1px solid rgb(63, 63, 63);
  border-radius: 10px;
  box-shadow: 0 1px 5px 1px rgb(37, 38, 40);
  padding: 2px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 97%;
  height: 8%;
  margin: 0 auto;
}
.table-footer span {
  color: rgb(209, 209, 209);
  font-size: 0.6rem;
  font-weight: 600;
}
.table-box {
  width: 95%;
  height: 90%;
  background: #242529;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 2% auto;
  padding-top: 5px;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-box::-webkit-scrollbar {
  width: 2px;
}
.tableRow {
  width: 98%;
  height: 11%;
  margin: 1% auto;
  padding: 1%;
  background: #48494f;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tableRow .right-icon {
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}
.tableRow .left-icon {
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableRow .right-icon img {
  width: 100%;
}
.tableRow .left-icon img {
  width: 100%;
}
.tableRow .taskName {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.taskName span {
  color: rgb(207, 207, 207);
  font-size: 0.5rem;
  font-weight: 500;
  word-wrap: unset;
}

.trash-box {
  width: 100%;
  height: 28%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.change-menu .trash-bg-1 {
  width: 50%;
  height: 54%;
  margin: 5px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-bg-2 {
  width: 85%;
  height: 85%;
  background-color: #454646;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-icon {
  width: 90%;
  height: 90%;
  background-color: #2e2f2f;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trash-icon img {
  width: 100%;
  height: 100%;
}
button {
  width: 80px;
  height: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  outline-style: none;
  border: 3px solid gray;
  box-shadow: 0 1px 3px 1px rgb(25, 48, 40);
  border-radius: 50px;
  background-color: rgb(28, 81, 78);
  color: rgb(215, 215, 215);
  transition-duration: 100ms;
}
button:hover {
  transform: scale(1.06);
  border: 3px solid rgb(168, 168, 168);
}
button:active {
  transform: scale(1);
  border: 3px solid gray;
  box-shadow: none;
}
::-webkit-scrollbar {
  width: 1px;
  background-color: transparent;
}
</style>
