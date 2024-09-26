<template>
  <div class="w-full h-full grid grid-cols-12 space-x-2">
    <div class="col-start-1 col-end-4 grid grid-cols-3 gap-1 bg-[#33393e] rounded-md py-1 px-2">
      <img class="w-9 h-9 col-start-1 col-span-1 self-center" :src="client.icon" alt="icon" />

      <div class="col-start-2 col-span-full self-center flex flex-col justify-start items-start">
        <span class="text-sm text-gray-300 font-semibold">{{ client.name }}</span>
        <span class="text-xs text-teal-500 font-semibold">{{ client.category }}</span>
      </div>
    </div>

    <div class="col-start-4 col-span-full bg-[#33393e] rounded-md py-1 px-2 flex justify-start items-center">
      <div class="w-full flex flex-col justify-center items-center">
        <span class="text-md text-gray-400 font-semibold">{{ $t("executionSync.gen") }}</span>
        <span class="font-semibold text-md uppercase text-teal-600">{{ $t("executionSync.syncClient") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    client: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>
