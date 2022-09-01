<template>
  <div class="passwordBox">
    <div class="enter-password" @click="$emit('confirmPassword')">
      <input v-model="enteredPassword" v-if="activePassword" type="password" />
      <button
        @keyup.enter="$emit('importKey', this.enteredPassword)"
        @click="$emit('importKey', this.enteredPassword)"
        v-if="activePassword"
      >
        CONFIRM
      </button>
      <span v-else>ENTER PASSWORD & IMPORT</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["activePassword", "password"],
  data() {
    return {
      enteredPassword: "",
    };
  },
};
</script>
<style scoped>
.passwordBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.passwordBox .enter-password {
  width: 100%;
  height: 80%;
  background-color: #336666;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.passwordBox .enter-password span {
  color: rgb(227, 227, 227);
  font-size: 1rem;
  font-weight: 600;
}

.passwordBox .enter-password input {
  width: 80%;
  height: 80%;
  border-radius: 35px 0 0 35px;
  background-color: #002828;
  outline-style: none;
  padding: 0;
  padding-left: 10px;
  position: absolute;
  left: 5px;
  font-size: 1rem;
  color: #d5d5d5;
  font-weight: 500;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.passwordBox .enter-password button {
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

.passwordBox .enter-password button:hover {
  background-color: #23272a;
  box-shadow: none;
}

.passwordBox .enter-password button:active {
  background-color: #181b1d;
  box-shadow: inset 1px 1px 3px #070708;
}
</style>
