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
import ButtonInstallation from './ButtonInstallation.vue'
import CircleLoading from '../UI/CircleLoading.vue'
import ControlService from '@/store/ControlService'
import { mapGetters } from 'vuex'
export default {
  created () {
    this.checkOS()
    this.randomValue()
  },
  components: { ButtonInstallation, CircleLoading },
  data () {
    return {
      running: true,
      message: '',
      value: 1,
      max: 100
    }
  },
  computed: {
    ...mapGetters({ installation: 'installation_get' })
  },
  methods: {
    randomValue () {
      this.value = Math.random() * this.max
    },
    display: async function (response) {
      const data = await response
      if (data == 'Ubuntu' || data == 'CentOS') {
        this.message = data.toUpperCase() + ' IS A SUPPORTED OS'
      } else if (data.name !== undefined) {
        this.message =
          data.name.toUpperCase() + ': ' + data.message.toUpperCase()
      } else {
        this.message = 'UNSUPPORTED OS'
      }
      this.running = false
    },
    checkOS: async function () {
      const response = ControlService.checkOS()
        .then((result) => {
          return result
        })
        .catch((error) => {
          return error
        })
      this.display(await response)
    }
  }
}
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
  width: 40%;
  height: 18% !important;
  margin: 50px auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
#welcome-header .welcome-title {
  width: 70% !important;
  height: 70% !important;
  margin: 0 auto !important;
  font-size: 2.4rem !important;
  box-shadow: 0 1px 3px 1px rgb(35, 60, 56);
  background: #2a4243;
  color: rgb(221, 221, 221);
  border-radius: 40px;
  border: 4px solid #6e8582;
  opacity: 0.8;
  text-align: center;
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
  height: 38% !important;
  margin: 10px auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-bg {
  width: 59% !important;
  height: 65% !important;
  border: 4px solid #6e8582;
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
  border: 4px solid #6e8582;
  margin: 0 auto !important;
  background: #2a4243;
  border-radius: 20px;
  opacity: 0.8;
  box-shadow: 0 1px 3px 1px rgb(28, 52, 48);
  display: flex;
  justify-content: center;
  align-items: center;
}
#txt p {
  font-size: 0.9rem;
  font-weight: bold;
  color: rgb(225, 225, 225);
  text-align: center;
}
</style>
