<template>
  <div class="searchOptions" @mousedown.prevent.stop>
    <img
      v-if="isPubkeyVisible"
      class="pubkeyView"
      src="../../../../public/img/icon/the-staking/view2.png"
      alt="icon"
      @click="togglePubkeyView"
    />
    <img
      v-if="!isPubkeyVisible"
      class="pubkeyView"
      src="../../../../public/img/icon/the-staking/unview2.png"
      alt="icon"
      @click="$emit('togglePubkey')"
    />
    <img class="folder" src="../../../../public/img/icon/the-staking/newfolder-icon.png" alt="icon" />
    <img
      @click="$emit('openSearch')"
      class="filter"
      src="../../../../public/img/icon/the-staking/staking-filter.png"
      alt="icon"
    />
  </div>
</template>
<script>
export default {
  props: {
    isPubkeyVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hover: false,
    };
  },
};
</script>
<style scoped>
.fixStyle {
  top: 65%;
}
.searchOptions {
  position: relative;
  grid-column: 1/3;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.searchOptions .pubkeyView {
  margin-top: 50px;
  width: 24px;
  border: 1px solid rgb(149, 149, 149);
  border-radius: 100%;
  cursor: pointer;
}
.searchOptions .folder,
.searchOptions .filter {
  margin-top: 50px;
  width: 23px;
  cursor: pointer;
}

.searchOptions .folder:hover,
.searchOptions .filter:hover,
.searchOptions .pubkeyView:hover {
 transform: scale(1.1 );
}
</style>
