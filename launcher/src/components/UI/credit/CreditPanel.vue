<template>
  <div class="credit-panel_parent">
    <div class="credit-panel_box" v-if="financial">
      <div class="credit-panel_title">
        <div class="ttl-box">
          <div class="credit-panel_title_ico">
            <img :src="financialIco" />
          </div>
          <div class="credit-panel_title_ttl">
            <span>CREDITS - FINANCIAL CONTRIBUTORS</span>
          </div>
        </div>
      </div>
      <div class="division-line"></div>
      <div class="desc-line">
        <span
          >GET YOUR NAME ON THE LIST! THANK YOU FOR SUPPORTING THE DEVELOPMENT!
        </span>
        <div class="desc-line-button" @click="creditToggle">
          <div class="desc-line-button_ico">
            <img :src="technikalIco" alt="" />
          </div>
          <span>TECHNICAL CONTRIBUTION</span>
        </div>
      </div>
      <div class="footer"></div>
      <task-manager></task-manager>
    </div>
    <div class="credit-panel_box" v-else>
      <div class="credit-panel_title">
        <div class="ttl-box">
          <div class="credit-panel_title_ico">
            <img :src="technikalIco" />
          </div>
          <div class="credit-panel_title_ttl">
            <span>CREDITS - TECHNICAL CONTRIBUTORS</span>
          </div>
        </div>
      </div>
      <div class="division-line"></div>
      <div class="desc-line">
        <span
          >EARN A GITPOAP! LEARN HOW TO GET INVOLVED BY VISITING OUR GITHUB!
        </span>
        <div class="desc-line-button" @click="creditToggle">
          <div class="desc-line-button_ico">
            <img :src="financialIco" alt="" />
          </div>
          <span>FINANCIAL CONTRIBUTION</span>
        </div>
      </div>
      <technical-box></technical-box>
      <div class="footer"></div>
      <task-manager></task-manager>
    </div>
  </div>
</template>
<script>
import TechnicalBox from "./TechnicalBox.vue";
import TaskManager from "../task-manager/TaskManager.vue";
export default {
  components: { TaskManager, TechnicalBox },
  data() {
    return {
      financial: true,
      financialIco: ".//public/img/icon/credit/creditIcon.png",
      technikalIco: ".//public/img/icon/credit/technikal.png",
    };
  },

  methods: {
    creditToggle() {
      this.financial = !this.financial;
    },
  },
};
</script>
<style scoped>
.desc-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eee;
  font-weight: 400;
  width: 90%;
  height: 10%;
}
.desc-line-button {
  display: flex;
  width: 25%;
  font-size: 80%;
  height: 60%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 400;
  border: 1px solid #eee;
}
.desc-line-button:hover {
  font-weight: 800;
}
.desc-line-button_ico {
  display: flex;
  height: 90%;
  width: 20%;
  justify-content: center;
  align-items: center;
}
.desc-line-button_ico img {
  width: 40%;
}
.credit-panel_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99.95%;
  height: 91%;
  background-color: #232323;
  border: 4px solid #979797;
  border-radius: 10px 35px 10px 10px;
  z-index: 0;
  box-sizing: border-box;
}
.credit-panel_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
  justify-content: flex-start;
  align-items: center;
}
.credit-panel_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 9%;
}
.ttl-box {
  display: flex;
  width: 60%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 5%;
}
.credit-panel_title_ico {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.credit-panel_title_ico img {
  width: 60%;
}
.credit-panel_title_ttl {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
  color: #eee;
  text-transform: uppercase;
  font-weight: 500;
}
.base-container {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.confirm-btn {
  width: 18%;
  height: 65%;
  background: #48e148;
  border: 1px solid #707070;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin: 5% 0;
}
.confirm-btn:hover,
.confirm-btn:focus {
  border: 1px solid white;
  font-weight: 800;
}
.division-line {
  width: 95%;
  height: 1%;
  background: #eee;
}
</style>
