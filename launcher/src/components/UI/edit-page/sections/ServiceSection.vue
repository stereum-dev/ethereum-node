<template>
    <div class="w-full h-full flex flex-col justify-between items-center pt-1">
      <div class="w-full flex flex-col justify-between items-center px-4 rounded-t-lg">
        <span class="text-md font-semibold text-gray-200 uppercase">Services</span>
        <div class="w-full flex justify-between items-center px-1 overflow-hidden">
          <img v-for="el in getServices" :key="el.name" class="w-5" :src="el.sIcon" alt="icon" />
        </div>
      </div>
  
      <ServiceBody />
    </div>
  </template>
  <script>
  import ServiceBody from "../components/service/ServiceBody.vue";
  import { mapState } from "pinia";
  import { useServices } from "@/store/services";
  
  export default {
    name: "ServiceSection",
    components: {
      ServiceBody,
    },
    props: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(useServices, {
        installedServices: "installedServices",
      }),
      getServices() {
        return this.installedServices.filter((el) => el.category === "service");
      },
    },
    mounted() {},
    methods: {},
  };
  </script>
  