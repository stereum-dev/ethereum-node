<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
      <button
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase"
      >
        Confirm
      </button>
    </div>
    <ChangesBox />
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import ChangesBox from "../components/changes/ChangesBox";
export default {
  name: "ChangesSection",
  components: {
    ChangesBox,
  },
  props: {
    infoAralm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useNodeStore, {
      infoAlarm: "infoAlarm",
    }),
  },
  mounted() {},
  methods: {},
};
</script>
