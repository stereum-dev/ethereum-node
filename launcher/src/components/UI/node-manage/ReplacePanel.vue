<template>
  <div class="replaceParent">
    <div class="replaceBox">
      <div class="service">
        <img :src="plugin.icon" alt="icon" />
        <div class="service-details">
          <span class="serviceName">{{ plugin.name }}</span>
          <p class="category">
            {{ plugin.category }}
            <span v-if="plugin.category !== 'service'">Client</span>
          </p>
        </div>
      </div>
      <div class="configBox">
        <div
          v-for="service in allServices.filter((e) => e.category === plugin.category && e.name !== plugin.name)"
          :key="service.id"
          class="pluginBox"
          @click="replacePluginHandler(service)"
        >
          <img :src="service.icon" alt="icon" />
          <div class="plugin-details">
            <span class="pluginName">{{ service.name }}</span>
            <p class="category">
              {{ service.category }}
              <span v-if="service.category !== 'service'">{{ $t("replacePanel.client") }}</span>
            </p>
          </div>
        </div>
        <div v-if="plugin.category === 'execution' || plugin.category === 'consensus'" class="fast-sync">
          <div class="sync-header">
            <div class="headerTitle">
              <span>{{ $t("replacePanel.sync") }}</span>
            </div>
            <div class="headerContent">
              <img src="/img/icon/arrows/left-arrow.png" alt="icon" @click="changeTheOption" />
              <span v-if="genesisIsActive">{{ $t("replacePanel.gen") }}</span>
              <span v-if="checkPointIsActive">{{ $t("replacePanel.chkPoint") }}</span>
              <img src="/img/icon/arrows/right-arrow.png" alt="icon" @click="changeTheOption" />
            </div>
          </div>
          <div class="content">
            <span v-if="genesisIsActive">{{ $t("replacePanel.genActiv") }}</span>
            <div v-if="checkPointIsActive" class="inputBox">
              <input v-model="checkPointSync" type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="btnBox">
        <div class="cancelBtn" @click="$emit('cancelReplace')">
          <span>{{ $t("replacePanel.cancel") }}</span>
        </div>
        <div class="addBtn" @click="$emit('confirmReplace')">
          <span>{{ $t("replacePanel.confirm") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";

export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      plugin: {},
      selected: {},
      genesisIsActive: false,
      checkPointIsActive: false,
      checkPointSync: "",
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
  },
  watch: {
    items: {
      handler: function (val) {
        this.plugin = val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.genesisIsActive = true;
  },
  methods: {
    changeTheOption() {
      if (this.genesisIsActive) {
        this.genesisIsActive = false;
        this.checkPointIsActive = true;
      } else {
        this.checkPointIsActive = false;
        this.genesisIsActive = true;
      }
    },
    replacePluginHandler(item) {
      this.plugin = item;
      this.$emit("replacePlugin", this.plugin);
    },
  },
};
</script>
<style scoped>
.replaceParent {
  grid-column: 1;
  width: 100%;
  height: 100%;
  margin-top: 1px;
  display: flex;
  background: #3a3d40;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  transition-duration: 500ms;
}

.replaceBox {
  width: 98%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #3a3d40;
  border-right: 2px solid rgb(31, 31, 31);
  margin: 0 auto;
  position: relative;
}

.service {
  width: 98%;
  height: 10%;
  margin-top: 15%;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.service img {
  width: 25%;
}

.service-details {
  width: 70%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.service-details .serviceName {
  width: 100%;
  height: 60%;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 700;
  color: #c8c8c8;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
}
.service-details p,
.service-details p span {
  width: max-content;
  height: 40%;
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: flex-start;
}

.configBox {
  width: 95%;
  height: 70%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.configBox .pluginBox {
  width: 100%;
  height: 13%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.pluginBox:hover {
  background-color: #242424;
}
.configBox .pluginBox img {
  width: 20%;
}
.pluginBox .plugin-details {
  width: 70%;
  height: 95%;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.plugin-details .pluginName {
  width: 100%;
  height: 50%;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 800;
  color: #c8c8c8;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
}
.plugin-details p {
  width: max-content;
  height: 45%;
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: flex-start;
}
.plugin-details p span {
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #8a8a8a;
}

.configBox .fast-sync {
  width: 100%;
  height: 20%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  margin-top: 10px;
  border-radius: 10px 0 3px 3px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.fast-sync .sync-header {
  width: 100%;
  height: 40%;
  border: 1px solid #2b2b2b;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.fast-sync .sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #316355;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  height: 100%;
  padding: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
}
.fast-sync .sync-header .headerContent {
  width: 55%;
  height: 100%;
  border-radius: 0;

  background-color: #414649;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.headerContent span {
  width: 86%;
  height: 100%;
  padding: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
}
.headerContent img {
  width: 8%;
  height: 50%;
  cursor: pointer;
}
.fast-sync .content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-sync .content span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #848484;
  text-align: center;
}
.fast-sync .content .inputBox {
  width: 95%;
  height: 70%;
  background-color: #d1d1d1;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.fast-sync .content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 4px;
}
.portreplaceBox,
.clientreplaceBox {
  width: 100%;
  height: 13%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.portreplaceBox img {
  width: 18%;
  opacity: 0.5;
}
.clientreplaceBox img {
  width: 16%;
  opacity: 0.5;
}
.portConfig {
  width: 80%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.portConfig span {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
}
.portConfig input {
  width: 99%;
  height: 45%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #b0b0b0;
  padding: 0;
}
.connectionConfig {
  width: 80%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.connectionConfig span {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
}
.connectionConfig .plusBtn {
  width: 100%;
  height: 45%;
  background-color: #c9c9c9;
  color: #2a2a2a;
  border-radius: 30px;
  border: 1px solid #a8a8a8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222222;
  text-align: center;
}
.plusBtn:hover {
  transform: scale(1.01);
  color: #c9c9c9;
  font-weight: 600;
  background-color: #285c4e;
  transition-duration: 0.2s;
}
.plusBtn:active {
  background-color: #1c3c33;
  transform: scale(0.9);
}
.connectedService {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.connectedService .category {
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
}
.connectedService .name {
  width: 99%;
  height: 50%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  padding: 2%;
  margin-top: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
}
.btnBox {
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  bottom: 20px;
}
.addBtn {
  width: 40%;
  height: 95%;
  background-color: #0d4f46;
  color: #a8a8a8;
  border-radius: 5px;
  border: 1px solid #11675c;
  box-shadow: 0 1px 3px 1px #262626;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
}
.addBtn:hover {
  background-color: #116b5f;
  transition-duration: 0.2s;
  color: #dfdfdf;
}
.addBtn:active {
  background-color: #0d4f46;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.cancelBtn {
  width: 40%;
  height: 95%;
  background-color: #2a2a2a;
  color: #a8a8a8;
  border-radius: 5px;
  border: 1px solid #414141;
  box-shadow: 0 1px 3px 1px #1c1c1c;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
}
.cancelBtn:hover {
  background-color: #d75442;
  transition-duration: 0.2s;
  color: #dfdfdf;
}
.cancelBtn:active {
  background-color: #b84738;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.optionsBox {
  width: 100%;
  height: 13%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.optionsBox img {
  width: 16%;
  opacity: 0.5;
}
.optionsDetails {
  width: 80%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.optionsDetails .category {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
}
.optionsName {
  width: 99%;
  height: 45%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  margin-top: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.optionsName span {
  height: 100%;
  padding: 2px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #b3b3b3;
  text-align: center;
  align-self: center;
  text-transform: uppercase;
}
</style>
