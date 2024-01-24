import { onMounted, watch } from 'vue';
<template>
  <div
    class="w-full h-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6 relative"
  >
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img
          class="col-start-1 w-8"
          src="/img/icon/manage-node-icons/folder.png"
          alt="Path Icon"
        />
        <span class="col-start-2 col-span-3 text-gray-400 text-left"
          >Installation Path</span
        >
        <input
          v-model="props.properties.installDir"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div
      v-if="client.category === 'consensus' && client.service !== 'ExternalService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img
          class="w-8 col-start-1"
          src="/img/icon/manage-node-icons/sync.gif"
          alt="Sync Icon"
        />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left"
          >Sync Mode</span
        >
        <SyncCarousel :properties="props.properties" />
      </div>
    </div>

    <div
      v-if="client.service === 'ExternalService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img
          class="col-start-1 w-8"
          src="/img/icon/manage-node-icons/external-source.png"
          alt="Path Icon"
        />
        <span class="col-start-2 col-span-3 text-gray-400 text-left"
          >External Source</span
        >
        <input
          v-model="manageStore.externalSource"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>

    <div
      v-if="client.service === 'ExternalService'"
      class="w-full flex justify-center items-center relative"
    >
      <div class="w-full grid grid-cols-12 items-center relative">
        <img
          class="col-start-1 col-span-1 w-8"
          src="/img/icon/manage-node-icons/external-category.png"
          alt="Path Icon"
        />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">CATEGORY</span>
        <div
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 rounded bg-[#141516] uppercase relative grid grid-cols-12 items-center cursor-pointer"
          @click="openDropDown"
        >
          <span class="col-start-1 col-end-12 text-left text-gray-400 text-xs">
            {{ manageStore.catDefult }}</span
          >
          <img
            class="col-start-12 col-span-1 justify-self-auto w-3 h-3 drop-icon"
            src="/img/icon/manage-node-icons/drop-icon.png"
            alt=""
            :class="showCatDropDown ? 'transform rotate-180' : ''"
          />
        </div>
        <Transition name="slide-fade">
          <ul
            v-if="showCatDropDown"
            class="absolute top-9 right-8 w-64 bg-gray-500 h-fit z-10 divide-y overflow-y-auto flex flex-col justify-start items-center p-2 rounded-md shadow-lg"
          >
            <li
              v-for="cat in externalCategories"
              :key="cat"
              class="w-full cursor-pointer h-8 text-md text-center text-gray-100 font-semibold hover:bg-blue-400 capitalize"
              @click="catToggled(cat)"
            >
              {{ cat }}
            </li>
          </ul>
        </Transition>
      </div>
    </div>

    <div
      v-if="client.service === 'ExternalService' && manageStore.catDefult == 'execution'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img
          class="col-start-1 w-8"
          src="/img/icon/manage-node-icons/JWTTokenIcon.png"
          alt="Path Icon"
        />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">JWT TOKEN</span>
        <input
          v-model="manageStore.jwtToken"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import SyncCarousel from "../edit/SyncCarousel";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";

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
const serviceStore = useServices();

const showCatDropDown = ref(false);
manageStore.externalSource = "";
manageStore.jwtToken = "";
const externalCategories = ref(["execution", "consensus"]);

//Computed & Watcher

watch(
  () => manageStore.catDefult,
  (newValue) => {
    serviceStore.allServices.forEach((el) => {
      if (el.service === "ExternalService") {
        el.category = newValue;
      }
    });
  }
);

//Lifecycle Hooks

onMounted(() => {
  manageStore.catDefult = "consensus";
  props.properties.installDir = "";
  getInstallPath();
});

//Methods
const openDropDown = () => {
  showCatDropDown.value = !showCatDropDown.value;
};

const catToggled = (val) => {
  showCatDropDown.value = false;
  manageStore.catDefult = val;
  serviceStore.allServices.forEach((el) => {
    if (el.service === "ExternalService") {
      el.category = val;
    }
  });
  console.log(serviceStore.allServices);
};

console.log(serviceStore.installedServices);

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"]
    .join("/")
    .replace(/\/{2,}/, "/");
  props.properties.installDir = stereumInstallationPath;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
}
</style>
