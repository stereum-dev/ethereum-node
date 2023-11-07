<template>
  <div class="searchOptions space-x-5" @mousedown.prevent.stop>
    <img
      v-if="isPubkeyVisible"
      class="pubkeyView"
      src="/img/icon/the-staking/view2.png"
      alt="icon"
      @click="$emit('togglePubkey')"
      @mouseenter="cursorLocation = `${switchShow}`"
      @mouseleave="cursorLocation = ''"
    />
    <img
      v-if="!isPubkeyVisible"
      class="pubkeyView"
      src="/img/icon/the-staking/unview2.png"
      alt="icon"
      @click="$emit('togglePubkey')"
      @mouseenter="cursorLocation = `${switchShow}`"
      @mouseleave="cursorLocation = ''"
    />

    <img
      class="filter"
      src="/img/icon/the-staking/staking-filter.png"
      alt="icon"
      @click="$emit('openSearch')"
      @mouseenter="cursorLocation = `${searchFilter}`"
      @mouseleave="cursorLocation = ''"
    />
    <!-- <img
      class="folder pointer-events-none opacity-50"
      src="/img/icon/the-staking/newfolder-icon.png"
      alt="icon"
      @mouseenter="cursorLocation = `${group}`"
      @mouseleave="cursorLocation = ''"
    /> -->
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
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
      switchShow: this.$t("searchOption.switchShow"),
      group: this.$t("searchOption.group"),
      searchFilter: this.$t("searchOption.searchFilter"),
    };
  },
  computed: {
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },
};
</script>
<style scoped>
.fixStyle {
  top: 65%;
}
.searchOptions {
  position: relative;
  grid-column: 2/4;
  grid-row: 3/4;
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-end;
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
  transform: scale(1.1);
}
</style>
