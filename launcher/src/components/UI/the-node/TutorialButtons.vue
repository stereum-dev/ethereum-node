<template>
  <div class="button-container" :style="{ height: arrow ? '26%' : '10%' }">
    <div class="button-parent" @click="arrow = !arrow">
      <div class="icon">
        <img :src="tutorialIcons" alt="" />
      </div>
      <div class="title">
        <span>{{ tutorialBtnTtl }}</span>
      </div>
      <div v-if="!arrow" class="up-arrow"></div>
      <div v-else class="down-arrow"></div>
    </div>
    <div v-if="arrow" class="button-info_sub">
      <div v-for="option in options" :key="option.title" class="sub" @click="handleOptionClick(option)">
        <div class="sub-icon">
          <img :src="option.icon" :alt="option.title" />
        </div>
        <div class="button-info_sub_title">
          <span>{{ option.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tutorialIcons: {
      type: String,
      required: true,
    },
    tutorialBtnTtl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      arrow: false,
      options: [
        {
          title: "Video",
          icon: "/img/icon/tutorial-icons/big-camera.png",
        },
        {
          title: "Written",
          icon: "/img/icon/tutorial-icons/manual-icon.png",
        },
        {
          title: "Guided",
          icon: "/img/icon/tutorial-icons/Guide-icon.png",
        },
      ],
    };
  },
  methods: {
    handleOptionClick(option) {
      if (option.title === "Guided") {
        // Emit Guided option clicked event
        this.$emit("guided-option-clicked");
      } else if (option.title === "Written") {
        // Emit Written option clicked event
        this.$emit("written-option-clicked");
      } else if (option.title === "Video") {
        // Emit Video option clicked event
        this.$emit("video-option-clicked");
      }
    },
  },
};
</script>

<style scoped>
.button-container {
  width: 95%;
  display: flex;
  flex-direction: column;
  height: 9%;
  justify-content: center;
  align-items: center;
}

.button-parent {
  height: 88%;
  display: flex;
  color: #eee;
  border: 2px solid #eee;
  border-radius: 5px;
  margin-bottom: 1%;
  justify-content: space-around;
  align-items: center;
  font-size: 55%;
  font-weight: 700;
  cursor: pointer;
}

.icon {
  width: 20%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}

.icon img {
  width: 90%;
}

.title {
  display: flex;
  width: 60%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
}

.up-arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid #eee;
  margin-right: 1%;
}

.down-arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #eee;
  margin-right: 1%;
}

.button-info_sub {
  width: 90%;
  min-height: 60%;
  margin: 2% 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}
.sub {
  width: 100%;
  height: 28%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #264744;
  margin-bottom: 3%;
  border-radius: 5px;
  cursor: pointer;
}
.sub:active {
  background: rgba(43, 84, 81, 0.5);
}
.sub:hover {
  background: rgb(51, 101, 97);
}
.sub-icon {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sub-icon img {
  width: 50%;
}
.button-info_sub_title {
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eee;
  font-size: 80%;
  text-transform: uppercase;
  font-weight: 500;
}
</style>
