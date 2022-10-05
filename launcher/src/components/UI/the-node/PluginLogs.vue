<template>
  <div class="pluginLog-parent">
    <div class="logsContainer">
      <div class="logsHeader">
        <div class="title">
          <img src="/img/icon/plugin-menu-icons/log-icon.png" alt="icon" />
          <span>PLUG-IN LOGS</span>
        </div>
        <div class="serviceDetails">
          <div class="serviceIcon">
            <img :src="item.icon" alt="icon" />
          </div>
          <div class="serviceName">
            <span>{{ item.name }}</span>
          </div>
          <div class="categoryBox">
            <p class="category">
              {{ item.category
              }}<span v-if="item.category != 'service'"> client</span>
            </p>
            <span id="serviceVersion">{{ item.config.imageVersion }}</span>
          </div>
        </div>
        <div class="closeBox" @click="$emit('closeLog')">
          <img src="/img/icon/plugin-menu-icons/close12.png" alt="icon" />
        </div>
      </div>
      <div class="logsTable">
        <template v-if="logsList.length">
          <div class="tableRow" v-for="(log, idx) in logsList" :key="idx">
            <div class="rowMsg">
              <span>{{ log.message }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="tableRow">
            <span>No log found in the list</span>
          </div>
        </template>
      </div>
      <div class="logsFooter">
        <div class="textBox">
          <span>Click on the logs to copy</span>
        </div>
        <div class="searchBox">
          <input
            id="search"
            type="text"
            placeholder="Search"
            v-model="searchValue"
          />
        </div>
        <div class="serviceBox">
          <span>service id:</span>
          <span>{{ item.config.serviceID }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      logs: [
        {
          message:
            "Sep 29 10:39:31.116 INFO ENR Initialised                         tcp: Some(9000), udp: None, ip: None, id: 0xb757..c893, seq: 1, enr: enr:-K24QJU_psLTSbaXi997ykdbRZQNKPHqOoZf8mRGSndOkXOJeKfflg5AIUxSsXe35DPkMhF0LWytEcEXP5r2D6PdU5oBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDCzjqoAgAQIP__________gmlkgnY0iXNlY3AyNTZrMaEDW90lu54VBNTtjgkGIjb47yrPLlnCQY3k_ME-5crRQTaIc3luY25ldHMAg3RjcIIjKA, service: libp2p",
        },
        {
          message:
            "Sep 29 10:39:31.116 INFO ENR Initialised                         tcp: Some(9000), udp: None, ip: None, id: 0xb757..c893, seq: 1, enr: enr:-K24QJU_psLTSbaXi997ykdbRZQNKPHqOoZf8mRGSndOkXOJeKfflg5AIUxSsXe35DPkMhF0LWytEcEXP5r2D6PdU5oBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDCzjqoAgAQIP__________gmlkgnY0iXNlY3AyNTZrMaEDW90lu54VBNTtjgkGIjb47yrPLlnCQY3k_ME-5crRQTaIc3luY25ldHMAg3RjcIIjKA, service: libp2p",
        },
        {
          message:
            "Sep 29 10:39:31.116 maxi INFO ENR Initialised                         tcp: Some(9000), udp:maxi None, ip: None, id: 0xb757..c893, seq: 1, enr: enr:-K24QJU_psLTSbaXi997ykdbRZQNKPHqOoZf8mRGSndOkXOJeKfflg5AIUxSsXe35DPkMhF0LWytEcEXP5r2D6PdU5oBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDCzjqoAgAQIP__________gmlkgnY0iXNlY3AyNTZrMaEDW90lu54VBNTtjgkGIjb47yrPLlnCQY3k_ME-5crRQTaIc3luY25ldHMAg3RjcIIjKA, service: libp2p",
        },
        {
          message:
            "Sep 29 10:39:31.116 characters INFO ENR Initialised                         tcp: Some(9000), udp: None, ip: None, id: 0xb757..c893, seq: 1, enr: enr:-K24QJU_psLTSbaXi997ykdbRZQNKPHqOoZf8mRGSndOkXOJeKfflg5AIUxSsXe35DPkMhF0LWytEcEXP5r2D6PdU5oBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDCzjqoAgAQIP__________gmlkgnY0iXNlY3AyNTZrMaEDW90lu54VBNTtjgkGIjb47yrPLlnCQY3k_ME-5crRQTaIc3luY25ldHMAg3RjcIIjKA, service: libp2p",
        },
      ],
      searchValue: "",
    };
  },
  computed: {
    logsList() {
      if (this.searchValue.trim().length > 0) {
        return this.logs.filter((log) =>
          log.message.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      }
      return this.logs;
    },
  },
};
</script>
<style scoped>
.pluginLog-parent {
  width: 100%;
  height: 91%;
  background-color: #32564f;
  background-color: #242529;
  border-radius: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.logsContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 4px solid rgb(156, 156, 156);
  border-radius: 10px;
}
.logsHeader {
  width: 100%;
  height: 10%;
  border-bottom: 4px solid rgb(156, 156, 156);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logsHeader .title {
  width: 50%;
  height: 100%;
  color: rgb(203, 202, 202);
  display: flex;
  justify-content: center;
  align-items: center;
}
.logsHeader .title img {
  width: 5%;
}
.logsHeader .title span {
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 10px;
}
.logsHeader .serviceDetails {
  width: 45%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: 1fr;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 5px;
}
.logsHeader .serviceDetails .serviceIcon {
  grid-column: 1/2;
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logsHeader .serviceDetails img {
  width: 60%;
}
.logsHeader .serviceDetails .serviceName {
  grid-column: 2/7;
  grid-row: 1/2;
  width: max-content;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  margin-left: 3%;
}
.serviceDetails .serviceName span {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(202, 205, 206);
}
.logsHeader .serviceDetails .categoryBox {
  grid-column: 7/10;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-left: 5%;
}
.logsHeader .closeBox {
  width: 5%;
  height: 100%;
  padding: 0.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.logsHeader .closeBox img {
  width: 93%;
  height: 100%;
}
.logsHeader .closeBox img:active {
  transform: scale(0.9);
}
.categoryBox .category,
.categoryBox .category span {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: left;
  color: rgb(202, 205, 206);
  text-transform: uppercase;
}
#serviceVersion {
  width: max-content;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: left;
  color: rgb(202, 205, 206);
}
.logsTable {
  width: 100%;
  height: 80%;
  background: #3b4146;
  display: flex;
  padding: 5px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.logsTable::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.logsTable::-webkit-scrollbar-track {
  background: transparent;
}
.logsTable::-webkit-scrollbar-thumb {
  background-color: #32564f;
  border-radius: 10px;
  cursor: pointer;
}
.logsTable::-webkit-scrollbar-thumb:horizontal {
  background-color: #32564f;
  border-radius: 10px;
  cursor: pointer;
}
.logsTable::-webkit-scrollbar-thumb:hover {
  background-color: #4a7d73;
}
.logsTable::-webkit-scrollbar-thumb:hover {
  background-color: #4a7d73;
}
.logsTable::-webkit-scrollbar-corner {
  background: transparent;
}
.tableRow {
  width: 100%;
  min-height: 35px;
  margin-top: 5px;
  padding: 2px 5px;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
  overflow-y: hidden;
  overflow-x: auto;
}
.tableRow::-webkit-scrollbar {
  height: 5px;
  background: transparent;
  padding: 0 20px;
}
.tableRow::-webkit-scrollbar-thumb {
  background-color: #3c6283;
  border-radius: 10px;
  cursor: pointer;
  margin: 0 20px;
}
.tableRow::-webkit-scrollbar-thumb:hover {
  background-color: #3e78ab;
}
.logsTable .tableRow:nth-child(odd) {
  background-color: #4c5157;
}
.tableRow:nth-child(even) {
  background-color: #2d2e34;
}
.rowMsg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: normal;
}

.rowMsg span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: pre;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(203, 202, 202);
  margin-left: 10px;
}

.logsFooter {
  width: 100%;
  height: 10%;
  border-top: 4px solid rgb(156, 156, 156);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 100%;
  align-items: center;
}
.logsFooter .textBox {
  grid-column: 1/4;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logsFooter .textBox span {
  font-size: 0.9rem;
  color: #d8d8d8;
  font-weight: 600;
  margin-left: 20%;
}

.logsFooter .searchBox {
  grid-column: 5/10;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-right: 1rem;
}

.logsFooter .searchBox input {
  width: 80%;
  height: 70%;
  background-color: #d8d8d8;
  border-radius: 5px;
  border: none;
  outline: none;
  color: rgb(101, 101, 101);
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0 0.5rem;
}
.logsFooter .serviceBox {
  grid-column: 9/13;
  grid-row: 1/2;
  width: 97%;
  height: 70%;
  border: 2px solid rgb(156, 156, 156);
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.logsFooter .serviceBox span:first-child {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #c4c4c4;
}
.logsFooter .serviceBox span:last-child {
  font-size: 0.7rem;
  font-weight: 400;
  color: #d8d8d8;
}
</style>
