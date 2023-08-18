<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <div class="w-full h-[30px] flex justify-center items-center">
      <span class="text-md font-normal text-gray-200 uppercase">Service</span>
    </div>
    <ServiceBody />
  </div>
</template>
<script>
import ServiceBody from "../components/service/ServiceBody.vue";

export default {
  name: "ServiceSection",
  components: {
    ServiceBody,
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
