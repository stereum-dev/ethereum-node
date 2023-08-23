<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0" @click="$emit('closeWindow')"></div>
    <div
      class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-[35px] shadow-lg bg-white border-4 border-gray-400"
    >
      <div class="">
        <div class="text-center p-5 flex-auto justify-center">
          <img class="w-10 -m-1 flex items-center text-red-500 mx-auto" :src="icon" :alt="altText" />
          <div class="text-md font-bold py-4">
            <span>{{ mainText }}</span>
          </div>
          <div class="text-md font-bold py-4">
            <span class="uppercase">{{ messageText }}</span>
          </div>
        </div>
        <div class="p-3 mt-2 text-center space-y-4">
          <button
            class="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
            @click="$emit('confirmAction')"
          >
            {{ confirmText }}
          </button>
          <span class="text-xs flex justify-center items-center text-red-500 mx-auto">{{ clickOutsideText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    altText: String,
    mainText: String,
    messageText: String,
    confirmText: String,
    clickOutsideText: String,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
