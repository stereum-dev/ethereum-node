<template>
  <div class="securBtn-parent">
    <div class="securBtn-box" @click="test">
      <img :src="stereumStatus ? '/img/icon/LOGO.png' : '/img/icon/statusOff.png'" class="main-header__brand" />
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useFooter } from "@/store/theFooter";
export default {
  data() {
    return {
      test: false,
    };
  },
  computed: {
    ...mapState(useFooter, {
      stereumStatus: "stereumStatus",
    }),
  },
  methods: {
    testM() {
      this.test = !this.test;
    },
  },
};
</script>

<style scoped>
.securBtn-parent {
  position: fixed;
  top: 0;
  left: 0;
  width: 8%;
  height: 15%;
  z-index: 50;
  cursor: pointer;
}
.securBtn-box {
  width: 100%;
  z-index: 51;
}
.securBtn-box img {
  width: 100%;
  z-index: 51;
}
.securBtn-box img:active {
  transform: scale(0.98);
}
.test-page {
  width: 100vw;
  height: 100vh;
  background-color: #472630;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 49;
  opacity: 0.5;
  display: none;
}
</style>
