<template>
  <div class="plugin-parent">
    <div class="select-box">
      <v-select
        class="select"
        :options="['Mainnet', 'Testnet']"
        :reduce="(plugins) => plugins.network"
        v-model="selectedNetwork"
      >
      </v-select>
    </div>
    <div class="plugin-table">
      <div class="table-content">
        <div
          class="plugin-box"
          v-for="(item, index) in installationPlugins"
          :key="index"
        >
          <div class="mainnet-plugin">
            <img :src="item.icon" alt="icon" />
          </div>
          <div class="testnet-plugin">
            <img :src="item.icon" alt="icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isNetworkActive: false,
      selectedNetworks: "",
    };
  },
  computed: {
    ...mapGetters(["installationPlugins"]),
  },
};
</script>
<style scoped>
.plugin-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.select-box {
  width: 50%;
  height: 15%;
}
.v-select {
  width: 100%;
  height: 70%;
  border: 1px solid rgb(83, 161, 230);
  border-radius: 5px;
  background-color: rgb(14, 14, 14) !important;
  color: rgb(40, 40, 42) !important;
}
.vs__selected-options span {
  font-size: 0.8rem;
  font-weight: 900;
  color: aqua;
}

.plugin-table {
  width: 95%;
  height: 55%;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 1px 2px 1px rgb(21, 45, 41);
}

.table-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 50%);
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-items: center;
  background-color: rgb(47, 114, 112);
}
.plugin-box {
  width: 60%;
  height: 100%;
}
.mainnet-plugin,
.testnet-plugin {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainnet-plugin img,
.testnet-plugin img {
  width: 75px;
  height: 75px;
}
</style>
