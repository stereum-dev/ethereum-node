<template>
  <swiper
    :modules="modules"
    :slides-per-view="3.5"
    :mousewheel="true"
    :navigation="slides.length > 4 ? true : false"
    :virtual="true"
  >
    <swiper-slide v-for="(slide, index) in slides" :key="index" :virtual-index="index">
      <div class="w-full flex justify-center items-center cursor-pointer" @click="handleModal(slide)">
        <img class="w-full h-full" :src="slide.sIcon" alt="Service Icon" />
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Mousewheel, Navigation, Virtual } from "swiper/modules";
import { useNodeHeader } from "@/store/nodeHeader";

const { slides } = defineProps({
  slides: Array,
});

const headerStore = useNodeHeader();
const modules = [Navigation, Mousewheel, Virtual];

// Modal handler
const handleModal = (slide) => {
  headerStore.setServiceModal(slide.service);
};
</script>

<style>
.swiper {
  width: 100% !important;
  height: 100% !important;
  padding: 0 10px !important;
}

.swiper-wrapper {
  width: 90% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.swiper-slide {
  width: 40px !important;
  height: 40px !important;
}

.swiper-button-next,
.swiper-button-prev {
  width: 20px !important;
  height: 90% !important;
  color: rgb(244, 244, 244) !important;
  background-color: rgb(29, 29, 30) !important;
  border-radius: 5px;
  justify-self: end;
  align-self: center;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 15px !important;
}
.swiper-button-next:hover,
.swiper-button-prev:hover {
  transform: scale(1.1) !important;
  background-color: rgb(223, 230, 231) !important;
  color: rgb(29, 29, 30) !important;
}

.swiper-button-next.swiper-button-disabled,
.swiper-button-prev.swiper-button-disabled {
  opacity: 0 !important;
}
</style>
