<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div
      class="w-[150px] h-5 absolute top-[-18px] -left-[1px] rounded-r-full pl-2 flex justify-between items-center text-white text-xs capitalize bg-[#264744]"
    >
      <span> {{ client.name }}</span>

      <span class="uppercase text-xs text-yellow-400 self-end justify-self-end">{{ client.category.slice(0, 3) }}</span>
      <span :class="clientStatus"></span>
    </div>
    <div class="flex flex-col gap-2">
      <img class="w-10" :src="client.sIcon" alt="icon" />
      <div v-if="client.category !== 'validator'" class="h-1/3 flex justify-evenly items-center">
        <img class="w-4" src="/img/icon/arrows/SynchronisationIconActive.gif" alt="icon" />
        <span class="text-xs text-gray-100">99%</span>
      </div>
      <div v-else class="h-1/3 flex justify-center items-center">
        <img class="w-5" src="/img/icon/node-icons/key.png" alt="icon" />
        <span class="text-md font-semibold" :class="client.state === 'running' ? 'text-green-500' : 'text-red-600 '">{{
          getKeyNumbers
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useStakingStore } from "@/store/theStaking";

export default {
  name: "ClientsLayout",
  components: {},
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      syncItemsShow: false,
      syncIcoUnknown: true,
      syncIcoSituation: false,
      syncIcoError: false,
      syncIco: [
        {
          id: 1,
          name: "error",
          icon: "/img/icon/arrows/SynchronisationIconError.gif",
        },
        {
          id: 2,
          name: "active",
          icon: "/img/icon/arrows/SynchronisationIconActive.gif",
        },
        {
          id: 3,
          name: "synched",
          icon: "/img/icon/arrows/SynchronisationIconSynchronized.gif",
        },
        {
          id: 4,
          name: "unknown",
          icon: "/img/icon/arrows/SynchronisationIconUnknown.gif",
        },
      ],
    };
  },
  computed: {
    ...mapWritableState(useStakingStore, {
      keys: "keys",
    }),
    clientStatus() {
      if (this.client.state === "running") {
        return "w-5 h-5 bg-green-500 border border-green-500 rounded-r-full";
      } else if (this.client.state === "restarting") {
        return "w-5 h-5 bg-orange-500 border border-orange-500 rounded-r-full";
      }
      return "w-5 h-5 bg-red-600 border border-red-600 rounded-r-full";
    },
    getKeyNumbers() {
      return this.keys.length;
    },
  },
  mounted() {},
  methods: {},
};
</script>
