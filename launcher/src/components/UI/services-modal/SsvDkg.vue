<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="SSVDKG-header">
        <div class="icon-box">
          <img :src="SSVDKGService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name">
            <span>{{ SSVDKGService.name }} INITIATOR</span>
          </div>
          <div class="service-option">
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="!activeDkgGenerator" class="browserBox">
          <div class="title flex text-sm text-gray-100 justify-start items-start w-full h-1/3 pl-2 pt-2">
            IF YOU ARE THE CLUSTER LEADER PAST THE PROVIDED COMMAND
          </div>
          <div class="input-box flex justify-center items-center w-full h-2/3 relative">
            <input v-model="providedCommand" type="text" />
            <div
              :class="[
                'btn',
                'bg-[#1BA5F8]',
                'w-24',
                ' h-1/2',
                'rounded-2xl',
                'absolute',
                'right-7',
                'flex',
                'justify-center',
                'items-center',
                'cursor-pointer',
                'text-base',
                'text-gray-100',
                'font-bold',
                'uppercase',
                { disabled: !providedCommand },
              ]"
              @click="startSSVDkgCommand"
            >
              start
            </div>
          </div>
        </div>
        <DkgGenerator v-else />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { ref, onMounted } from "vue";
import DkgGenerator from "./plugin/DkgGenerator";

const headerStore = useNodeHeader();

const SSVDKGService = ref({});
const providedCommand = ref("");
const activeDkgGenerator = ref(false);

onMounted(() => {
  filterSSVDKGService();
});

const filterSSVDKGService = () => {
  headerStore.runningServices.forEach((item) => {
    if (item.name === "SSV DKG") SSVDKGService.value = item;
  });
};

const openBrowser = () => {
  let url = SSVDKGService.value.docsUrl;
  window.open(url, "_blank");
};

const openGitHub = () => {
  let url = "https://github.com/ssvlabs/gitbook-docs/blob/main/developers/tools/ssv-dkg-client/README.md";
  window.open(url, "_blank");
};

const startSSVDkgCommand = () => {
  activeDkgGenerator.value = true;
};
</script>
<style scoped>
.service-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  cursor: default;
}
.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #212122;
  border: 5px solid #a1a1a1;
  border-radius: 30px;
  position: absolute;
  top: 9%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 105;
  cursor: default;
}

.SSVDKG-header {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: nowrap;
  position: relative;
  z-index: 102;
  margin-top: 1.5%;
}
.icon-box {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 70%;
  height: 90%;
}
.title-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.service-name {
  width: 100%;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option {
  width: 60%;
  height: 38%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option img {
  width: 8%;
  height: 72%;
  margin-right: 15px;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 75%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.browserBox {
  width: 95%;
  height: 30%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2%;
  flex-direction: column;
}
.input-box input {
  width: 90%;
  height: 50%;
  border: none;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 500;
  padding-left: 10px;
}
.input-box .btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
  transform: scale(0.98);
}

.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
