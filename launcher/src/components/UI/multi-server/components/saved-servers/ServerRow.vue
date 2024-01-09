import { ref, computed } from 'vue';
<template>
  <div
    class="w-full h-[55px] rounded-md px-2 py-1 shadow-md shadow-[#29292c] grid grid-cols-12 gap-x-2 cursor-pointer transition-all duration-200 ease-in-out hover:scale-100"
    :class="props.server.isConnected ? 'bg-[#336666] scale-100' : 'bg-gray-200 scale-95'"
    @mouseenter="hovered = true"
    @click="pickServer"
  >
    <img
      class="col-start-1 col-span-1 self-center mx-auto h-10 w-10 flex-none rounded-full bg-gray-50"
      :src="props.server.icon"
      alt=""
    />
    <div
      class="col-start-2 col-span-full flex flex-col justify-center items-start"
      :class="props.server.isConnected ? 'text-gray-100' : 'text-gray-800'"
    >
      <p class="leading-6" :class="hovered ? 'text-sm' : 'text-xs'">
        {{ getServerNumber }}
      </p>
      <p class="font-semibold" :class="hovered ? 'text-md' : 'text-sm'">
        {{ props.server.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
  idx: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["pickServer"]);

const hovered = ref(false);

const getServerNumber = computed(() => {
  return `SERVER #${props.idx + 1}`;
});

const pickServer = () => {
  emit("pickServer", props.server);
};
</script>
