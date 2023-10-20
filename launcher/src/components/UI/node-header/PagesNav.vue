<template>
  <div class="flex px-2 mx-20" @mousedown.prevent>
    <router-link
      to="/node"
      class="transition-colors duration-300 min-w-[100px] transform text-gray-200 rounded-full px-4 py-1 mx-4 text-center"
      :class="
        checkRoute === '/node' || checkRoute === '/edit'
          ? 'bg-[#224141] hover:bg-[#224141]'
          : 'bg-[#387272] hover:bg-[#336666]'
      "
      >Node</router-link
    >
    <router-link
      to="/control"
      class="transition-colors duration-300 min-w-[100px] transform text-gray-200 rounded-full px-4 py-1 mx-4 text-center"
      :class="checkRoute === '/control' ? 'bg-[#224141] hover:bg-[#224141] ' : 'bg-[#387272] hover:bg-[#336666]'"
      >Control</router-link
    >
    <router-link
      to="/staking"
      class="transition-colors duration-300 min-w-[100px] transform text-gray-200 rounded-full px-4 py-1 mx-4 text-center"
      :class="checkRoute === '/staking' ? 'bg-[#224141] hover:bg-[#224141]' : 'bg-[#387272] hover:bg-[#336666]'"
      >Staking</router-link
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
