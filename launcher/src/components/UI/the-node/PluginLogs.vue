<template>
  <div class="pluginLog-parent">
    <div class="logsContainer">
      <div class="logsHeader">
        <div class="title">
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
      </div>
      <div class="logsTable">
        <div class="tableRow" v-for="(log, idx) in logs" :key="idx">
          <div class="rowDate">
            <span>{{ log.date }}</span>
          </div>
          <div class="rowStatus">
            <span>{{ log.status }}</span>
          </div>
          <div class="rowMsg">
            <span>{{ log.message }}</span>
          </div>
          <div class="rowDescription">
            <span>{{ log.description }}</span>
          </div>
        </div>
      </div>
      <div class="logsFooter">
        <div class="serviceId">
          <span>{{ item.config.serviceId }}</span>
        </div>
        <div class="searchBox"></div>
        <div class="closeBtn" @click="$emit('closeLog')">
          <span>close</span>
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
          date: "Sep 29 10:39:31.116",
          status: "INFO",
          message: "ENR Initialised",
          description:
            " tcp: Some(9000), udp: None, ip: None, id: 0xb757..c893, seq: 1, enr: enr:-K24QJU_psLTSbaXi997ykdbRZQNKPHqOoZf8mRGSndOkXOJeKfflg5AIUxSsXe35DPkMhF0LWytEcEXP5r2D6PdU5oBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDCzjqoAgAQIP__________gmlkgnY0iXNlY3AyNTZrMaEDW90lu54VBNTtjgkGIjb47yrPLlnCQY3k_ME-5crRQTaIc3luY25ldHMAg3RjcIIjKA, service: libp2p",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfvhis is a warning message,asdfaklsv asvasfdv asfdvasdfvasfvhis is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfva warning message,asdfaklsv asvasfdv asfdvasdfvasfva warning message,asdfaklsv asvasfdv asfdvasdfvasfva warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfvasdfaklsv asvasfdv asfdvasdfvasfvasdfaklsv asvasfdv asfdvasdfvasfvasdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
        {
          date: "Aug 20 2021 12:00:00",
          status: "WARN",
          message: "this is a warning message",
          description:
            "This is a warning message,asdfaklsv asvasfdv asfdvasdfvasfv",
        },
      ],
    };
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 1rem;
}
.logsHeader .serviceDetails {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 2px 5px;
}
.logsHeader .serviceDetails .serviceIcon {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logsHeader .serviceDetails img {
  width: 90%;
  height: 80%;
}
.logsHeader .serviceDetails .serviceName {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.serviceDetails .serviceName span {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(62, 114, 116);
  margin-left: 10px;
}
.logsHeader .serviceDetails .categoryBox {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.categoryBox .category,
.categoryBox .category span {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: left;
  color: rgb(62, 114, 116);
  text-transform: uppercase;
}
#serviceVersion {
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  color: rgb(62, 114, 116);
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
  overflow-y: auto;
  overflow-x: auto;
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
  min-width: 100%;
  width: max-content;
  height: 10%;
  min-height: 30px;
  margin-top: 5px;
  padding: 2px 5px;
  border-radius: 25px;
  display: grid;
  grid-template-columns: 200px 50px 250px auto;
  grid-template-rows: 100%;
  align-self: flex-start;
}
.logsTable .tableRow:nth-child(odd) {
  background-color: #424242;
}
.tableRow:nth-child(even) {
  background-color: #2d2e34;
}
.rowDate {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rowStatus {
  grid-column: 2/3;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rowMsg {
  grid-column: 3/4;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rowDescription {
  grid-column: 4/5;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rowStatus span {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(221, 221, 221);
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
.logsFooter .serviceId {
  grid-column: 2/5;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 1rem;
}
.logsFooter .serviceId span {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgb(62, 114, 116);
}
.logsFooter .searchBox {
  grid-column: 5/11;
  width: 100%;
  height: 100%;
  background-color: rgb(137, 137, 137);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 1rem;
}
.logsFooter .closeBtn {
  grid-column: 11/13;
  width: 70%;
  height: 70%;
  background-color: rgb(240, 96, 96);
  border-radius: 5px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.closeBtn span {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(221, 221, 221);
  text-transform: uppercase;
}
</style>
