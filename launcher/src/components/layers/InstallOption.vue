<template>
  <div class="parent">
    <div class="header">ONE CLICK INSTALLATION</div>
    <div class="containerOption">
      <div class="text">
        ON THIS PAGE YOU CAN CHOOSE WHAT YOU WANT TO DO WITH YOUR NODE. AFTER
        CHOOSING AND PRESSING START A RANDOM CLIENT SELECTION WILL BE TAKEN TO
        SERVE YOUR USE CASE
      </div>
      <div class="plugin-container">
        <div class="select-box">
          <v-select></v-select>
        </div>
        <div class="plugin-box">
          <div class="plugin-row"></div>
        </div>
      </div>
    </div>
    <router-link :to="{ path: '/install' }">
      <base-button id="instal">INSTALL</base-button>
    </router-link>
    <router-link :to="{ path: '/welcome' }">
      <base-button id="back">BACK</base-button>
    </router-link>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
export default {
  data() {
    return {
      isTestnetActive: false,
      testnetBtn: false,
      isMainnetActive: false,
      mainnetBtn: false,
    };
  },
  computed: {
    R1clkInstls() {
      return this.$store.getters.R1clkInstls_get;
    },
  },
  methods: {
    testnetActive() {
      this.isTestnetActive = true;
      this.testnetBtn = true;
      this.isMainnetActive = false;
      this.mainnetBtn = false;
    },
    mainnetActive() {
      this.isMainnetActive = true;
      this.mainnetBtn = true;
      this.isTestnetActive = false;
      this.testnetBtn = false;
    },
  },
};
</script>

<style scoped>
.perent{

}
.header {
  padding: 1%;
  border: 2px solid grey;
  width: 30%;
  text-align: center;
  margin: 1% auto;
  border-radius: 40px;
  font-size: 14pt;
  color: #eee;
  font-weight: bold;
}

.containerOption {
  border: 3px solid grey;
  width: 60%;
  height: 55vh;
  margin: 4% auto;
  background: rgba(51, 102, 102, 0.7);
  border-radius: 40px;
  position: relative;
}




.container hr {
  width: 80%;
  color: #494949;
  height: 2px;
  background: grey;
}

.container p {
  text-align: center;
  width: 95%;
}

.text {
  text-align: center;
  width: 90%;
  margin: 2% auto;
  font-size: 10pt;
  color: #eee;
  font-weight: bold;
}

#instal {
  position: fixed;
  top: 81vh;
  left: 76%;
  width: auto;
  resize: both;
}

#back {
  position: fixed;
  top: 81vh;
  left: 14%;
  width: 100px;
  resize: both;
}
</style>
