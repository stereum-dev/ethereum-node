<template>
  <div
    class="w-full h-[430px] flex flex-col justify-start items-center px-1 py-2 overflow-y-hidden hover:overflow-y-auto rounded-md border border-gray-600 bg-[#151618] space-y-2"
    :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
  >
    <template v-if="manageStore.confirmChanges.length">
      <TransitionGroup name="list">
        <div
          v-for="item in getChanges"
          :key="item.id"
          class="w-full h-10 border border-gray-500 shadow-md shadow-black p-1 rounded-md grid grid-cols-6 hover:border-gray-300 cursor-pointer"
          :class="contentBgColor(item)"
          @click="removeChange(item)"
          @mouseenter="footerStore.cursorLocation = `${clickToCancel}`"
        >
          <div class="col-start-1 col-span-1 w-full self-center flex justify-center items-center">
            <img class="w-6" :src="item.contentIcon" alt="icon" />
          </div>
          <div class="col-start-2 col-span-4 text-center flex justify-center items-center overflow-hidden">
            <span>{{ item.content }}</span>
          </div>
          <div
            v-if="item.service.sIcon || item.service.icon"
            class="col-start-6 col-span-1 w-full self-center flex justify-center items-center"
          >
            <img class="w-6" :src="item.service.sIcon ? item.service.sIcon : item.service.icon" alt="icon" />
          </div>
        </div>
      </TransitionGroup>
    </template>
    <div v-else>
      <span class="text-center text-gray-300 text-md font-normal">No changes</span>
    </div>
  </div>
</template>
<script setup>
import { useFooter } from "@/store/theFooter";
import { useNodeManage } from "@/store/nodeManage";
import { computed } from "vue";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const clickToCancel = t("changesBox.clickToCancel");

const footerStore = useFooter();
const emit = defineEmits(["remove-change"]);

const manageStore = useNodeManage();

const getChanges = computed(() => manageStore.confirmChanges);

const removeChange = (item) => {
  emit("remove-change", item);
};

const contentBgColor = (item) => {
  let bg;
  if (item) {
    const content = item.content;
    if (content === "INSTALL") {
      bg = "bg-green-800 text-gray-100 text-sm font-semibold";
    } else if (content === "DELETE") {
      bg = "bg-red-800 text-gray-300 text-sm font-semibold";
    } else if (content === "SWITCH NETWORK") {
      bg = "bg-gray-500 text-gray-900 text-[10px] font-semibold min-w-[100px]";
      console.log(item);
    } else if (content === "SWITCH CLIENT") {
      bg = "bg-teal-700 text-gray-200 text-[10px] font-semibold min-w-[100px]";
    } else if (content === "MODIFY") {
      bg = "bg-teal-700 text-gray-200 text-[10px] font-semibold min-w-[100px]";
    }
  }
  return bg;
};
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
