<template>
  <swiper
    :modules="modules"
    :slidesPerView="3"
    :centeredSlides="true"
    :spaceBetween="30"
    :pagination="{
      type: 'fraction',
    }"
    :navigation="true"
    :virtual="true"
    class="mySwiper"
    @swiper="setSwiperRef"
  >
    <swiper-slide v-for="(slideContent, index) in slides" :key="index" :virtualIndex="index">{{
      slideContent
    }}</swiper-slide>
  </swiper>
</template>

<script setup>
  import 'swiper/css';
  import { Swiper, SwiperSlide } from 'swiper/vue';
import Pagination from 'swiper';


  const modules = {Pagination , Navigation ,Mousewheel , Keyboard};
const { slides } = defineProps({
  slides: Array,
});
console.log(slides);
const emit = defineEmits(["modalEvent"]);
const modules = ;

const singleSwiper = ref(null);

const handleModal = (item) => {
  emit("modalEvent", item);
  console.log(item);
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.swiper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide {
  height: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .swiper-button-prev,
.swiper-button-next {
  width: 20px !important;
  height: 20px !important;
  margin-top: 0;
  margin-bottom: 0;
  color: #000;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  width: 5px !important;
  height: 5px !important;
  font-size: 10px !important;
  background: #000 !important;
  transform: scale(0.5) !important;
} */
</style>
