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
  width: 50%;
  height: 93%;
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
  width: 80%;
  height: 80%;
  margin-top: 2px;
  margin-right: 3px;
  margin: 2px 3px;
  cursor: pointer;
  background-color: rgb(215, 215, 215);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  width: 18px;
  height: 18px;
  border: 2px solid #0686bd;
  left: 7%;
  bottom: 8.4%;
  background-color: #3183da;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #e9e9e9;
}
input:checked + .slider:before {
  width: 18px;
  height: 18px;
  border: 1px solid #157ca8;
  background-color: #488f63;
  border: 1px solid #09794c;
}

input:checked + .slider:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(15px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
