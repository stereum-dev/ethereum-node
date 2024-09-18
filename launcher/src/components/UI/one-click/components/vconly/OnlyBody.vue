import { onMounted, ref } from 'vue';
<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto"
  >
    <div
      class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1c1d1d] grid grid-cols-12 grid-rows-7 p-4 border border-gray-600 rounded-md"
    >
      <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full">
        <div
          class="w-full h-full flex flex-col justify-start items-center mx-auto px-4 py-2 space-y-2 mt-6 relative"
        >
          <div class="w-full flex justify-center items-center">
            <div class="w-full grid grid-cols-12 items-center text-md">
              <img
                class="col-start-1 w-8"
                src="/img/icon/edit-node-icons/service-category.png"
                alt="Path Icon"
              />
              <span class="col-start-2 col-span-3 text-gray-400 text-md text-left"
                >EXTERNAL SOURCE</span
              >

              <div
                class="col-start-6 col-span-full w-full relative bg-[#141516] border border-gray-500 rounded-md grid grid-cols-12 items-center"
                @click="dropdown"
              >
                <div
                  class="col-start-1 col-span-full flex justify-center items-center overflow-hidden"
                >
                  <div
                    class="w-3/4 px-2 py-1 text-sm text-gray-400 capitalize flex justify-start items-center space-x-4"
                  >
                    <img
                      v-if="selectedSource.icon ? selectedSource.icon : null"
                      :src="selectedSource.icon"
                      class="w-5"
                    />
                    <span>{{
                      selectedSource.name ? selectedSource.name : "Select Source"
                    }}</span>
                  </div>

                  <button
                    class="w-1/4 h-full p-1 text-gray-500 hover:text-gray-200 flex justify-end items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  v-if="isOpen"
                  class="absolute top-8 left-0 z-10 mt-2 max-h-[160px] w-64 rounded-md bg-gray-700 shadow-lg overflow-x-hidden overflow-y-auto"
                  @mouseleave="isOpen = false"
                >
                  <div class="divide-y divide-gray-500">
                    <div
                      v-for="source in sources"
                      :key="source"
                      class="w-full flex justify-center items-center space-x-4 px-4 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-blue-500 uppercase cursor-pointer"
                      @click="pickSource(source)"
                    >
                      <img v-if="source.icon" :src="source.icon" class="w-6" />
                      <span>{{ source.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="selectedSource.name === 'custom'"
            class="w-full flex justify-center items-center"
          >
            <div class="w-full grid grid-cols-12 items-center text-md">
              <img
                class="col-start-1 w-8"
                src="/img/icon/edit-node-icons/service-external-source.png"
                alt="Path Icon"
              />
              <span class="col-start-2 col-span-3 text-gray-400 text-left">ADDRESS</span>
              <input
                v-model="addressLink"
                class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
                type="text"
                autofocus
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const selectedSource = ref("");
const addressLink = ref("");
const isOpen = ref(false);
const properties = ref(null);

const sources = [
  { name: "custom", icon: null },
  { name: "stereumplus 1", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
  { name: "stereumplus 2", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
  { name: "stereumplus 3", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
];

onMounted(() => {
  addressLink.value = "";
  selectedSource.value = "";
  addressLink.value = "";
});

//Methods

const dropdown = () => {
  isOpen.value = !isOpen.value;
};

const pickSource = (source) => {
  isOpen.value = false;
  selectedSource.value = source;
  properties.value = {
    source: selectedSource.value,
    address: addressLink.value,
  };
};
</script>
