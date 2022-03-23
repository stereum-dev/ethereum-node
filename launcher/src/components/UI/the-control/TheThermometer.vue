<template>
  <div class="thermoParent">
    <div id="thermometer">
      <div>
        <div id="stem"></div>
        <div id="marks"></div>
        <div id="merc-stem"><div id="mercury"></div></div>
        <div id="bulb">100</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#thermometer {
  width: 5%;
}
#far {
  border: 4px solid black;
  height: 400px;
}

#cel {
  border: 4px solid black;
  height: 400px;
}

#stem {
  width: 20px;
  height: 215px;
  position: relative;
  left: 21px;
  z-index: 1;
  border-radius: 50px 50px 0 0;
  border-left: 4px solid black;
  border-top: 4px solid black;
  border-right: 4px solid black;
  animation-name: stem;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

#marks {
  width: 20px;
  height: 90px;
  position: relative;
  bottom: 180px;
  left: 36px;
  z-index: 40;
}

#merc-stem {
  width: 10px;
  height: 85px;
  position: relative;
  bottom: 175px;
  left: 25px;
}
#mercury {
  width: 20px;
  height: 25px;
  position: relative;
  bottom: -80%;
  z-index: 10;
  animation-name: mercury;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

#bulb {
  position: relative;
  /*   overflow: hidden; */
  bottom: 190px;
  z-index: 20;
  width: 60px;
  height: 60px;
  background-color: grey;
  border-radius: 50px;
  border: 4px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  #main {
    height: 600px;
    overflow: hidden;
  }
}

@keyframes mercury {
  from {
    background-color: #dd2c00;
    height: 190px;
    bottom: 100%;
  }
  to {
    background-color: #e4f30d;
    height: 25px;
    bottom: -80%;
  }
}
</style>
