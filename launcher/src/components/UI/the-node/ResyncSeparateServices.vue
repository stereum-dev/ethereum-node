<template>
  <div class="resync-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="resync-icon"><img src="/img/icon/plugin-menu-icons/resync.png" alt="" /></div>
      <div class="resync-message">
        <div>
          <span>by initiating resync you will delete the database of</span>
        </div>
        <div class="resync-message_nameId">
          <span>{{ item.name }} - [{{ item.config.serviceID }}}]</span>
        </div>
        <div>
          <span>choose what source will be used for resynchnorization</span>
        </div>
      </div>
      <div class="resync-box">
        <carousel
          ref="carousel"
          v-model="currentSlide"
          :items-to-show="1"
          :wrap-around="true"
          :transition="500"
          :class="{ disabled: item.category === 'execution' }"
        >
          <slide v-for="(Stype, index) in syncType" :key="index">
            <div class="syncBox">
              <div v-if="Stype.name === 'genesis'" class="syncContent">
                <div class="syncText">
                  <span>{{ Stype.name }}</span>
                  <span>{{ Stype.type }}</span>
                </div>
              </div>
              <div v-else-if="Stype.type === 'recommended' && item.category === 'consensus'" class="syncContent">
                <div class="syncText">
                  <span>{{ Stype.name }}</span>
                  <span>{{ Stype.type }}</span>
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
              <div v-else-if="Stype.type === 'custom source'" class="syncContent">
                <div class="commingSoon">Coming soon...</div>
                <!-- <span>{{ item.name }}</span>
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
            </div> -->
              </div>
            </div>
          </slide>

          <template v-if="item.category === 'consensus'" #addons>
            <navigation />
          </template>
        </carousel>
      </div>
      <div class="resync-confirm deactive" :class="{ active: btnActive }" @click="resync(item)">resync</div>
      <span class="clickOut">click outside to close</span>
    </div>
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
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentSlide: 0,
      btnActive: true,
      checkPointSync: "",
      serviceID: "",
    };
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      syncType: "syncType",
    }),
  },
  watch: {
    currentSlide(val) {
      if (val === 0) {
        this.checkPointSync = "";
      }
      this.btnActive = val === 0 || this.checkPointSync !== "";
    },
    checkPointSync(val) {
      this.btnActive = val !== "" || this.currentSlide === 0;
    },
  },
  methods: {
    resync(el) {
      // Patrik,you can create your function here
      this.serviceID = el.config.serviceID;

      console.log("service id is =>" + this.serviceID + "and url is =>" + this.checkPointSync);
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
.clickOut {
  font-size: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6%;
  color: red;
  position: absolute;
  bottom: 0;
}
.resync-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 300;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 202;
  cursor: default;
}
.browser-modal {
  width: 50%;
  height: 55%;
  background-color: #212122;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 70px;
  position: absolute;
  top: 24%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  cursor: default;
}

.resync-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 25%;
}
.resync-icon img {
  width: 11%;
}
.resync-message {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 30%;
  flex-direction: column;
  font-size: 80%;
  font-weight: 500;
  text-transform: uppercase;
  color: #eee;
}
.resync-message_nameId {
  font-size: 130%;
  font-weight: 800;
}
.resync-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 18%;
}
.resync-confirm {
  width: 40%;
  height: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: red;
  font-size: 100%;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: 15px;
  color: #eee;
  cursor: pointer;
}
.resync-confirm:active {
  transform: scale(0.9);
}
.deactive {
  opacity: 50%;
  pointer-events: none;
}
.active {
  opacity: 1;
  pointer-events: visible;
}
</style>
