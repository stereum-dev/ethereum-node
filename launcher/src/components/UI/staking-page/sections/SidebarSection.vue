<template>
  <aside
    class="h-full col-start-1 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-6 bg-[#33393E]"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="w-full h-full row-start-1 row-span-3 grid grid-rows-6">
      <button
        class="row-start-3 row-span-1 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="mouseHover"
        @mouseenter="footerStore.cursorLocation = `Display public key`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-6" src="/img/icon/manage-node-icons/nuke.png" alt="Export Icon" />
      </button>
      <Transition name="slide-fade">
        <button
          v-if="buttonHovered"
          class="w-fit h-9 absolute row-start-1 row-end-2 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1"
          @mouseleave="nukeHovered = false"
          @click="displayPublickey"
        >
          <img class="w-4" src="/img/icon/manage-node-icons/nuke.png" alt="Export Icon" />
          <span class="text-xs text-gray-200 font-semibold">Public Key</span>
        </button>
      </Transition>
    </div>
  </aside>
</template>
<script setup>
import { ref } from "vue";
import { useFooter } from "@/store/theFooter";

const buttonHovered = ref(false);
const footerStore = useFooter();

const emit = defineEmits(["displayPublickey"]);

const mouseHover = () => {
  buttonHovered.value = !buttonHovered.value;
};

const displayPublickey = () => {
  emit("displayPublickey");
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
