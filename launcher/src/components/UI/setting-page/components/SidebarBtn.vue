<template>
  <div
    class="btn-parent w-full rounded-md h-12 pr-4 font-semibold text-xl uppercase box-border cursor-pointer grid grid-col-4 items-center px-2"
    :class="{ 'active-btn': active }"
    @click="toggleActive"
  >
    <span class="col-start-1 col-end-4 text-sm font-semibold" :class="active ? 'text-gray-900' : 'text-gray-200'">{{ props.btnName }}</span>
    <img
      class="col-start-4 col-span-1 w-5 h-5 justify-self-center self-center"
      :src="
        props.btnName == 'audio'
          ? '/img/icon/setting-page/volume-icon.png'
          : active
          ? '/img/icon/setting-page/update-icon-black.png'
          : '/img/icon/setting-page/update-icon-grey.png'
      "
      :alt="props.btnName"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  btnName: String,
  isActive: String,
});

// Convert 'isActive' string prop to a boolean value
const active = computed(() => props.isActive === "true");

const emit = defineEmits(["toggle-active"]);

const toggleActive = () => {
  emit("toggle-active");
};
</script>

<style scoped>
.btn-parent {
  border: 1px solid #343434;
  box-shadow: 5px 1px 10px 1px rgb(36, 36, 36);
  background: #242529;
  color: #eee;
  transition: 0.3s;
}
.btn-parent img {
  transition: 0.3s;
}
.active-btn {
  background: #242529;
  color: #eee;
  background: #a1c1ad;
  color: #000;
  cursor: default;
  transition: 0.3s;
}
.btn-parent:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.btn-parent:active img {
  transform: scale(0.9);
}

.btn-parent:active span {
  transform: scale(0.95);
}
</style>
