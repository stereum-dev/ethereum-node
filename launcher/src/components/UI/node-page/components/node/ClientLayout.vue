<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div
      class="w-[150px] h-5 absolute top-[-18px] -left-[1px] rounded-r-full bg-[#264744] pl-2 flex justify-between items-center text-white text-xs capitalize"
    >
      {{ client.category }}
      <span v-if="client.category !== 'validator'" class="-ml-4">client</span>
      <span class="w-5 h-5 bg-green-500 border border-green-500 rounded-r-full"></span>
    </div>
    <div class="flex flex-col gap-2">
      <img class="w-10" :src="client.sIcon" alt="icon" />
      <div v-if="client.category !== 'validator'" class="h-1/3 flex justify-evenly items-center">
        <img class="w-4" src="/img/icon/arrows/SynchronisationIconActive.gif" alt="icon" />
        <span class="text-xs text-gray-100">99%</span>
      </div>
      <div v-else class="h-1/3 flex justify-center items-center">
        <img class="w-4" src="/img/icon/node-icons/key.png" alt="icon" />
      </div>
    </div>
  </div>
</template>
<script>
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

  mounted() {},
  methods: {},
};
</script>
