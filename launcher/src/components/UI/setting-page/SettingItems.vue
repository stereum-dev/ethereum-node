<template>
  <div class="setting-items_parent" :style="itemStyle()">
    <div class="setting-items_title">
      <span>{{ title }}</span>
    </div>
    <language-setting v-if="isLang"></language-setting>
    <div
      class="setting-items_btn"
      v-else
      @click="customizeSetting"
      :style="color()"
    >
      <span>{{ btnValue }}</span>
    </div>
  </div>
</template>
<script>
import LanguageSetting from "./LanguageSetting.vue";
export default {
  components: { LanguageSetting },
  props: {
    title: {
      type: String,
      required: true,
    },
    btnValue: {
      type: String,
      required: false,
    },
    isColor: {
      type: String,
      required: true,
    },
    isLang: {
      type: String,
      required: false,
      default: false,
    },
    itemType: {
      type: String,
      required: true,
    },
  },
  emits: ["customize-setting"],
  data() {
    return {
      colorStyle: this.isColor,
      heightItem: this.itemType,
    };
  },
  computed: {
    grey() {
      return { backgroundColor: "#787575", borderRadius: "20px" };
    },
    red() {
      return { backgroundColor: "#EB5353" };
    },
    light() {
      return { backgroundColor: "#FFFFFF" };
    },
    green() {
      return { backgroundColor: "#316464" };
    },
    generalStyle() {
      return { height: "40%" };
    },
    updateStyle() {
      return { height: "20%" };
    },
  },
  methods: {
    color() {
      if (this.colorStyle === "alpha") {
        return this.grey;
      } else if (this.colorStyle === "off") {
        return this.red;
      } else if (this.colorStyle === "manual") {
        return this.light;
      } else if (this.colorStyle === "open") {
        return this.green;
      }
    },
    itemStyle() {
      if (this.heightItem === "general") {
        return this.generalStyle;
      } else if (this.heightItem === "update") {
        return this.updateStyle;
      }
    },
    customizeSetting() {
      this.$emit("customize-setting");
    },
  },
};
</script>
<style scoped>
.setting-items_parent {
  width: 95%;
  display: flex;
  color: #eee;
  justify-content: space-between;
  align-items: center;
  background: #787575;
  margin: 0.7% 0;
  padding: 0.5%;
  border-radius: 20px;
}
.setting-items_title {
  width: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 115%;
  font-weight: 600;
}
.setting-items_title span {
  margin: 0 5%;
}
.setting-items_btn {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 500;
  border: 1.5px solid #30353a;
  cursor: pointer;
  margin: 0 2%;
  height: 95%;
  color: #000;
}
.setting-items_btn:hover,
setting-items_btn:focus {
  font-weight: 700;
  border: 1.5px solid #eee;
}
</style>
