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
#flag {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#flag .content-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  margin: 0 auto;
  cursor: pointer;
}
.content-box span {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(200, 200, 200);
  text-transform: uppercase;
}
#flagId {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  box-shadow: 0 1px 3px 1px rgb(14, 37, 34);
}
.content-box:hover #flagId {
  transform: scale(1.1);
  transition-duration: 100ms;
}
.content-box:hover span {
  color: #27706e;
  transition-duration: 150ms;
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
</style>
