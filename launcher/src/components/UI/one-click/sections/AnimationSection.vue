<template>
  <div
    class="w-screen h-screen colstart-1 col-span-full row-start-1 row-span-full flex flex-col justify-evenly items-center"
  >
    <div class="w-full h-full flex justify-center items-center">
      <div class="anim__content__box">
        <div class="anim__img__content">
          <img v-for="(img, index) in images" :key="index" :src="img" :class="imgClass(img)" alt="Animation" />

          <img v-if="cilentIconActive" :src="executionClientIcon" class="execution__icon_big" alt="icon" />
          <img v-if="!cilentIconActive" :src="executionClientIcon" class="animate__flip execution__icon" alt="icon" />

          <img v-if="!cilentIconActive" :src="consensusClientIcon" class="consensus__icon" alt="icon" />

          <img v-if="cilentIconActive" :src="consensusClientIcon" class="consensus__icon_big" alt="icon" />

          <img v-if="cilentIconActive" :src="bgLight" class="eyesLight" alt="icon" />
          <img v-if="cilentIconActive" :src="shadow" class="eyesLight" alt="icon" />
          <img v-if="cilentIconActive" :src="eyesLight" class="eyesLight" alt="icon" />
          <img v-if="cilentIconActive" :src="lightening" class="lightening" alt="icon" />
        </div>
      </div>
    </div>

    <div class="wrapper w-screen h-screen absolute inset-0 z-50 flex justify-center items-center">
      <div class="absolute bottom-50 inset-x-0">
        <img src="/img/icon/stereum-logo/stereum_logo_extern.png" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img src="/img/icon/stereum-logo/logo-bw.png" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[0]" :src="bubbleIcons[0]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[1]" :src="bubbleIcons[1]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[2]" :src="bubbleIcons[2]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[3]" :src="bubbleIcons[3]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[4]" :src="bubbleIcons[4]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[5]" :src="bubbleIcons[5]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[6]" :src="bubbleIcons[6]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[7]" :src="bubbleIcons[7]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[8]" :src="bubbleIcons[8]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[9]" :src="bubbleIcons[9]" class="dot w-full h-full" alt="Animation" />
      </div>
      <div class="absolute bottom-50 inset-x-0">
        <img v-if="bubbleIcons[10]" :src="bubbleIcons[10]" class="dot w-full h-full" alt="Animation" />
      </div>
    </div>

    <div class="absolute bottom-[3rem] inset-x-0 h-14">
      <div v-if="displayNewTask" class="message-box">
        <p class="msg-title">
          {{ displayNewTask }}
          <span class="dot-flashing"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useClickInstall } from "@/store/clickInstallation";
import ControlService from "@/store/ControlService";
import "animate.css";

const installStore = useClickInstall();

const selectedPreset = installStore.selectedPreset;

const executionClientIcon = ref("");
const consensusClientIcon = ref("");
const eyesLight = ref("/animation/installer-06.png");
const bgLight = ref("/animation/installer-03.png");
const shadow = ref("/animation/installer-04.png");
const lightening = ref("/animation/installer-05.png");
const bubbleIcons = ref([]);

const images = ref([]);
const displayNewTask = ref("");
const cilentIconActive = ref(false);
let polling = null;
let refresh = null;

const installerImages = ["installer-01.png", "installer-02.png"];

//Lifecycle Hooks
onMounted(() => {
  getBubbleIcons();
  selectedPreset.includedPlugins.forEach(async (plugin) => {
    if (plugin.category === "execution") {
      executionClientIcon.value = plugin.icon;
    } else if (plugin.category === "consensus") {
      consensusClientIcon.value = plugin.icon;
    }
    await displayImages();
  });

  polling = setInterval(ControlService.updateTasks, 2000);
  refresh = setInterval(getTasks, 5000);
});

onUnmounted(() => {
  clearInterval(polling);
  clearInterval(refresh);
  clearInterval(intervalId);
});

