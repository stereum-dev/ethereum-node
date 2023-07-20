<template>
  <div
    class="scrollbar sscrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full max-h-[440px] flex flex-col space-y-4 rounded-md overflow-y-scroll pt-4"
  >
    <div class="scrollContent">
      <ClientsLayout v-for="service in services" :key="service.name" :client="service" />
    </div>
  </div>
</template>

<script>
import ClientsLayout from "./ClientsLayout.vue";

export default {
  name: "NodeBody",
  components: {
    ClientsLayout,
  },
  data() {
    return {
      services: [
        {
          name: "Geth",
          category: "execution",
          icon: "/img/icon/plugin-icons/execution/Geth-s.png",
          docUrl: "https://github.com/",
        },
        {
          name: "Lighthouse",
          category: "consensus",
          icon: "/img/icon/plugin-icons/consensus/LightHouse-s.png",
          docUrl: "https://github.com/",
        },
        {
          name: "Lighthouse",
          category: "validator",
          icon: "/img/icon/plugin-icons/validator/Lighthouse-Validator-s.png",
          docUrl: "https://github.com/",
        },
        {
          name: "Lighthouse",
          category: "validator",
          icon: "/img/icon/plugin-icons/validator/Lighthouse-Validator-s.png",
          docUrl: "https://github.com/",
        },
      ],
    };
  },
};
</script>

<style scoped>
.scrollParent::-webkit-scrollbar-track {
  background-color: #a01313;
}
</style>
