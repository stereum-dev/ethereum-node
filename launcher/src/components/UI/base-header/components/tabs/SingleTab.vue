<template>
  <router-link
    :to="props.tab.path"
    class="w-full h-8 col-span-2 transition-colors duration-300 min-w-[100px] transform text-gray-200 rounded-full px-4 py-1 text-center font-semibold shadow-sm shadow-[#1c3634] border border-[#4b8585]"
    :class="[
      isActiveTab ? 'bg-[#224141] hover:bg-[#224141]  border-gray-600' : 'bg-[#387272] hover:bg-[#336666]',
      pagesTabsHandler ? 'pointer-events-none opacity-45' : 'cursor-pointer',
    ]"
    >{{ props.tab.page }}</router-link
  >
</template>
<script setup>
import { useRouter } from "vue-router";

import { computed } from "vue";

import { useServices } from "@/store/services";

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
});

const serviceStore = useServices();
const router = useRouter();

const pagesTabsHandler = computed(() => {
  return serviceStore.installedServices.length === 0;
});

const isActiveTab = computed(() => {
  return router.currentRoute.value.fullPath === props.tab.path || router.currentRoute.value.fullPath === props.tab?.relativePath;
});
</script>
