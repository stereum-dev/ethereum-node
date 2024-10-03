<template>
  <div class="p2pBarCont">
    <div class="titleVal">
      <span>{{ props.clientName }}</span>
    </div>
    <div class="p2pVal">
      <div class="p2pVal_value" :style="{ width: props.clientVal + '%' }"></div>
    </div>
    <div class="valNo">
      <span>{{ props.clientNum }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  clientName: {
    type: String,
    required: true,
  },
  clientVal: {
    type: Number,
    required: true,
  },
  clientNum: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.p2pBarCont {
  width: 95%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 40%;
}

.titleVal {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 40%;
  height: 100%;
  font-size: 42%;
  font-weight: 600;
  color: #c1c1c1;
}

.p2pVal {
  width: 60%;
  height: 80%;
  margin-right: 5px;
  background: #33393e;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 1px 1px 11px 1px #1f1f1f;
}

.p2pVal_value {
  background: #568d50;
  height: 98%;
}

.valNo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  font-weight: 800;
  width: 12%;
  height: 100%;
  color: #c1c1c1;
}
</style>
