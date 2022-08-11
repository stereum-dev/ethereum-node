<template>
  <div class="langSettingParent" @click="languageBox">
    <div class="icoLang">
      <img :src="flag" alt="" />
    </div>
    <div class="langTtl">
      <span>{{ lang }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["flag", "lang"],
  emit: ["language-box"],
  data() {},
  methods: {
    languageBox() {
      this.$emit("language-box");
    },
  },
};
</script>
<style scoped>
.langSettingParent {
  width: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  font-weight: 500;
  border: 1.5px solid #30353a;
  cursor: pointer;
  margin: 0 2%;
  height: 95%;
  color: #000;
  background-color: #eee;
}

.icoLang {
  width: 15%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icoLang img {
  width: 50%;
}

.langTtl {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
}
.langTtl:hover,
.langTtl:active {
  font-weight: 800;
}
</style>
