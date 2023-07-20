<template>
  <div
    class="relative w-full max-h-[125px] flex justify-center items-center p-2 rounded-md border border-gray-700 bg-[#212629] shadow-md"
  >
    <div class="grid grid-cols-3 max-w-md overflow-hidden rounded-lg shadow-lg">
      <div class="flex flex-col justify-between items-center">
        <div
          class="w-[125px] absolute top-[-10px] left-0 rounded-r-full bg-[#264744] pl-2 z-10 flex justify-between items-center text-white text-xs"
        >
          {{ client.category }}
          <span v-if="client.category !== 'validator'">client</span>
          <span class="w-5 h-[24px] bg-green-500 border border-green-500 rounded-r-full"></span>
        </div>
        <img class="w-2/3 mt-5 bg-cover" :src="client.icon" alt="icon" />
        <p class="text-md font-semibold text-gray-800">{{ client.name }}</p>
      </div>

      <div class="col-span-2 grid grid-cols-2">
        <div class="flex flex-col justify-center items-center max-w-xs space-y-2">
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-3 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/turn_on.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-3 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/turn_on.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-3 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/turn_on.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
        </div>

        <div class="flex flex-col justify-center items-center w-full max-w-xs space-y-2">
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-1 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/start-stop.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-1 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/start-stop.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
          <button
            class="max-h-[30px] flex items-center text-gray-300 justify-center gap-x-1 text-sm sm:text-base bg-gray-900 border-gray-700 hover:bg-gray-700 rounded-md duration-300 transition-colors border px-2 py-1"
          >
            <img src="/img/icon/node-icons/start-stop.png" alt="button icon" class="w-4" />
            <span>Turn on </span>
          </button>
        </div>
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
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
