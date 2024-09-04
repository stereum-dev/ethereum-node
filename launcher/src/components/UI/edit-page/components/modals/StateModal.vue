<template>
  <div
    id="modal-id"
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0" @click="$emit('closeWindow')"></div>
    <div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-[35px] shadow-lg bg-white border-4 border-gray-400">
      <!--content-->
      <div class="">
        <!--body-->
        <div class="text-center p-5 flex-auto justify-center">
          <img
            class="w-10 -m-1 flex items-center text-red-500 mx-auto"
            :src="mainIcon ? '/img/icon/node-page-icons/turn-on.png' : '/img/icon/node-page-icons/turn-off.png'"
            alt="restart warning"
          />
          <div v-if="!mainIcon" class="text-md font-bold py-4">
            <span>{{ $t("confirmModal.off") }} </span>
          </div>
          <div v-if="!mainIcon" class="text-md font-bold py-4">
            <span class="uppercase">{{ $t("confirmModal.messageOff") }} </span>
          </div>
          <div v-if="mainIcon" class="text-md font-bold py-4">
            <span>{{ $t("confirmModal.on") }} </span>
          </div>
          <div v-if="mainIcon" class="text-md font-bold py-4">
            <span class="uppercase">{{ $t("confirmModal.messageOn") }} </span>
          </div>
        </div>
        <!--footer-->
        <div class="p-3 mt-2 text-center space-y-4">
          <button
            v-if="mainIcon"
            class="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
            @click="$emit('turnOn')"
          >
            {{ $t("editModals.trnOn") }}
          </button>
          <button
            v-else
            class="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
            @click="$emit('turnOff')"
          >
            {{ $t("editModals.trnOff") }}
          </button>
          <span class="text-xs flex justify-center items-center text-red-500 mx-auto">{{ $t("editModals.clckOutside") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    mainIcon: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
