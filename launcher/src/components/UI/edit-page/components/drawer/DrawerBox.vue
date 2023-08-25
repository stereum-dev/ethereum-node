import { useServices } from '@/store/services';
<template>
  <div
    class="flex flex-col w-full h-full px-2 py-4 overflow-y-auto overflow-x-hidden border-l border-gray-500 rounded-l-xl bg-[#2e5151]"
  >
    <div
      class="w-full h-full flex flex-col items-center space-y-6 bg-[#151618] border border-gray-500 rounded-md overflow-y-auto relative py-3"
    >
      <transition-group>
        <div v-for="service in store.allServices" :key="service.serviceID" ref="el" class="w-full relative">
          <img
            :src="service.sIcon"
            alt="Client Icon"
            class="w-14 cursor-grab mx-auto"
            @mouseenter="service.displayTooltip = true"
            @mouseleave="service.displayTooltip = false"
          />
          <div
            v-if="service.displayTooltip"
            class="absolute -top-[20px] left-1 h-5 bg-slate-100 border border-yellow-600 text-xs font-semibold rounded-sm flex justify-center items-center px-1 justify-self-center truncate overflow-x-clip"
          >
            <span>{{ service.name }}</span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";

import { ref } from "vue";

const store = useServices();
const el = ref(null);
</script>
