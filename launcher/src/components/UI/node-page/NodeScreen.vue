<template>
  <base-layout>
    <div class="h-full flex">
      <div class="w-2/12 flex justify-center items-center">
        <SidebarButtons />
      </div>
      <div class="w-5/12 h-stretch bg-blue-600">02</div>
      <div class="w-3/12 bg-red-600">03</div>
      <div class="w-2/12 bg-yellow-600">04</div>
    </div>
  </base-layout>
</template>
<script>
// import ManageButtons from "./sections/ManageButtons.vue";
import SidebarButtons from "./sections/SidebarButtons";
export default {
  name: "NodeScreen",
  components: {
    SidebarButtons,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
