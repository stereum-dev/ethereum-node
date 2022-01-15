<template>
  <section class="main">
    <section class="header">ONE CLICK INSTALLATION</section>
    <div class="container">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, cum
        harum? Cumque ipsa eum laudantium.
      </p>
      <hr />
      <div class="row">
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon">
          <img :src="img" />
        </div>
      </div>
      <div class="row">
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon">
          <img :src="img" />
        </div>
        <div class="icon"></div>
      </div>
      <hr />
    </div>
    <base-button id="instal">INSTAL</base-button>
    <router-link :to="{ path: '/welcome' }"
      ><base-button id="back">BACK</base-button></router-link
    >
  </section>
</template>

<script>
export default {
  data() {
    return {
      img: "/img/icon/ROCKETPOOL.png",
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
  background: greenyellow;
}
.row {
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
  border-radius: 45px;
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
