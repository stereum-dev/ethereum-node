<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-24 grid-rows-12 p-2 divide-y-2 divide-gray-200"
  >
    <div
      class="col-start-1 col-end-10 row-start-1 row-span-full p-1 grid grid-cols-12 grid-rows-12"
    >
      <LoginBox v-if="isServerLoginActive" />
      <ManagementParent v-if="isServerManagementActive" />
    </div>

    <SavedServers />
  </div>
</template>

<script setup>
import SavedServers from "./SavedServers.vue";
import LoginBox from "./LoginBox.vue";
import ManagementParent from "./ManagementParent.vue";
</script>
