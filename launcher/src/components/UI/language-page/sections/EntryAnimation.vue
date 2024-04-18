<template>
  <div class="absolute inset-0 flex justify-center items-center">
    <div class="absolute inset-0 w-full h-full bg-black opacity-50 z-10 rounded-md"></div>
    <img class="w-full h-full z-20" :src="currentGif" alt="Animated Language Gif" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLangStore } from "@/store/languages";

const langStore = useLangStore();

const anims = ref([
  { path: "/animation/language/lang1.gif", duration: 1000 },
  { path: "/animation/language/lang2.gif", duration: 1000 },
  { path: "/animation/language/lang3.gif", duration: 800 },
]);

const settingsStereum = ref([
  {
    path: "/animation/language-stereum-settings/language-stereum-settings-1.gif",
    duration: 1000,
  },
  {
    path: "/animation/language-stereum-settings/language-stereum-settings-2.gif",
    duration: 1000,
  },
  {
    path: "/animation/language-stereum-settings/language-stereum-settings-3.gif",
    duration: 800,
  },
]);

const currentGif = ref("");
const router = useRouter();

onMounted(() => {
  playGifsSequentially(0);
});

onUnmounted(() => {
  langStore.isEntryAnimationActive = false;
});

function playGifsSequentially(index) {
  if (index >= anims.value.length) {
    langStore.settingPageIsVisible ? router.push("/setting") : router.push("/login"); // Navigate to /login route after the last GIF
    langStore.settingPageIsVisible = false;

    return;
  }

  currentGif.value = langStore.settingPageIsVisible ? settingsStereum.value[index].path : anims.value[index].path;

  setTimeout(() => {
    playGifsSequentially(index + 1);
  }, anims.value[index].duration);
}
</script>
<style></style>
