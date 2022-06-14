<template>
  <div class="welcome-parent">
    <div id="welcome-header">
      <h2 class="welcome-title">WELCOME</h2>
    </div>
    <div class="middle-box">
      <div id="txt">
        <p>
          IN THIS STEP YOU CHOOSE HOW YOU WANT TO INSTALL YOUR NODE. IF YOU NEED
          ASSISTANCE WITH THE SETUP, JOIN OUR DISCORD - WE ARE HAPPY TO HELP YOU
          OUT
        </p>
      </div>
      <div class="progress-container">
        <div class="progress-bg">
          <circle-loading :message="message" :open="running"></circle-loading>
        </div>
      </div>
    </div>
    <div class="item-container">
      <div
        class="item-column"
        v-for="(install, index) in installation"
        :key="index"
      >
        <router-link class="lintTtl" :to="install.path"
          ><button-installation
            onmousedown="return false"
            :img="install.img"
            :url="install.img2"
          ></button-installation
        ></router-link>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import CircleLoading from "../UI/CircleLoading.vue";
import ControlService from "@/store/ControlService";
import { mapState } from "pinia";
import { useWelcomeStore } from "@/store/welcomePage";
export default {
  created() {
    this.checkOS();
    this.randomValue();
  },
  components: { ButtonInstallation, CircleLoading },
  data() {
    return {
      running: true,
      message: "",
      value: 1,
      max: 100,
    };
  },
  computed: {
    ...mapState(useWelcomeStore, { installation: "installation" }),
  },
  methods: {
    randomValue() {
      this.value = Math.random() * this.max;
    },
    display: async function (response) {
      const data = await response;
      if (data == "Ubuntu" || data == "CentOS") {
        this.message = data.toUpperCase() + " IS A SUPPORTED OS";
      } else if (data.name !== undefined) {
        this.message =
          data.name.toUpperCase() + ": " + data.message.toUpperCase();
      } else {
        this.message = "UNSUPPORTED OS";
      }
      this.running = false;
    },
    checkOS: async function () {
      const response = ControlService.checkOS()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return error;
        });
      this.display(await response);
    },
  },
};
</script>
<style scope>
.welcome-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-container {
  width: 80% !important;
  height: 40% !important;
  margin: 30px auto !important;
  position: relative;
  border-radius: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-column {
  width: 28%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lintTtl {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

#welcome-header {
  border: 5px solid #929292;
  margin: 6% auto 2% auto;
  width: 40%;
  max-width: 50%;
  height: 50px;
  border-radius: 40px;
  background-color: #194747;
  opacity: 0.88;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#welcome-header .welcome-title {
  width: 95%;
  max-width: auto;
  height: 100%;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: #cecece !important;
  border: none;
  background-color: transparent;
  box-shadow: none;
  text-transform: uppercase;
}
.middle-box {
  width: 90% !important;
  height: 35% !important;
  margin: 10px auto !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.progress-container {
  width: 82% !important;
  height: 30% !important;
  margin: 10px auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-bg {
  width: 59% !important;
  height: 70% !important;
  border: 3px solid #929292;
  background-color: #6e8582;
  border-radius: 40px;
  box-shadow: 0 0 3px 1px rgb(18, 20, 20), inset 1px 1px 5px rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}
#txt {
  width: 85% !important;
  height: 95% !important;
  border: 5px solid #929292;
  margin: 0 auto !important;
  background-color: #194747;
  border-radius: 20px;
  opacity: 0.8;
  box-shadow: 0 1px 3px 1px rgb(28, 52, 48);
  display: flex;
  justify-content: center;
  align-items: center;
}
#txt p {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(225, 225, 225);
  text-align: center;
}
</style>
