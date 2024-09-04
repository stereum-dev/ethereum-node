<template>
  <div class="w-screen h-screen colstart-1 col-span-full row-start-1 row-span-full flex flex-col justify-evenly items-center">
    <div class="w-full h-full flex justify-center items-center">
      <div class="anim__content__box">
        <div class="anim__img__content">
          <img class="z-[2]" src="/animation/custom/custom-1.png" alt="Anim Image " />
          <img v-for="(img, idx) in images" :key="img" :src="img" :class="`z-[${idx}]`" alt="Animation" />
        </div>
      </div>
    </div>

    <div class="absolute bottom-[3rem] inset-x-0 h-14 z-50">
      <div v-if="displayNewTask" class="message-box">
        <p class="msg-title">
          {{ displayNewTask }}
          <span class="dot-flashing"></span>
        </p>
      </div>
      <div v-else class="message-box">
        <p class="msg-title">
          {{ $t("customAnim.processing") }}
          <span class="dot-flashing"></span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      customAnims: ["/animation/custom/custom-2.png", "/animation/custom/custom-3.png", "/animation/custom/custom-4.png"],
      images: [],
      currentIndex: null,
      Tasks: [],
      displayNewTask: "",
    };
  },
  mounted() {
    this.displayImages();
    this.getTasks();
    this.polling = setInterval(ControlService.updateTasks, 2000);
    this.refresh = setInterval(this.getTasks, 5000); //refresh data
  },
  unmounted() {
    this.images = [];
  },

  methods: {
    displayImages() {
      const initialDelay = 4000;
      const cycleDuration = 2000;
      const imageDisplayDuration = 1000;

      const addImages = () => {
        this.images.push(this.customAnims[0], this.customAnims[1], this.customAnims[2]);
      };

      const clearImages = () => {
        this.images = [];
      };

      // Initial animation start
      setTimeout(() => {
        addImages();
        setTimeout(() => {
          clearImages();
        }, imageDisplayDuration);
      }, initialDelay);

      // Repeating animation cycles
      setInterval(() => {
        addImages();
        setTimeout(() => {
          clearImages();
        }, imageDisplayDuration);
      }, cycleDuration);
    },
    getTasks: async function () {
      const freshTasks = await ControlService.getTasks();
      this.Tasks = Array.isArray(freshTasks) ? freshTasks : this.Tasks;
      // use try/catch to avoid an error if no tasks responded for whatever reason
      try {
        this.displayNewTask = this.Tasks.at(-1).name;
      } catch (e) {}
    },
  },
};
</script>
<style scoped>
.anim__content__box {
  /* border-image: linear-gradient(98deg, blue, #ff000000) 1; */
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
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  animation-name: anim1;
  animation-duration: 500ms;
}
.anim__content__box img:first-child {
  opacity: 0.7;
}

@keyframes anim1 {
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

.taskBox {
  grid-column: 1/7;
  grid-row: 6/7;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.message-box {
  width: 500px;
  height: 50px;
  background-color: #23272b;
  border: 1px solid #464849;
  box-shadow: 0 1px 5px 1px rgb(30, 30, 30);
  border-radius: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.message-box .msg-title {
  width: 100%;
  height: 30%;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #d9dcdc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
}
.dot-flashing {
  position: relative;
  top: -2px;
  width: 5px;
  height: 5px;
  align-self: flex-end;
  margin-left: 20px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: #1068a3;
  }
  50%,
  100% {
    background-color: #eee;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
