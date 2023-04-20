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
      <div class="sub">
        <div class="sub-icon">
          <img src="../../../../public/img/icon/tutorial-icons/Guide-icon.png" alt="" />
        </div>
        <div class="button-info_sub_title"><span>Guided</span></div>
      </div>
      <div class="sub">
        <div class="sub-icon">
          <img src="../../../../public/img/icon/tutorial-icons/manual-icon.png" alt="" />
        </div>
        <div class="button-info_sub_title"><span>Written</span></div>
      </div>
      <div class="sub">
        <div class="sub-icon">
          <img src="../../../../public/img/icon/tutorial-icons/big-camera.png" alt="" />
        </div>
        <div class="button-info_sub_title"><span>Video</span></div>
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
    };
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
  height: 85%;
  display: flex;
  color: #eee;
  border: 2px solid #eee;
  border-radius: 5px;
  margin-bottom: 2%;
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
  background: #336666;
  margin-bottom: 2%;
  border-radius: 5px;
  cursor: pointer;
}
.sub:active {
  transform: scale(0.9);
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
