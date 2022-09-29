<template>
  <div class="pluginLog-parent">
    <div class="logsContainer">
      <div class="logsHeader"></div>
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
        <span @click="$emit('closeLog')">close</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logs: [
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
.logsTable {
  width: 100%;
  height: 80%;
  display: flex;
  padding: 5px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
}
.logsTable::-webkit-scrollbar {
  width: 5px;
}
.logsTable::-webkit-scrollbar-track {
  background: transparent;
}
.logsTable::-webkit-scrollbar-thumb {
  background-color: #32564f;
  border-radius: 10px;
}
.logsTable::-webkit-scrollbar-thumb:hover {
  background-color: #242529;
}
.tableRow {
  width: 100%;
  height: 10%;
  min-height: 30px;
  margin-top: 5px;
  padding: 2px 5px;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logsTable .tableRow:nth-child(odd) {
  background-color: #5a5b61;
}
.tableRow:nth-child(even) {
  background-color: #383a43;
}
.logsFooter {
  width: 100%;
  height: 10%;
  border-top: 4px solid rgb(156, 156, 156);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
