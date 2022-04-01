<template>
  <div class="toggle-container">
    <label class="switch">
      <input type="checkbox" @click="toggleCheckbox" />
      <div class="slider round"></div>
    </label>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkbox: false,
    };
  },
  methods: {
    toggleCheckbox() {
      this.checkbox = !this.checkbox;
      this.$emit("setCheckboxVal", this.checkbox);
    },
  },
};
</script>
<style scoped>
.toggle-container {
  width: 70%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.switch {
  width: 100%;
  height: 100%;
  position: relative;
}

.switch input {
  display: none;
}

.slider {
  height: 80%;
  margin-top: 3px;
  margin-right: 3px;
  cursor: pointer;
  background-color: rgb(169, 169, 169);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  width: 45%;
  height: 85%;
  border: 1px solid rgb(91, 90, 90);
  left: 0;
  bottom:3%;
  background-color: #2f2f2f;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: 0 1px 2px 0 rgb(33, 33, 33);
}

input:checked + .slider {
  background-color: #9ac9b1;
}
input:checked + .slider:before {
  background-color: #206d4a;
}
input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
