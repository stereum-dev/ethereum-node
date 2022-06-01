<template>
  <div class="links-box">
    <div class="services" ref="service">
      <div class="service-icon" v-for="(service, idx) in runningServices" :key="idx">
        <a :href="service.linkUrl" target="_blank">
          <img v-show="isImgExists" :src="service.icon" alt="service-icon" />
        </a>
      </div>
    </div>
    <div class="arrow-box">
      <div class="right-arrow left-paddle paddle" @click="scrollRight">
        <img alt="update-icon" src="/img/icon/header-icons/right.png" />
      </div>
      <div class="left-arrow" @click="scrollLeft">
        <img alt="update-icon" src="/img/icon/header-icons/left.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isServiceAvailable: true,
      isImgExists: true,
      service: null,
      scrollAmount: 0,
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      services: "getServiceIcons",
      runningServices: "getRunningServices",
    }),
  },
  methods: {
    checkImgExists() {
      this.services.forEach((item) => {
        if (item.icon.length > 0) {
          this.isImgExists = true;
        }
      });
    },
    scrollLeft() {
      let position = this.$refs.services;
      position.scrollLeft += 150;
    },
    scrollRight() {
      let position = this.$refs.services;
      position.scrollLeft -= 150;
    },
  },
};
</script>
<style scoped>
.links-box {
  width: max-content;
  max-width: 250px;
  height: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.arrow-box {
  width: 20px;
  height: 90%;
  padding: 0 3px;
  border-left: 2px solid #a5a5a5;
  border-right: 2px solid #a5a5a5;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.right-arrow {
  width: 90%;
  height: 40%;
  background-color: #336666;
  box-shadow: 0 1px 3px 1px rgb(20, 53, 44);
  border: 1px solid #a5a5a5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 5px;
  cursor: pointer;
}
.left-arrow {
  width: 90%;
  height: 40%;
  background-color: #336666;
  box-shadow: 0 1px 3px 1px rgb(20, 53, 44);
  border: 1px solid #a5a5a5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 5px;
  cursor: pointer;
}
.left-arrow:hover,
.right-arrow:hover {
  background-color: rgb(28, 59, 51);
}
.left-arrow:active,
.right-arrow:active {
  border: 1px solid #616161;
  background-color: rgb(28, 59, 51);
  box-shadow: none;
}
.arrow-box img {
  width: 70%;
}
.services {
  width: max-content;
  max-width: 213px;
  height: 90%;
  border-left: 2px solid #a5a5a5;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.services::-webkit-scrollbar {
  height: 1px;
}
.service-icon {
  width: 35px;
  height: 35px;
  border: 1px solid #a5a5a5;
  box-shadow: 0 1px 5px 1px rgb(22, 42, 37);
  border-radius: 5px;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-icon:hover {
  border: 1px solid #7ed6fc;
  box-shadow: none;
}
.service-icon a {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-icon img {
  width: 35px;
  height: 35px;
}
</style>
