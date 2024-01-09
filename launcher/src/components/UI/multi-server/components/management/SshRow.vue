<template>
  <div class="w-full h-8 grid grid-cols-12 items-center border border-gray-500 rounded-md p-1 bg-[#020202]">
    <span class="col-start-1 col-end-12 text-sm text-gray-300 truncate">{{ props.pubkey }}</span>
    <img
      class="col-start-12 col-span-1 justify-self-center self-center h-6 border border-gray-500 rounded-md p-[2px] bg-[#33383e] hover:border-red-500 active:scale-90 cursor-pointer"
      src="/img/icon/manage-node-icons/trash.png"
      alt="Delete Icon"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  pubkey: {
    type: String,
    required: true,
  },
});
</script>
