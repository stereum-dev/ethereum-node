<template>
  <div class="grafana-container">
    <div class="icon-box">
      <img src="/img/icon/service-icons/grafana.png" alt="icon" />
    </div>
    <div class="title-box">
      <span class="service-name">GRAFANA</span>
      <div class="service-option">
        <img src="/img/icon/service-icons/internet.png" alt="icon" />
        <img src="/img/icon/service-icons/github1.png" alt="icon" />
        <img src="/img/icon/service-icons/discord.png" alt="icon" />
      </div>
    </div>
    <div class="btn-box">
      <a class="btn" :href="link" target="_blank">open default browser</a>
    </div>
  </div>
</template>
<script>
export default {
  props: ["link"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.grafana-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  z-index: 106;
}
.icon-box {
  grid-column: 1;
  grid-row: 1;
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 90%;
  height: 90%;
  z-index: 110;
}
.title-box {
  grid-column: 2/4;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.title-box span {
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 600;
}
.service-option {
  width: 90%;
  height: 50%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.service-option img {
  width: 20%;
  height: 70%;
}

.btn-box {
  grid-column: 1/5;
  grid-row: 3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box .btn {
  width: 70%;
  height: 40px;
  background-color: #f37625;
  text-decoration: none;
  border: 2px solid #f9b88d;
  border-radius: 10px;
  box-shadow: inset 1px 1px 5px #fac7a5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:active {
  box-shadow: inset 2px 2px 15px #1d130d;
  color: rgb(218, 218, 218);
}
.btn:hover {
  border: 2px solid #f9b88d;
  box-shadow: none;
  background-color: rgb(230, 127, 58) 5;
}
</style>
