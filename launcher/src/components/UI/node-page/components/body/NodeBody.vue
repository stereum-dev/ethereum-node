<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] flex flex-col space-y-4 rounded-md overflow-y-scroll pt-4 mt-1 bg-amber-500"
  >
    Node Body
  </div>
</template>

<script>
export default {
  name: "NodeBody",
  components: {},
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
