<template>
  <div
    class="btn-parent mt-3 w-11/12 h-12 pr-4 font-semibold text-xl uppercase box-border justify-end flex items-center cursor-pointer"
    :class="{ 'active-btn': isActive }"
    @click="toggleActive"
  >
    {{ props.btnName }}
    <img
      :src="
        props.btnName == 'audio'
          ? '/img/icon/setting-page/volume-icon.png'
          : isActive
          ? '/img/icon/setting-page/update-icon-grey.png'
          : '/img/icon/setting-page/update-icon-black.png'
      "
      :alt="props.btnName"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  btnName: String,
});

const isActive = ref(false);

const toggleActive = () => {
  isActive.value = !isActive.value;
};
</script>

<style scoped>
.btn-parent {
  border: 1px solid #343434;
  box-shadow: 5px 1px 10px 1px rgb(36, 36, 36);
  border-radius: 10px;
  background: #a1c1ad;
  color: #000;
}
.btn-parent img {
  widows: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
  transition: 0.3s;
}
.active-btn {
  background: #242529;
  color: #eee;
  cursor: default;
}
.btn-parent:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
