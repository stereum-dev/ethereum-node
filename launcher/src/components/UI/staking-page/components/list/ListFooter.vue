<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-12 row-end-13 grid grid-cols-12 grid-rows-1 relative -bottom-5"
  >
    <div class="col-start-2 col-span-1 flex justify-center items-center p-1">
      <img
        class="w-7 h-7 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-black shadow-black cursor-pointer active:scale-100 transition-all duration-150 rounded-full"
        src="/img/icon/the-staking/group.png"
        alt="Group Icon"
      />
    </div>
    <div class="col-start-3 col-span-1 flex justify-center items-center p-1">
      <img
        class="w-7 h-7 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-black shadow-black cursor-pointer active:scale-100 transition-all duration-150 rounded-full"
        src="/img/icon/the-staking/search.png"
        alt="Insert Icon"
      />
    </div>
    <div class="col-start-4 col-end-11 row-start-1 flex justify-center items-center p-1">
      <InsertPanel v-if="isInsertPanelActive" />
      <ValidatorPanel v-if="isValidatorPanelActive" />
      <PasswordPanel v-if="isPasswordPanelActive" />
      <SearchPanel v-if="isSearchPanelActive" />
      <GrafitiPanel v-if="isGrafitiPanelActive" />
    </div>
  </div>
</template>
<script setup>
import InsertPanel from "./panels/InsertPanel.vue";
import ValidatorPanel from "./panels/ValidatorPanel.vue";
import PasswordPanel from "./panels/PasswordPanel.vue";
import SearchPanel from "./panels/SearchPanel.vue";
import GrafitiPanel from "./panels/GrafitiPanel.vue";
import { ref } from "vue";

const isInsertPanelActive = ref(false);
const isValidatorPanelActive = ref(true);
const isPasswordPanelActive = ref(false);
const isSearchPanelActive = ref(false);
const isGrafitiPanelActive = ref(false);
</script>
