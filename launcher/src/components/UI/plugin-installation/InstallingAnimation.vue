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

        <div class="taskBox">
          <div v-if="displayNewTask !== ''" class="message-box">
            <p class="msg-title">
              {{ displayNewTask }}
              <span class="dot-flashing"></span>
            </p>
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
import ControlService from "@/store/ControlService";
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
      Tasks: [],
      displayNewTask: "",
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
    this.polling = setInterval(ControlService.updateTasks, 2000); //refresh playbook logs
    this.refresh = setInterval(this.getTasks, 1000); //refresh data
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
          this.images.push(this.executionClientIcon, this.consensusClientIcon);
        }, 700);
        setTimeout(() => {
          this.images.push(this.installAnimations[3]);
        }, 1500);
        this.images = [];
      }, 6000);
    },
    getTasks: async function () {
      this.Tasks = await ControlService.getTasks();
      this.displayNewTask = this.Tasks.slice(-1)[0].name;
    },
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
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);

  position: relative;
}
.anim__content {
  grid-column: 1/6;
  grid-row: 1/6;
  width: 75%;
  height: 100%;
  margin: 0 auto;
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
  animation-name: anim1;
  animation-duration: 500ms;
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
  width: 145px !important;
  height: 145px !important;
  position: absolute !important;
  top: 26.4% !important;
  left: 25.3% !important;
  animation-name: anim2 3s !important;
}

.consensus__icon {
  width: 144px !important;
  height: 144px !important;
  position: absolute !important;
  top: 25.8% !important;
  left: 57% !important;
  animation-name: anim2 3s !important;
}
@keyframes anim2 {
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
