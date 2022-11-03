<template>
  <div class="relaysParent">
    <div class="relaysBox">
      <div class="relaysBoxTitle">AVAILABLE BLOCK RELAYS</div>
      <div class="relaysBoxContent">
        <div class="relay" v-for="relay in relaysList" :key="relay.id">
          <input
            type="checkbox"
            :id="relay.id"
            :value="relay"
            v-model="checkedRelays"
          />
          <label :for="relay.id">{{ relay.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  computed: {

  },
  mounted() {
    console.log("Relays", this.relaysList);
  },
};
</script>
<style scoped>
.relaysParent {
  width: 100px;
  height: 100px;
}
.relaysBox {
  width: 100%;
  height: 100%;
  padding: 2px;
  background-color: #23282b;
  border: 1px solid #22272a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.relaysBoxTitle {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaaaaa;
}
.relaysBoxContent {
  width: 100%;
  height: 90%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.relaysBoxContent::-webkit-scrollbar {
  width: 5px;
}
.relaysBoxContent::-webkit-scrollbar-track {
  background: #23282b;
}
.relaysBoxContent::-webkit-scrollbar-thumb {
  background: #42a5de;
  border-radius: 5px;
}

.relaysBoxContent .relay {
  width: 100%;
  height: 12%;
  min-height: 35px;
  background-color: #2e3438;
  border: 1px solid #22272a;
  border-radius: 5px;
  margin-top: 2px;
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
}
.relaysBoxContent .relay:hover {
  background-color: #3b4246;
  border: 1px solid #3b4246;
  transition-duration: 0.2s;
}
.relaysBoxContent .relay input {
  width: 10%;
  height: 60%;
  border-radius: 2px;
  background-color: rgb(81, 89, 96);
}
.relaysBoxContent .relay label {
  width: 80%;
  height: 100%;
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaaaaa;
  cursor: pointer;
}
</style>
