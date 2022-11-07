<template>
  <div class="slider_parent">
    <vueper-slides
      class="no-shadow"
      arrows-inside
      bullets-outside
      transition-speed="250"
    >
      <vueper-slide
        v-for="i in 6"
        :key="i"
        :title="i.toString()"
        :style="'background-color: ' + ['#ff5252', '#42b983'][i % 2]"
      />
    </vueper-slides>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
export default {
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      slides: [
        {
          title: "Slide #1",
          content: "Slide 1 content.",
        },
        {
          title: "Slide #2",
          content: "Slide 2 content.",
        },
      ],
    };
  },
};
</script>
<style scoped>
.slider_parent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: red;
}
.ex--center-mode {
  width: 2rem;
  max-width: 100%;
  height: 2rem;
  max-height: 100%;
}
.vueperslides__bullet .default {
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  box-shadow: none;
  transition: 0.3s;
  width: 16px;
  height: 16px;
}

.vueperslides__bullet--active .default {
  background-color: #42b983;
}

.vueperslides__bullet span {
  display: block;
  color: #fff;
  font-size: 10px;
  opacity: 0.8;
}
</style>
