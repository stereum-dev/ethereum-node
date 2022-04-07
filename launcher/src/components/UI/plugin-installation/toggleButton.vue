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
  height: 82%;
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
  width: 40%;
  height: 74%;
  border: 1px solid #36393d;
  left: 9%;
  bottom: 7%;
  background-color: #3183da;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: inset 1px 1px 5px rgb(164, 195, 239);
}

input:checked + .slider {
  background-color: #c2ded0;
}
input:checked + .slider:before {
  background-color: #206d4a;
  border: 1px solid #353a38;
  box-shadow: inset 1px 1px 8px #6ad0a2;
}
input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(16px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
