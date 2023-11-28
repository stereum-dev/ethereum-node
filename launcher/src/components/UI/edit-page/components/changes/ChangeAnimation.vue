<template>
  <div class="w-screen h-screen absolute inset-0 flex justify-center items-center">
    <div class="w-screen h-screen opacity-50 absolute inset-0 bg-black z-10"></div>
    <div
      class="w-[400px] h-[400px] rounded-full border border-gray-500 z-20 relative p-8 flex justify-center items-center"
    >
      <img v-if="getServiceIcon[0]" class="w-10 h-10 orbit" :src="getServiceIcon[0]" alt="Service Icon" />
      <div class="w-full h-full rounded-full border-r border-teal-500 flex justify-center items-center p-8">
        <img
          v-if="getServiceIcon[1]"
          class="w-8 h-8 orbit"
          :src="getServiceIcon[1]"
          alt="Service Icon"
          style="animation-delay: -5s"
        />
        <div class="w-full h-full rounded-full border-l border-gray-100 flex justify-center items-center">
          <img
            v-if="getServiceIcon[2]"
            class="w-6 h-6 orbit"
            :src="getServiceIcon[2]"
            alt="Service Icon"
            style="animation-delay: -10s"
          />
          <img
            class="sunShadow w-20 h-20 rounded-full"
            src="/img/icon/stereum-logo/stereum_logo_extern.png"
            alt="Stereum Logo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { computed } from "vue";

const serviceStore = useServices();

const getServiceIcon = computed(() => {
  return serviceStore.installedServices.filter((e) => e?.icon && !e.icon.includes("data:image/png")).map((e) => e.icon);
});
</script>
<style scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(200px) rotate(-360deg);
  }
}

.orbit {
  position: absolute;
  animation: rotate 10s infinite linear;
}

.sunShadow {
  box-shadow: 0 0 20px 20px #c3c2c2, 0 0 50px 30px rgb(164, 164, 84);
}
.sunShadow {
  box-shadow: 0 0 20px 20px #c3c2c2, 0 0 50px 30px rgb(164, 164, 84);
}
</style>
