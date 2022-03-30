<template>
  <section class="Parent_ctnInstal">
    <section id="header">
      <h2>WELCOME</h2>
    </section>
    <div class="containerInstall">
      <div class="col" v-for="(install, index) in installation" :key="index">
        <router-link class="lintTtl" :to="install.path"
          ><button-installation
            :img="install.img"
            :url="install.img2"
          ></button-installation
        ></router-link>
      </div>
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
        <circle-loading :message="message" :open="running"></circle-loading>
      </div>
    </div>
  </section>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import CircleLoading from "../UI/CircleLoading.vue";
import ControlService from "@/store/ControlService";
import { mapGetters } from "vuex";
export default {
  created() {
    this.checkOS();
  },
  components: { ButtonInstallation, CircleLoading },
  data() {
    return {
      running: true,
      message: "",
    };
  },
  computed: {
    ...mapGetters({ installation: "installation_get" }),
  },
  methods: {
    display: async function (response) {
      let data = await response;
      console.log(data);
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
      console.log("check OS");
      let response = ControlService.checkOS()
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
.Parent_ctnInstal {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 20% 30% 40%;
}
.containerInstall {
  grid-column: 1/7;
  grid-row: 3;
  width: 80%;
  height: 90%;
  resize: both;
  margin: 0 auto;
  position: relative;
  border-radius: 40px;
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.col {
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

#header {
  grid-row: 1/2;
  grid-column: 2/6;
  width: 80%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
#header h2 {
  width: 90%;
  height: 40%;
  margin: 0 auto;
  font-size: 3rem;
  resize: both;
  box-shadow: 0 1px 3px 1px rgb(35, 60, 56);
  background: #2a4243;
  color: #fff;
  padding-bottom: 10px;
  border-radius: 40px;
  border: 3px solid #6e8582;
  opacity: 0.7;
}
.middle-box {
  grid-row: 2/3;
  grid-column: 1/7;
  width: 90%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.progress-container {
  width: 70%;
  height: 40%;
  justify-self: end;
  align-self: end;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
#txt {
  width: 85%;
  height: 45%;
  border: 3px solid #6e8582;
  margin: 0 auto;
  background: #2a4243;
  border-radius: 40px;
  position: relative;
  padding:10px;
  resize: both;
  opacity: 0.8;
  box-shadow: 0 1px 3px 1px rgb(28, 52, 48);
  display: flex;
  justify-content: center;
  align-items: center;
}
#txt p {
  font-size: 0.8rem;
  font-weight: bold;
  color: rgb(216, 216, 216);
  text-align: justify;
}
.headCol {
  text-align: center;
  width: 98%;
  border: 3px solid red;
  border-radius: 40px;
}
</style>
