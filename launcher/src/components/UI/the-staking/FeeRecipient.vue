<template>
  <div class="feeBox">
    <div class="enter-fee" @click="$emit('enterFee')">
      <input
        placeholder="$t('feeRecipient.textPlaceHolder')"
        v-model="password"
        v-if="activeFee"
        type="text"
      />
      <button
        @keyup.enter="$emit('confirmBtn')"
        @click="$emit('confirmBtn')"
        v-if="activeFee"
      >
        {{ $t("exitMultipleValidator.confirm") }}
      </button>
      <span v-else>{{ $t("feeRecipient.setBlock") }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["activeFee"],
};
</script>
<style scoped>
.feeBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feeBox .enter-fee {
  width: 100%;
  height: 80%;
  /* border: 1px solid #bfbfbf; */
  background-color: #266ad1;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.feeBox .enter-fee span {
  color: rgb(227, 227, 227);
  font-size: 1rem;
  font-weight: 600;
}

.feeBox .enter-fee input {
  width: 80%;
  height: 80%;
  border: 1px solid #96d6f3;
  border-radius: 35px 0 0 35px;
  background-color: #7cbbf6;
  outline-style: none;
  padding: 0;
  padding-left: 10px;
  position: absolute;
  left: 5px;
  font-size: 0.7rem;
  color: rgb(55, 55, 59);
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.feeBox .enter-fee button {
  width: 20%;
  height: 100%;
  border: none;
  padding: 7px;
  border-radius: 0 35px 35px 0;
  background-color: #3f4750;
  outline-style: none;
  position: absolute;
  right: 0;
  font-size: 0.8rem;
  color: #e0e0e0;
  font-weight: 600;
  cursor: pointer;
}

.feeBox .enter-fee button:hover {
  transition-duration: 100ms;
  background-color: #252f36;
  color: #9accfb;
  font-size: 0.85rem;
}

.feeBox .enter-fee button:active {
  transition-duration: 100ms;
  background-color: #3f4750;
  font-size: 0.8rem;
}
</style>
