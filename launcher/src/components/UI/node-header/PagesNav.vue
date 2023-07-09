<template>
  <div class="flex px-2 mx-20">
    <router-link
      to="/node"
      class="transition-colors duration-300 transform text-gray-200 rounded-full px-4 py-1 hover:bg-[#336666] mx-4"
      :class="checkRoute === '/node' ? 'bg-[#336666] shadow-md shadow-gray-700' : ''"
      >Node</router-link
    >
    <router-link
      to="/staking"
      class="transition-colors duration-300 transform text-gray-200 rounded-full px-4 py-1 hover:bg-[#336666] mx-4"
      :class="checkRoute === '/staking' ? 'bg-[#336666] shadow-md shadow-gray-700' : ''"
      >Staking</router-link
    >
    <router-link
      to="/control"
      class="transition-colors duration-300 transform text-gray-200 rounded-full px-4 py-1 hover:bg-[#336666] mx-4"
      :class="checkRoute === '/control' ? ' bg-[#336666] shadow-md shadow-gray-700' : ''"
      >Control</router-link
    >
  </div>
</template>
<script>
export default {
  name: "PagesNav",
  components: {},
  props: {},
  data() {
    return {
      nodeRoute: false,
      checkRoute: this.$router.currentRoute._value.fullPath,
      stakingRoute: false,
      controlRoute: false,
    };
  },
};
</script>
