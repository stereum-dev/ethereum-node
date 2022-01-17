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
      <div
        class="row1"
        v-for="R1clkInstl in R1clkInstls"
        :key="R1clkInstl.clkId"
      >
        <div class="icon">
          <img :src="R1clkInstl.img" />
        </div>
      </div>
      <div
        class="row2"
        v-for="R2clkInstl in R2clkInstls"
        :key="R2clkInstl.clkId"
      >
        <div class="icon">
          <img :src="R2clkInstl.img" />
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
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
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
.row1,
.row2 {
  display: flex;
}

.container hr {
  width: 80%;
  color: #494949;
  height: 2px;
  background: grey;
}
.icon {
  border: 2px solid grey;
  margin: 5px;
  width: 23%;
  resize: both;
  border-radius: 40px;
  /* margin-left: 1%; */
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
