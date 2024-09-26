<template>
  <div class="w-full h-full fixed inset-0 flex justify-center items-center z-40">
    <div class="w-full h-full fixed inset-0 bg-black opacity-80 rounded-lg z-10" @click="closeWindow"></div>
    <div
      class="w-3/5 h-2/3 grid grid-cols-12 grid-rows-8 p-2 mx-auto bg-[#2a2e30] z-20 border-2 border-gray-400 rounded-[75px] shadow-lg shadow-black"
    >
      <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
        <span class="text-3xl text-gray-200 font-bold uppercase">{{ $t("reconnectModal.reconnectTitle") }}</span>
      </div>
      <div
        v-if="!reconnecting"
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-5 flex flex-col justify-evenly items-center"
      >
        <img class="w-52" src="/animation/reconnect/stereum_cant_connect.gif" />
        <span class="text-md text-gray-200 font-semibold uppercase">{{ $t("reconnectModal.reconnectMessage") }}</span>
      </div>
      <div
        v-if="reconnecting"
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-5 flex flex-col justify-evenly items-center"
      >
        <img v-if="reconnecting" class="w-52" src="/animation/reconnect/stereum_connected.gif" />
        <span class="text-md text-gray-200 font-semibold uppercase">{{ $t("reconnectModal.reconnectingMessage") }}</span>
      </div>
      <div class="w-full h-full col-start-1 col-span-full row-start-7 row-span-full grid grid-cols-5 items-center">
        <div
          class="w-full min-w-[120px] h-10 col-start-2 col-span-1 flex justify-center items-center cursor-pointer rounded-md active:scale-90 active:shadow-none transition-all duration-100 ease-in-out border border-gray-400 bg-teal-700 hover:bg-teal-900 shadow-md shadow-[#252525]"
          @click="confirmReconnect"
        >
          <span class="text-md text-gray-200 font-semibold uppercase">{{ $t("reconnectModal.reconnectBtn") }}</span>
        </div>

        <div
          class="w-full min-w-[120px] h-10 border border-gray-400 bg-red-500 hover:bg-red-800 shadow-md shadow-[#252525] col-start-4 col-span-1 flex justify-center items-center cursor-pointer rounded-md active:scale-90 active:shadow-none transition-all duration-100 ease-in-out"
          @click="openLogout"
        >
          <span class="text-md text-gray-200 font-semibold uppercase">{{ $t("logOutModal.logOutBtn") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";

const emit = defineEmits(["closeWindow", "confirmReconnect", "openLogout"]);
const { reconnecting } = useNodeHeader();

const closeWindow = () => {
  emit("closeWindow");
};

const confirmReconnect = () => {
  emit("confirmReconnect");
};

const openLogout = () => {
  emit("openLogout");
};
</script>
<style scoped>
.reconnect-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.9;
  z-index: 311;
}
.reconnect-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 18%;
  background-color: #2a2e30;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box span {
  font-size: 200%;
  font-weight: 800;
  color: #c4c4c4;
  text-align: center;
  text-transform: uppercase;
}
.messageContent {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.messageContent img {
  width: 20%;
  height: 72%;
}
.messageContent .message {
  width: 80%;
  color: rgb(195, 195, 195);
  font-size: 100%;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn {
  width: 90%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logoutBtn {
  width: 90%;
  height: 35%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.logoutBox {
  width: 20%;
  height: 35px;
  background-color: #bf3a3a;
  border-radius: 10px;
  border: 2px solid #2a2e30;
  box-shadow: 0 1px 3px 1px rgb(43, 44, 44);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.confirmBox {
  width: 30%;
  height: 35px;
  background-color: #127a65;
  border-radius: 10px;
  border: 2px solid #8f8f8f;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.confirmBox span {
  font-size: 100%;
  font-weight: 700;
  color: #c4c4c4;
  text-transform: uppercase;
}
.confirmBox:hover span {
  color: #c4c4c4;
}
.confirmBox:hover {
  transform: scale(1.05);
  transition: all 100ms;
  color: #d6d6d6;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}

.confirmBox:active {
  transform: scale(1);
  box-shadow: none;
}

.logoutBox:hover span {
  color: #c9c9c9;
}
.logoutBox:hover {
  background-color: #b22020;
  border: 2px solid #c9c9c9;
  transform: scale(1.05);
  transition: all 100ms;
  color: #d6d6d6;
}

.logoutBox:active {
  transform: scale(1);
  box-shadow: none;
}
</style>
