<template>
  <div
    class="btn-parent mt-3 w-11/12 h-12 pr-4 font-semibold text-xl uppercase box-border justify-end flex items-center cursor-pointer"
    :class="{ 'active-btn': active }"
    @click="toggleActive"
  >
    {{ props.btnName }}
    <img
      class="w-5 h-5 mr-2 ml-2"
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
import { defineProps, computed, defineEmits } from "vue";

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
  border-radius: 10px;
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
</style>
