<template>
  <div
    class="w-full h-full col-start-1 col-end-7 row-start-2 row-span-full grid grid-cols-6 grid-rows-15 items-center bg-red-600 gap-1 p-1"
  >
    <WidgetCard class="info-widget col-start-1 col-span-6 row-start-1 row-span-3"><InfoWidget /></WidgetCard>
    <WidgetCard class="info-widget col-start-1 col-span-6 row-start-4 row-span-3" />
    <WidgetCard class="cpu-widget col-start-1 col-span-6 row-start-7 row-span-3"><TheCpu /></WidgetCard>
    <WidgetCard class="ram-widget col-start-1 col-span-6 row-start-10 row-span-3"><TheRam /></WidgetCard>
    <WidgetCard class="network-widget col-start-1 col-span-6 row-start-13 row-span-3"><TheNetwork /></WidgetCard>
  </div>
</template>

<script setup>
import WidgetCard from "../components/cards/WidgetCard.vue";
import TheNetwork from "../components/widgets/TheNetwork.vue";
import TheRam from "../components/widgets/TheRam.vue";
import TheCpu from "../components/widgets/TheCpu.vue";
import InfoWidget from "../components/widgets/InfoWidget.vue";
</script>
