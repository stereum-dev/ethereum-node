<template>
  <div class="anim">
    <div class="anim__content">
      <div class="anim__content__box">
        <div class="anim__img__content">
          <img v-for="(img, index) in images" :key="index" :src="img" :class="imgClass(img)" alt="Animation" />

          <img v-if="cilentIconActive" :src="executionClientIcon" class="execution__icon_big" alt="icon" />
          <img v-if="!cilentIconActive" :src="executionClientIcon" class="animate__flip execution__icon" alt="icon" />

          <img v-if="!cilentIconActive" :src="consensusClientIcon" class="consensus__icon" alt="icon" />

          <img v-if="cilentIconActive" :src="consensusClientIcon" class="consensus__icon_big" alt="icon" />

          <img v-if="cilentIconActive" :src="eyesLight" class="eyesLight" alt="icon" />
          <img v-if="cilentIconActive" :src="lightening" class="lightening" alt="icon" />
        </div>
      </div>
    </div>

    <div
      class="w-full h-14 col-start-2 col-end-5 row-start-1 row-span-1 z-50 flex justify-center items-center mx-auto self-center"
    >
      <transition-group
        name="list"
        mode="out-in"
        duration="2000"
        tag="div"
        class="flex justify-evenly items-center space-x-6"
      >
        <img
          v-for="(item, index) in displayIcons"
          :key="index"
          :src="item.src"
          class="w-8 h-8 scale-100"
          alt="Animation"
          :class="cilentIconActive ? item.class : ''"
        />
      </transition-group>
    </div>

    <div class="taskBox">
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useClickInstall } from "@/store/clickInstallation";
import ControlService from "@/store/ControlService";
import "animate.css";

const installStore = useClickInstall();

const selectedPreset = installStore.selectedPreset;

const executionClientIcon = ref("");
const consensusClientIcon = ref("");
const eyesLight = ref("/animation/installer-05.png");
const lightening = ref("/animation/installer-06.png");
const images = ref([]);
const displayNewTask = ref("");
const cilentIconActive = ref(false);
const displayIcons = ref([]);
let polling = null;
let refresh = null;

const installerImages = ["installer-01.png", "installer-02.png", "installer-03.png", "installer-04.png"];

const getIcons = computed(() => {
  const plugins = selectedPreset.includedPlugins;
  return plugins.map((plugin, index) => {
    return {
      src: plugin.icon,
      class: "z-50 scale-110 transition-all ease-in-out " + `delay-${index + 10}00` + `duration-${index + 5}00`,
    };
  });
});

//Lifecycle Hooks
onMounted(() => {
  pushIconsWithDelay();
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

const pushIconsWithDelay = () => {
  let index = 0;
  function pushNextIcon() {
    if (index < getIcons.value.length) {
      displayIcons.value.push(getIcons.value[index]);
      index++;

      if (index < getIcons.value.length) {
        setTimeout(pushNextIcon, 1000);
      }
    }
  }

  pushNextIcon();
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
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);

  position: relative;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in 0.2s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
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

/* @keyframes anim2 {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  25% {
    opacity: 0.25;
  }
  35% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.5;
  }
  60% {
    opacity: 0.6;
  }
  75% {
    opacity: 0.75;
  }
  85% {
    opacity: 0.85;
  }
  90% {
    opacity: 0.9;
  }
} */
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
</style>
