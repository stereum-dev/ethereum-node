<template>
  <section class="Parent_ctnInstal">
    <section id="header">
      <h2>welcome</h2>
    </section>
    <div class="containerInstall">
      <div class="col" v-for="install in installation" :key="install.title">
        <router-link class="lintTtl" :to="install.path"
          ><button-installation
            :title="install.title"
            :img="install.img"
          ></button-installation
        ></router-link>
      </div>
    </div>
    <circle-loading :message="message" :open="running"></circle-loading>
    <div id="txt">
      <p>
        IN THIS STEP YOU CHOOSE HOW YOU WANT TO INSTALL YOUR NODE. IF YOU NEED
        ASSISTANCE WITH THE SETUP, JOIN OUR DISCORD - WE ARE HAPPY TO HELP YOU
        OUT
      </p>
    </div>
  </section>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import CircleLoading from "../UI/CircleLoading.vue";
import ControlService from "@/store/ControlService";
export default {
  created() {
    console.log("check OS");
    let response = ControlService.checkOS()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
    this.display(response);
  },
  components: { ButtonInstallation, CircleLoading },
  data() {
    return {
      running: true,
      message: "",
    };
  },
  computed: {
    installation() {
      return this.$store.getters.installation_get;
    },
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
  },
};
</script>
<style scope>
.Parent_ctnInstal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.containerInstall {
  width: 72vw;
  height: 30vh;
  resize: both;
  margin: 0 auto;
  position: relative;
  border-radius: 40px;
  flex-wrap: nowrap;
  display: flex;
  justify-content: center;
}
.col {
  width: 30%;
  height: 100%;
  background: rgba(51, 102, 102, 0.4);
  box-sizing: border-box;
  border: 3px solid rgb(88, 86, 86);
  margin: 1rem;
  border-radius: 20px;
  display: flex;
}
#header {
  text-align: center;
  margin: 1rem auto;
  margin-top: 1.7rem;
  max-width: 15rem;
  border-radius: 40px;
  padding: 0.1rem;
  background: #336666;
  color: #fff;
  border: 3px solid rgb(88, 86, 86);
  position: relative;
  resize: both;
}
#header h2 {
  margin: 0 auto;
  font-size: 30pt;
  resize: both;
}
#txt {
  width: 70vw;
  height: auto;
  border: 3px solid rgb(88, 86, 86);
  margin: auto;
  background: #336666;
  border-radius: 40px;
  position: relative;
  padding: 2%;
  resize: both;
}
#txt p {
  margin-top: -1px;
  font-weight: bold;
  color: #fff;
}
.headCol {
  text-align: center;
  width: 98%;
  border: 3px solid red;
  border-radius: 40px;
}
.lintTtl {
  text-decoration: none;
}
</style>
