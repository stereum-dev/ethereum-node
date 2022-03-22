<template>
  <div class="parent">
    <div class="header">ONE CLICK INSTALLATION</div>
    <div class="containerOption">
      <div class="text">
        ON THIS PAGE YOU CAN CHOOSE WHAT YOU WANT TO DO WITH YOUR NODE. AFTER
        CHOOSING AND PRESSING START A RANDOM CLIENT SELECTION WILL BE TAKEN TO
        SERVE YOUR USE CASE
      </div>
      <hr />
      <div class="row">
        <div class="list__size">
          <div
            class="list"
            v-for="R1clkInstl in R1clkInstls"
            :key="R1clkInstl.clkId"
          >
            <img :src="R1clkInstl.img" />
          </div>
        </div>
      </div>
    </div>
    <router-link :to="{ path: '/install' }">
      <base-button id="instal">INSTAL</base-button>
    </router-link>
    <router-link :to="{ path: '/welcome' }">
      <base-button id="back">BACK</base-button>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    R1clkInstls() {
      return this.$store.getters.R1clkInstls_get;
    },
  },
};
</script>

<style scoped>
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

.row {
  list-style: none;
  height: 30%;
  box-sizing: border-box;
}
.list__size {
  display: flex;
  flex-wrap: wrap;
  width: 98%;
  margin: auto;
  box-sizing: border-box;
  text-align: center;
}

.row .list {
  display: flex;
  flex-wrap: wrap;
  width: 22%;
  height: 100%;
  margin: 0 1.5%;
}

.list img {
  width: 80%;
  height: auto;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  cursor: pointer;
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
  width: 100px;
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
