<template>
  <div class="relative">
    <div
      v-for="prop in getPropToConnect"
      v-show="prop === 'topChain'"
      :key="prop"
      class="absolute top-0 left-1/2 w-0.5 h-2 bg-gray-500 transform -translate-x-1/2"
    ></div>
    <div
      v-for="prop in getPropToConnect"
      v-show="prop === 'rightChain'"
      :key="prop"
      class="absolute top-1/2 right-0 h-0.5 w-2 bg-gray-500 transform translate-y-1/2"
    ></div>
    <slot></slot>
    <div
      v-for="prop in getPropToConnect"
      v-show="prop === 'bottomChain'"
      :key="prop"
      class="absolute bottom-0 left-1/2 w-0.5 h-2 bg-gray-500 transform -translate-x-1/2"
    ></div>
    <div
      v-for="prop in getPropToConnect"
      v-show="prop === 'leftChain'"
      :key="prop"
      class="absolute top-1/2 left-0 h-0.5 w-2 bg-gray-500 transform translate-y-1/2"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    topChain: { type: Boolean, default: false },
    rightChain: { type: Boolean, default: false },
    bottomChain: { type: Boolean, default: false },
    leftChain: { type: Boolean, default: false },
  },
  computed: {
    getPropToConnect() {
      const propsToConnect = [];

      if (this.topChain) propsToConnect.push("topChain");
      if (this.rightChain) propsToConnect.push("rightChain");
      if (this.bottomChain) propsToConnect.push("bottomChain");
      if (this.leftChain) propsToConnect.push("leftChain");

      return propsToConnect;
    },
  },
};
</script>

<style>
/* Add any custom styling here */
</style>
