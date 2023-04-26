<template>
  <div class="syncRow">
    <div class="plugin-name">
      <div class="serviceIcon">
        <img :src="client.icon" alt="icon" />
      </div>
      <div class="serviceBox">
        <span>{{ client.name }}</span>
        <span>{{ client.displayCategory }}</span>
      </div>
    </div>
    <carousel ref="carousel" v-model="currentSlide" :items-to-show="1" :wrap-around="true" :transition="500">
      <slide v-for="(item, index) in syncType" :key="index">
        <div class="syncBox">
          <div v-if="item.name === 'genesis'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'recommended'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="inputBox">
              <input
                v-model="checkPointSync"
                type="text"
                placeholder="https://example.cc/"
                class="placeholder:text-gray-500"
              />
            </div>
          </div>
          <!-- <div v-else-if="item.type === 'custom source'" class="syncContent">
            <div class="commingSoon">Coming soon...</div>
            <span>{{ item.name }}</span>
            <span>{{ item.type }}</span>
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="inputBox_select" @click="dropdown = true">
              <div class="select">
                {{ selectedItem }}
                <div class="dropParent" v-if="dropdown">
                  <div class="dropRow">the first</div>
                  <div class="dropRow">second one</div>
                  <div class="dropRow">third one</div>
                </div>
              </div>
              <img src="/img/icon/arrows/left-arrow.png" alt="icon" />
            </div>
          </div> -->
        </div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    client: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      dropdown: true,
      selectedItem: " - SELECT A SOURCE -",
      currentSlide: 0,
    };
  },

  computed: {
    ...mapWritableState(useClickInstall, {
      syncType: "syncType",
      checkPointSync: "checkPointSync",
      btnActive: "btnActive",
    }),
  },
  watch: {
    currentSlide: function (val) {
      if (this.$route.path === "importingSyncing")
        if (val === 1 && this.checkPointSync === "") {
          console.log(val);
          this.btnActive = false;
        } else {
          console.log(val);
          this.btnActive = true;
        }
    },
  },
};
</script>

<style scope>
.syncRow {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.plugin-name {
  width: 25%;
  height: 80%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name .serviceIcon {
  width: 40%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.plugin-name .serviceIcon img {
  width: 80%;
}
.carousel {
  width: 72%;
  height: 100%;
}

.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel__slide {
  padding: 5px 0;
}

.carousel__prev {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel__next {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel button {
  width: 20px;
}
.carousel button .carousel__icon {
  width: 30px;
  height: 30px;
  color: #fff;
}

.plugin-name .serviceBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.plugin-name .serviceBox span:first-child {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}
.plugin-name .serviceBox span:last-child {
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}
.carouselBox {
  width: 90%;
  height: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.syncBox {
  width: 85%;
  height: 100%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncBox .syncContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncBox .syncContent .commingSoon {
  width: 100%;
  height: 30px;
  background-color: black;
  opacity: 0.5;
  color: gray;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: 600;
}
.syncContent .syncText {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 5px;
}

.syncContent .syncText span:first-child {
  width: 100%;
  height: max-content;
  color: #acaeae;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  padding: 2px;
}
.syncContent .syncText span:last-child {
  height: max-content;
  width: 100%;
  color: #4d8384;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: left;
  padding: 2px;
}

.syncContent .inputBox {
  width: 75%;
  height: 100%;
  border-radius: 10px;
  background-color: #1e2226;
  display: flex;
  justify-content: center;
  align-items: center;
}
.syncContent .inputBox_select {
  width: 60%;
  height: 100%;
  border-radius: 5px;
  background-color: #1e2226;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
}

.inputBox_select img {
  width: 20px;
  transform: rotate(-90deg);
  margin-right: 10px;
}

.syncContent .inputBox_select .select {
  width: 86%;
  height: 100%;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 0.8rem;
  font-weight: 400;
  padding: 5px;
  padding-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncContent .inputBox_select .select .dropParent {
  background-color: #192128;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 207px;
  height: 130px;
  z-index: 1000;
}
.dropParent .dropRow {
  width: 100%;
  height: 40px;
  margin-top: 5px;
  color: #d5d5d5;
  background-color: #c12f2f;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
}

.inputBox input {
  width: 100%;
  height: 100%;
  border: 3px solid #23272c;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 0.6rem;
  font-weight: 400;
  text-align: left;
  padding: 5px;
  padding-left: 5px;
}
.sync-header {
  width: 100%;
  height: 34%;
  border: 1px solid #707070;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #1a5443;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.sync-header .syncContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
  background-color: #33393e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncContent span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.syncContent img {
  width: 5%;
  height: 50%;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content span {
  font-size: 0.5rem;
  font-weight: 400;
  color: #aaaaaa;
}
.content .inputBox {
  width: 96%;
  height: 74%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  padding-bottom: 3px;
}
</style>
