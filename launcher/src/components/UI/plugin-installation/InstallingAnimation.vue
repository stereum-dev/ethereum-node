import { mapWritableState } from 'pinia';
<template>
  <background-page>
    <div class="animContainer">
      <div class="opacity"></div>
      <div class="anim">
        <div class="anim__content shadow-md shadow-black">
          <div class="anim__content__box">
            <div>
              <img src="/animation/installerBG.png" alt="Icon" />
              <img src="/animation/installer-1.png" alt="Icon" />
              <img
                v-for="img in images"
                :key="img"
                :class="{
                  'execution__icon ': img === executionClientIcon,
                  'consensus__icon ': img === consensusClientIcon,
                }"
                :src="img"
                alt="Animation"
              />
            </div>
            <!-- <img :src="installAnimations[0]" alt="Animation" />
            <img :src="installAnimations[1]" alt="Animation" />
            <img :src="installAnimations[2]" alt="Animation" />
            <img :src="installAnimations[3]" alt="Animation" />
            <img :src="installAnimations[4]" alt="Animation" />
            <img :src="installAnimations[5]" alt="Animation" /> -->
          </div>
        </div>
      </div>
    </div>
    <TaskManager />
  </background-page>
</template>

<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import TaskManager from "../task-manager/TaskManager.vue";
export default {
  components: {
    TaskManager,
  },
  data() {
    return {
      installAnimations: [
        "/animation/installer-2.png",
        "/animation/installer-3.png",
        "/animation/installer-4.png",
        "/animation/installer-5.png",
      ],
      images: [],
      currentIndex: null,
      executionClientIcon: "",
      consensusClientIcon: "",
    };
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      selectedPreset: "selectedPreset",
    }),
  },

  mounted() {
    this.displayImages();
    this.selectedPreset.includedPlugins.forEach((plugin) => {
      if (plugin.category === "execution") {
        this.executionClientIcon = plugin.icon;
      } else if (plugin.category === "consensus") {
        this.consensusClientIcon = plugin.icon;
      }
    });
  },
  unmounted() {
    this.images = [];
  },
  methods: {
    displayImages() {
      setInterval(() => {
        setTimeout(() => {
          this.images.push(this.installAnimations[0]);
        }, 500);
        setTimeout(() => {
          this.images.push(this.installAnimations[1], this.installAnimations[2]);
        }, 700);
        setTimeout(() => {
          this.images.push(this.installAnimations[3]);
          this.images.push(this.executionClientIcon, this.consensusClientIcon);
        }, 1000);
        this.images = [];
      }, 6000);
    },

    // getIndex() {
    //   setInterval(() => {
    //     const arr = this.installAnimations;
    //     arr.forEach((el, i) => {
    //       setTimeout(() => {
    //         if (i === 1 || i === 2) {
    //           this.images.push(arr[1], arr[2]);
    //         }
    //         this.images.push(el);
    //         this.images.push(this.consensusClientIcon, this.executionClientIcon);
    //       }, 500);
    //     });
    //     console.log(this.images);
    //     this.images = [];
    //   }, 5500);
    // },
  },
};
</script>

<style scoped>
.animContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.opacity {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.6;
  z-index: 1;
}
.anim {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.anim__content {
  width: 75%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 3px solid rgb(223, 218, 218);
  border-radius: 23px;
  z-index: 10;
}
.anim__content__box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.anim__content__box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  position: absolute;
  top: 0;
  left: 0;
  animation-name: anim;
  animation-duration: 500ms;
}

@keyframes anim {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}

.execution__icon {
  width: 80px !important;
  height: 80px !important;
  position: absolute !important;
  top: 33.9% !important;
  left: 30.8% !important;
  animation-name: anim !important;
  animation-duration: 500ms !important;
  z-index: 100 !important;
  opacity: 0.5 !important;
}

.consensus__icon {
  width: 80px !important;
  height: 80px !important;
  position: absolute !important;
  top: 33% !important;
  left: 60.5% !important;
  animation-name: anim !important;
  animation-duration: 500ms !important;
  z-index: 100 !important;
  opacity: 0.5 !important;
}
</style>
