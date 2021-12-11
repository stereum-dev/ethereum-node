<template>
<section id="main">
      <section id="cont">
        <section>
          <img src="stereum_logo_extern.png" alt="" />
<!-- avale test -->



  <div class="test" style="border-style:none;">
    <section id="header">
      <h2>CONNECT TO YOUR SERVER</h2>
    </section>
    <form @submit.prevent>
      <div id="container">
        <div id="one">
           <div class="select-wrapper">
             
         
           <select >
           
            <option v-for="tunnel in tunnels" :key="tunnel.name" value="`http://localhost:${tunnel.localPort}/`">
             {{
                tunnel.name
              }}
            </option>
           </select>
  </div>
          <input class="three" type="image" src="./img/icon/+.png" />
          <input class="three" type="image" src="./img/icon/TRASH CAN.png" />
        </div>
        <div class="formGroup">
          <label for="servername">SARVERNAME</label>
          <input name="servername" id="servername" type="text" />
        </div>
        <div class="formGroup">
          <label for="host">IP or HOSTNAME</label>
          <input
            name="host"
            id="iporhostname"
            type="text"
            v-model="model.host"
          />
        </div>
        <div class="formGroup">
          <label for="user">USERNAME</label>
          <input name="user" id="username" v-model="model.user" />
        </div>
      </div>
      <div id="keyLocation">
        <label for="keylocation">KEYLOCATION</label>
        <input name="keylocation" id="keylocation" />
      </div>
      <div class="ssh" style="border-style:none;">
        <label id="lbl" for="">SSH</label>
        <label class="switch">
          <input
            type="checkbox"
            v-model="model.sshKeyAuth"
            name="check-button"
            checked
          />
          <span class="slider round"></span>
        </label>
      </div>

      <input id="login" type="submit" value="LOGIN" />
    </form>
  </div>

<!-- akhare test -->
  </section>
      </section>
    </section>
 
</template>
<script>
import BaseLogo from "./BaseLogo.vue";

export default {
  components: { BaseLogo },
  name: "SetupServer",
  data() {
    return {
      link: "stereumLogoExtern.png",
      stereumVersions: {},
      tunnels: [{name: "-------None-------", localPort: 0, dstPort: 0},{ name: "web-cc", localPort: 9081, dstPort: 8000 }],
      model: {},
    };
  },
  // props: {
  //   model: Object,
  // },
  methods: {
    async connect(e) {
      this.tunnels = [{ name: "web-cc", localPort: 9081, dstPort: 8000 }];
      try {
        await ControlService.connect(this.model);
      } catch (ex) {
        console.log(ex);
        this.$toasted.show(
          "Error connecting to server! Level: " +
            ex.level +
            " Message: " +
            ex.message
        );
        return;
      }

      const stereumStatus = await ControlService.inquire(this.model);

      if (!stereumStatus.exists)
        await ControlService.setup(stereumStatus.latestRelease);
      else {
        this.$toasted.show("Multiple Stereum Versions found!");
        this.stereumVersions = stereumStatus;
      }

      await ControlService.openTunnels(this.tunnels);
      await ControlService.disconnect();
      e.preventDefault();
    },
  },
};
</script>
<style scoped>



.select-wrapper {
   overflow: hidden;
text-align: center;
  width: 70%;
  padding:0;
  border-radius: 40px;
  float: left;
      

}


select{
 width: 100%;
 align-items: center;
  padding: 1rem;
  border-radius: 40px;

}
.select-wrapper::after{
  position: absolute;
  width: 50%;
   z-index: 100;
}
test {
  
  /* animation: modal 0.3s ease-out forwards; */
  background-color: rgba(76, 72, 72, 0.5);
  
}
#header {
  text-align: center;
  margin: 2rem auto;
  max-width: 35rem;
  border-radius: 40px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.5rem;
  background-color: #aa2626;
  color: #fff;
}
div {
  text-align: center;
  margin: 1rem auto;
  max-width: 40rem;
  border-radius: 20px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.3rem;
  border: 2px solid grey;
  position: relative;
  opacity: 90%;
}
#one {
  margin: 1rem auto;
  max-width: 40rem;
  border-radius: 40px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 1rem;
  background-color: #681264;
  justify-content: center;
  align-items: center;
  display: flex;
  
}
#one select{
  text-align: center;
}
#two {
  width: 70%;
  padding: 1rem;
  border-radius: 40px;
  float: left;
}
.three {
  width: 50px;
  float: left;
}
.formGroup {
  display: flex;
  background-color: #567891;
}

.formGroup label {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 40px;
  font-size: large;

  color: #fff;
}
.formGroup input {
  width: 60%;
  border-radius: 40px;
  padding: 0.1rem;
  float: right;
  text-align: right;
}
#keyLocation {
  text-align: center;
  margin: 1rem auto;
  max-width: 35rem;
  border-radius: 20px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.3rem;
  background-color: #26aa43;
  justify-content: center;

  display: flex;
}
#keyLocation label {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 40px;
  font-size: large;

  color: #fff;
}
#keyLocation input {
  width: 60%;
  border-radius: 40px;
  padding: 0.1rem;
  float: right;
  text-align: right;
  justify-content: center;

  display: flex;
}
#login {
  position: fixed;
  top: 81vh;
  left: 86%;
  width: 100px;
  z-index: 100;
  resize: both;
  padding: 0.4rem;
  border-radius: 40px;
  background-color: orange;
  text-align: center;
  font-weight: bold;
}

.ssh {
  
  
  margin-top: 0;
  text-align: left;

  max-width: 35rem;
  border-radius: 40px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.3rem;
  display: flex;
  color: #fff;
}
.shh #lbl {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* test background */
#cont {
  border-radius: 40px;

  padding: 1rem;
  margin: 2rem auto;
  width: 95vw;
  height: 90vh;
  background-color: #336666;
}
#main {
  background-color: #000;

  justify-content: center;
  align-items: center;
  height: 100vh;
  display: flex;
}

img {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 45%;
  min-height: 20%;
  min-width: 20%;
  transform: translate(-50%, -50%);
  resize: both;
}




</style>
