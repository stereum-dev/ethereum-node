<template>
  <div
    class="backup-parent bg-[#A0A0A0] w-full h-full rounded-xl col-start-1 col-span-full pl-2 flex justify-start items-center row-span-1"
  >
    <span class="w-1/2 text-sm uppercase text-black">{{ $t("twoFactorAuth.backup") }}</span>
    <div
      class="backup-btn w-1/2 h-full rounded-xl text-sm uppercase bg-teal-700 hover:bg-teal-900 flex justify-center items-center text-gray-100 cursor-pointer"
      @click="saveBackup"
    >
      <span>{{ $t("twoFactorAuth.save") }}</span>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["saveBackup"]);

const saveBackup = () => {
  emit("saveBackup");
};
</script>

<style scoped>
.backup-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.backup-btn:active span {
  transform: scale(0.95);
}
</style>
