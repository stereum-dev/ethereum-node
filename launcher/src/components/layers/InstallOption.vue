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
        <vue-select> </vue-select>
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
import VueSelect from "../UI/click-installation/VueSelect.vue";
export default {
  components: {
    VueSelect,
  },
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
.parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.header {
  padding: 1%;
  border: 4px solid grey;
  width: 30%;
  text-align: center;
  border-radius: 40px;
  font-size: 1.3rem;
  color: rgb(252, 252, 252);
  font-weight: bold;
  background: #2a4243;
  position: relative;
  opacity: 0.8;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
}

.containerOption {
  border: 3px solid grey;
  width: 55%;
  height: 55%;
  margin: 10px auto;
  background: #2a4243;
  border-radius: 40px;
  opacity: 0.7;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(25, 33, 32);
}
.plugin-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  color: rgb(255, 255, 255);
  font-weight: bold;
}
.select-box {
  width: 50%;
  margin: 0 auto;
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
