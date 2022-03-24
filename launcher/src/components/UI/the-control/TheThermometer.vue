<template>
  <div class="thermoParent">
    <div id="thermometer">
      <div>
        <div id="stem"></div>
        <div id="marks"></div>
        <div id="merc-stem"><div id="mercury"></div></div>

        <div id="bulb"></div>

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

  width: 0.5rem;
  height: 4rem;
  position: relative;
  left: 6.5rem;
  bottom: -4.5rem;
  z-index: 1;
  border-radius: 50px 50px 0 0;
  border-left: 3px solid white;
  border-top: 3px solid white;
  border-right: 3px solid white;

  animation-name: stem;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

#marks {

  width: 100%;
  height: 2.6rem;
  position: relative;
  bottom: 180px;
  left: 1rem;

  z-index: 40;
}

#merc-stem {

  width: 2px;
  height: 85px;
  position: relative;
  bottom: 175px;
  left: 6.8rem;
  bottom: 100px;
}
#mercury {
  width: 0.4rem;
  height: 25px;
  position: relative;
  bottom: -70%;
  left: -0.1rem;

  z-index: 10;
  animation-name: mercury;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

#bulb {
  position: relative;

  overflow: hidden;
  bottom: 4.2rem;
  left: 101px;
  z-index: 20;
  width: 1rem;
  height: 1rem;
  background-color: grey;
  border-radius: 50px;
  border: 2px solid white;

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

    height: 4rem;
    bottom: -80%;
  }
  to {
    background-color: #e4f30d;
    height: 1rem;
    bottom: -120%;

  }
}
</style>
