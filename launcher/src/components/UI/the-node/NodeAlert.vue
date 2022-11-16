<template>
  <div class="status-box">
    <control-alert></control-alert>
  </div>
</template>
<script>
import ControlAlert from "../the-control/ControlAlert.vue";
import { mapState } from "pinia";
import { useNodeStore } from "@/store/theNode";
export default {
  components: { ControlAlert },
  data() {
    return {};
  },
  computed: {
    ...mapState(useNodeStore, {
      newUpdates: "newUpdates",
      statusContents: "statusContents",
    }),
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.status-box {
  width: 100%;
  height: 45%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.status-box .warning-box {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}
.warning-box .yellow-warning {
  width: 70px;
  height: 30px;
  background-color: #fed506;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
}
.warning-box .red-warning {
  width: 70px;
  height: 30px;
  background-color: #f44444;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
}
.status-box .red-warning img,
.status-box .yellow-warning img {
  width: 25px;
}
.status-box .status-table {
  width: 95%;
  height: 75%;
  background-color: #2d2d34;
  margin: 5px auto;
  overflow: hidden;
  padding: 5px;
}
.status-table .status-table-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.status-table-content::-webkit-scrollbar {
  width: 1px;
}
.status-box .status-table-row {
  width: 100%;
  height: 20px;
}
.status-box .status-table-row .status-red {
  width: 100%;
  height: 100%;
  background-color: #f44444;
  margin-top: 3px;
}
.status-box .status-table-row .status-yellow {
  width: 100%;
  height: 100%;
  background-color: #f6ce07;
  margin-top: 3px;
}
</style>
