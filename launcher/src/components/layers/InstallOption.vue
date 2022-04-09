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
      <div class="btn-container">
        <div @click="clickedToInstall">
          <button id="instal">INSTALL</button>
        </div>
        <router-link :to="{ path: '/welcome' }">
          <button id="back">BACK</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import VueSelect from "../UI/click-installation/VueSelect.vue";
import { mapGetters } from "vuex";
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
    ...mapGetters({
      selectedPlugin: "getSelectedPlugin",
    }),
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
    clickedToInstall() {
      if (Object.keys(this.selectedPlugin).length > 0) {
        this.$router.push("/install");
      }
    },
  },
};
</script>

<style scoped>
.parent {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows:10%;
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
  border-radius: 30px;
  opacity: 0.87;
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
  min-width: 120px;
  height: 8%;
  resize: both;
  border: 3px solid #545454;
  border-radius: 40px;
  background-color: rgb(36, 55, 49);
  font-size: 1.3rem;
  font-weight: 800;
  color: rgb(191, 191, 191);
  box-shadow: 0 1px 3px 1px rgb(21, 31, 26);
  outline-style: none;
}

#back {
  position: fixed;
  top: 81vh;
  left: 14%;
  width: auto;
  height: 8%;
  min-width: 120px;
  resize: both;
  border: 3px solid #545454;
  border-radius: 40px;
  background-color: rgb(36, 55, 49);
  font-size: 1.3rem;
  font-weight: 800;
  color: rgb(191, 191, 191);
  box-shadow: 0 1px 3px 1px rgb(21, 31, 26);
  outline-style: none;
}
#instal:hover,
#back:hover {
  background-color: rgb(31, 48, 43);
  box-shadow: 0 1px 3px 0 rgb(21, 31, 26);
}
#instal:active,
#back:active {
  box-shadow: inset 1px 1px 3px 1px rgb(14, 19, 17);
}
</style>
