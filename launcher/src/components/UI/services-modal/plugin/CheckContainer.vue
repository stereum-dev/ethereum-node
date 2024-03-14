<template>
  <div class="check-parent">
    <div class="check-parent_title">
      {{ title }}
    </div>
    <div class="check-parent_part">
      <div :key="isChecked" class="customizedCheckBox" :style="checkboxStyle" @click="toggleCheckbox">
        <span v-if="isChecked">✓</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    checked: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isChecked: this.checked,
    };
  },
  computed: {
    checkboxStyle() {
      return {
        backgroundColor: this.isChecked ? "rgba(0, 128, 0, 0.4)" : "rgba(255, 0, 0, 0.4)",
        border: "1px solid",
        borderColor: this.isChecked ? "greenyellow" : "red",
        cursor: "pointer",
      };
    },
  },
  watch: {
    reset(val) {
      if (val === "green") {
        this.isChecked = true;
      } else if (val === "red") {
        this.isChecked = false;
      }
    },
  },

  methods: {
    toggleCheckbox() {
      this.isChecked = !this.isChecked;
      this.$emit("update", this.isChecked);
    },
  },
};
</script>

<style scoped>
.check-parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.check-parent_title {
  color: #dbdbdb;
  font-size: 0.65rem;
  font-weight: 400;
  margin-left: 10px;
  text-transform: uppercase;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.check-parent_part {
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customizedCheckBox {
  width: 50%;
  height: 70%;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.customizedCheckBox span {
  font-size: 2rem;
  color: greenyellow;
}
</style>
