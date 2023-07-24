<template>
  <div class="w-full h-[55px] grid grid-cols-6 gap-1 py-1">
    <div class="col-start-1 col-end-3 flex flex-col justify-between items-center">
      <div class="w-full border border-gray-500 rounded-md bg-gray-900">1</div>
      <div class="w-full border border-gray-500 rounded-md bg-gray-900">1</div>
    </div>
    <div class="col-start-3 col-span-1 bg-green-500">Node Header</div>
    <div class="col-start-4 col-span-1 bg-gray-500">Node Header</div>
    <div class="col-start-5 col-span-1 bg-blue-500">Node Header</div>
    <div class="col-start-6 col-span-1 bg-purple-500">Node Header</div>
  </div>
</template>
<script>
export default {
  name: "NodeHeader",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
