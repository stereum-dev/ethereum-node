<template>
  <section class="main">
    <section class="header">ONE CLICK INSTALLATION</section>
    <div class="container">
      <p>
        ON THIS PAGE YOU CAN CHOOSE WHAT YOU WANT TO DO WITH YOUR NODE. AFTER
        CHOOSING AND PRESSING START A RANDOM CLIENT SELECTION WILL BE TAKEN TO
        SERVE YOUR USE CASE
      </p>
      <hr />

      <div id="grid-container ">
        <div
          class="row1"
          v-for="R1clkInstl in R1clkInstls"
          :key="R1clkInstl.clkId"
        >
          <input type="image" :src="R1clkInstl.img" />
        </div>
        <div
          class="row2"
          v-for="R2clkInstl in R2clkInstls"
          :key="R2clkInstl.clkId"
        >
          <input type="image" :src="R2clkInstl.img" />
        </div>
      </div>

      <hr />
    </div>
    <router-link :to="{ path: '/node' }"
      ><base-button id="instal">INSTAL</base-button></router-link
    >
    <router-link :to="{ path: '/welcome' }"
      ><base-button id="back">BACK</base-button></router-link
    >
  </section>
</template>

<script>
export default {
  data() {
    return {
      R1clkInstls: [
        { clkId: "staking", img: "/img/icon/STAKING.png" },
        { clkId: "testnet", img: "/img/icon/TESTNET.png" },
        { clkId: "ssv", img: "/img/icon/OBOL SSV.png" },
        { clkId: "blox", img: "/img/icon/BLOX SSV.png" },
      ],
      R2clkInstls: [
        { clkId: "rocket", img: "/img/icon/ROCKETPOOL.png" },
        { clkId: "staking", img: "/img/icon/STAKING.png" },
        { clkId: "ssv", img: "/img/icon/OBOL SSV.png" },
        { clkId: "blox", img: "/img/icon/BLOX SSV.png" },
      ],
    };
  },
};
</script>

<style scoped>
.header {
  text-align: center;
  margin: 2rem auto;
  max-width: 25rem;
  border-radius: 40px;
  padding: 0.5rem;
  background-color: #567891;
  color: #fff;
  border: 2px solid grey;
}

.container {
  width: 42.5%;
  height: 50%;
  resize: both;
  margin: 0 auto;
  position: relative;
  border-radius: 40px;
  border: 5px solid grey;
  resize: both;
  background: rgb(161, 193, 173, 0.5);
}
#grid-container {
  display: flex;
  height: 200px;
  padding: 1em;
  color: white;
  outline: 2px solid silver;
}

#grid-container > div {
  width: 100%;
  margin: 1em;
  height: 100px;
  background-color: #b200ff;
  font-family: sans-serif;
  text-align: center;
  line-height: 100px;
  font-size: xx-large;
}

.container hr {
  width: 80%;
  color: #494949;
  height: 2px;
  background: grey;
}

.icon img {
  float: left;
  padding: 5px auto;
  width: 100%;
  resize: both;
}
.container p {
  text-align: center;
  margin: 15pt auto;
  font-size: 12pt;
  font-weight: bold;
  width: 95%;
}
.main {
  resize: both;
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
