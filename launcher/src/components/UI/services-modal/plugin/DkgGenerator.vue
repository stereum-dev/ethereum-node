<template>
  <div class="SSVDKG-generator_parent">
    <div class="SSVDKG-generator_header">
      <span>DISTRIBUTED KEY GENERATION</span>
    </div>
    <div class="SSVDKG-generator_spaceWindow">
      <div v-if="!dkgvalue" class="generatingAnim w-full h-full items-center justify-center flex">
        <img class="w-1/2" src="/animation/services/ssv-network/ssv-network-animation.gif" alt="ENR generating" />
      </div>

      <div v-else class="SSVDKG-generator_wapper">
        <span>{{ dkgvalue }}</span>
      </div>
    </div>
    <div class="SSVDKG-generator_btn-box">
      <input v-if="!errorGenerate" v-model="backupPath" type="text" placeholder="/path/to/backup" />

      <span
        v-if="!errorGenerate"
        class="absolute cursor-pointer uppercase flex justify-center items-center backup-btn text-gray-50"
        @click="backupBtn"
        >back up</span
      >

      <div :class="['SSVDKG-generator_btn', errorGenerate ? 'text-red-600' : 'text-gray-50', 'uppercase']" @click="modalHandling">
        {{ errorGenerate ? "return" : "complete" }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import ControlService from "@/store/ControlService";
import { useNodeHeader } from "@/store/nodeHeader";

const headerStore = useNodeHeader();

//TODO: Implement the backup path logic
const backupPath = ref("");
//TODO: Implement the DKG generator string here
const dkgvalue = ref("");
//TODO: Implement the DKG generator logic
const errorGenerate = ref(false);

const modalHandling = () => {
  //TODO: Implement the logic to handle the modal
  headerStore.showSsvDkgWindow = false;
};

const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog({
      properties: ["openDirectory", "createDirectory"],
    });
    backupPath.value = paths[0];
    console.log("backupPath", backupPath.value);
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      backupPath.value = "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};

const backupBtn = async () => {
  await openDirectoryPicker();
};
</script>

<style scoped>
.SSVDKG-generator_parent {
  width: 95%;
  height: 90%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.SSVDKG-generator_header {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1% 0;
}
.SSVDKG-generator_header span {
  color: #dbdbdb;
  font-size: 1.2rem;
  font-weight: 600;
}
.SSVDKG-generator_spaceWindow {
  width: 95%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  padding: 1%;
  cursor: text;
  color: #dbdbdb;
  font-size: 100%;
  font-weight: 400;
  overflow-y: scroll;
  background-size: cover;
  background-position: center;
}
.SSVDKG-generator_wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
}
.SSVDKG-generator_spaceWindow span {
  width: 100%;
  height: 20%;
  font-size: 1rem;
  font-weight: 400;
  flex-shrink: 0;
  word-wrap: break-word;
}
.SSVDKG-generator_btn-box {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2% 0;
  position: relative;
}
.SSVDKG-generator_btn-box input {
  width: 61%;
  height: 80%;
  background-color: #eee;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
}
.backup-btn {
  top: 1;
  left: 48%;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #1ba5f8;
  color: #eee;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  height: 75%;
  width: 15%;
}
.backup-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
  transform: scale(0.98);
}
.SSVDKG-generator_btn {
  width: 30%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1ba5f8;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.SSVDKG-generator_btn:active {
  transition-duration: 100ms;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
