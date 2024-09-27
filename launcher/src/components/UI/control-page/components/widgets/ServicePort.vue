<template>
  <div class="service-ports-parent w-full h-full flex justify-center items-center flex-col">
    <div class="widget-name w-full h-1/5 flex justify-center items-center text-gray-200 uppercase font-semibold text-[55%]">
      SERVICE PORTS
    </div>
    <div class="widget-box w-full h-4/5 justify-start items-center flex flex-col gap-1 p-1">
      <div class="row-port w-full h-1/5 flex justify-start items-center border border-gray-400 rounded-sm pl-1 pr-1">
        <span class="w-1/2 h-full flex justify-stert items-center text-[40%] font-semibold text-gray-200 uppercase">{{
          (execClient = "NETHERMIND")
        }}</span>
        <small class="text-gray-200 uppercase text-[30%] w-1/7 h-full flex justify-center items-center">{{ execProtocol }}</small>
        <span class="bg-red w-11 h-full flex justify-end items-center text-[60%] font-semibold text-gray-200 uppercase">{{
          execPort
        }}</span>
      </div>
      <div class="row-port w-full h-1/5 flex justify-start items-center border border-gray-400 rounded-sm pl-1 pr-1">
        <span class="w-1/2 h-full flex justify-stert items-center text-[40%] font-semibold text-gray-200 uppercase">{{
          (execClient = "NETHERMIND")
        }}</span>
        <small class="text-gray-200 uppercase text-[30%] w-1/7 h-full flex justify-center items-center">{{ execProtocol }}</small>
        <span class="bg-red w-11 h-full flex justify-end items-center text-[60%] font-semibold text-gray-200 uppercase">{{
          execPort
        }}</span>
      </div>
      <div class="row-port w-full h-1/5 flex justify-start items-center border border-gray-400 rounded-sm pl-1 pr-1">
        <span class="w-1/2 h-full flex justify-stert items-center text-[40%] font-semibold text-gray-200 uppercase">{{
          (execClient = "NETHERMIND")
        }}</span>
        <small class="text-gray-200 uppercase text-[30%] w-1/7 h-full flex justify-center items-center">{{ execProtocol }}</small>
        <span class="bg-red w-11 h-full flex justify-end items-center text-[60%] font-semibold text-gray-200 uppercase">{{
          execPort
        }}</span>
      </div>
      <div class="row-port w-full h-1/5 flex justify-start items-center border border-gray-400 rounded-sm pl-1 pr-1">
        <span class="w-1/2 h-full flex justify-stert items-center text-[40%] font-semibold text-gray-200 uppercase">{{
          (execClient = "NETHERMIND")
        }}</span>
        <small class="text-gray-200 uppercase text-[30%] w-1/7 h-full flex justify-center items-center">{{ execProtocol }}</small>
        <span class="bg-red w-11 h-full flex justify-end items-center text-[60%] font-semibold text-gray-200 uppercase">{{
          execPort
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const execClient = ref("NETHERMIND"); //dummy client name
const execPort = ref("22154"); //dummy port number
const execProtocol = ref("tcp"); //dummy protocol
</script>

<style scoped></style>
