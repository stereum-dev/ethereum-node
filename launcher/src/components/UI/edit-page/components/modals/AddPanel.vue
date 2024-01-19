import { onMounted } from 'vue';
<template>
  <div class="w-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6 relative">
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/folder.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">Installation Path</span>
        <input
          v-model="props.properties.installDir"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div v-if="client.category === 'consensus'" class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="w-8 col-start-1" src="/img/icon/manage-node-icons/sync.gif" alt="Sync Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">Sync Mode</span>
        <SyncCarousel :properties="props.properties" />
      </div>
    </div>

    <div v-if="client.category === 'external'" class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/external-source.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">External Source</span>
        <input
          v-model="manageStore.externalSource"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>

    <div v-if="client.category === 'external'" class="w-full flex justify-center items-center relative">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/external-category.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">CATEGORY</span>
        <div
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500 uppercase relative"
          type="text"
          autofocus
        >
          {{ manageStore.catDefult }}
          <img
            class="drop-icon absolute right-1 top-2"
            src="/img/icon/manage-node-icons/drop-icon.png"
            alt=""
            :style="{ transform: showCatDropDown ? 'rotate(0deg)' : '' }"
            @click="openDropDown"
          />
        </div>
        <ul
          v-if="showCatDropDown"
          class="dropdown w-1/2 col-start-6 col-span-7 min-h-[70px] border border-gray-500 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500 uppercase overflow-hidden absolute right-0"
        >
          <li class="w-full cursor-pointer h-3/4" @click="catToggled('execution')">execution</li>
          <li class="w-full my-2 cursor-pointer h-1/2" @click="catToggled('consensus')">consensus</li>
        </ul>
      </div>
    </div>

    <div
      v-if="client.category === 'external' && manageStore.catDefult == 'execution'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/JWTTokenIcon.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">JWT TOKEN</span>
        <input
          v-model="manageStore.jwtToken"
          :disabled="shouldDisableInput"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SyncCarousel from "../edit/SyncCarousel";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
  properties: {
    type: Object,
    default: null,
  },
});

const manageStore = useNodeManage();

const showCatDropDown = ref(false);

manageStore.catDefult = "select a category";
manageStore.externalSource = "";
manageStore.jwtToken = "";

const openDropDown = () => {
  showCatDropDown.value = !showCatDropDown.value;
};

const catToggled = (val) => {
  console.log(val);
  showCatDropDown.value = false;
  manageStore.catDefult = val;
};

onMounted(() => {
  props.properties.installDir = "";
  getInstallPath();
});

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
  props.properties.installDir = stereumInstallationPath;
};
</script>

<style scoped>
.drop-icon {
  width: 4%;
  height: 50%;
  transform: rotate(180deg);
}

.dropdown {
  right: 2%;
  bottom: -100%;
  height: 2rem;
}
.dropdown li:hover {
  background: #14b8a6;
  color: #141516;
  height: 1rem;
}
</style>