//Methods

const getBubbleIcons = async () => {
  installStore.selectedPreset.includedPlugins.forEach((plugin) => {
    bubbleIcons.value.push(plugin.icon);
  });
};

const addImage = (image) => {
  images.value.push(`/animation/${image}`);
};

const imgClass = (img) => ({
  execution__icon: img === executionClientIcon.value,
  consensus__icon: img === consensusClientIcon.value,
  eyesLight: img === eyesLight.value,
  lightening: img === lightening.value,
});

const displayImages = async () => {
  for (const img of installerImages) {
    addImage(img);
    if (img === "installer-05.png" || img === "installer-06.png") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

const getTasks = async () => {
  const freshTasks = await ControlService.getTasks();
  try {
    displayNewTask.value = freshTasks.at(-1).name;
  } catch (e) {}
};

const intervalId = setInterval(() => {
  if (executionClientIcon.value) {
    cilentIconActive.value = !cilentIconActive.value;
  }
}, 1000);
</script>

<style scoped>
.anim {
  grid-column: 1/25;
  grid-row: 1/13;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);

  position: absolute;
}

.anim__content {
  grid-column: 1/6;
  grid-row: 1/7;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  animation-name: anim1;
  animation-duration: 500ms;
  z-index: 0;
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
.execution__icon {
  width: 148px !important;
  height: 148px !important;
  position: absolute !important;
  top: 30% !important;
  left: 28.8% !important;
  animation-name: anim2 3s infinite !important;
}
.consensus__icon {
  width: 148px !important;
  height: 148px !important;
  position: absolute !important;
  top: 29.2% !important;
  left: 58.6% !important;
  animation-name: anim2 3s infinite !important;
}
.execution__icon_big {
  width: 148px !important;
  height: 148px !important;
  position: absolute !important;
  top: 30% !important;
  left: 28.8% !important;
  transform: scale(1.5) !important;
  animation-name: bounce 3s !important;
}
.consensus__icon_big {
  width: 148px !important;
  height: 148px !important;
  position: absolute !important;
  top: 29.2% !important;
  left: 58.6% !important;
  transform: scale(1.5) !important;
  animation-name: bounce 3s !important;
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}

.eyesLight,
.lightening {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  position: absolute !important;
  animation-name: anim2 5s !important;
  z-index: 1;
}

.blinking {
  animation: anim3 1s infinite;
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
.wrapper {
  width: 100vw;
  height: 100vh;
}

.wrapper div {
  height: 60px;
  width: 60px;
  animation: 4s linear infinite;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
div .dot {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 20%;
  right: 20%;
}
.wrapper div:nth-child(1) {
  top: 20%;
  left: 20%;
  animation: animate 8s linear infinite;
}
.wrapper div:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(3) {
  top: 40%;
  left: 40%;
  animation: animate 3s linear infinite;
}
.wrapper div:nth-child(4) {
  top: 66%;
  left: 30%;
  animation: animate 7s linear infinite;
}
.wrapper div:nth-child(5) {
  top: 90%;
  left: 10%;
  animation: animate 9s linear infinite;
}
.wrapper div:nth-child(6) {
  top: 30%;
  left: 60%;
  animation: animate 5s linear infinite;
}
.wrapper div:nth-child(7) {
  top: 70%;
  left: 20%;
  animation: animate 8s linear infinite;
}
.wrapper div:nth-child(8) {
  top: 75%;
  left: 60%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(9) {
  top: 50%;
  left: 50%;
  animation: animate 6s linear infinite;
}
.wrapper div:nth-child(10) {
  top: 45%;
  left: 20%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(11) {
  top: 10%;
  left: 90%;
  animation: animate 9s linear infinite;
}

@keyframes animate {
  0% {
    transform: scale(0) translateY(0) rotate(70deg);
  }
  100% {
    transform: scale(1.3) translateY(-100px) rotate(360deg);
  }
}
</style>