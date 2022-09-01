<template>
  <div class="dataApi-parent">
    <control-dialog v-if="openDialog"
      ><div class="dialogBox">
        <div class="dialogIcon"><img :src="copyIcon" /></div>
        <div class="dialogMessage">
          <span>{{ dialogValue }}</span>
        </div>
      </div></control-dialog
    >
    <div class="dataApi-box">
      <node-connection-row row-name="DATA-API"></node-connection-row>
      <div
        class="dataApi-data"
        v-for="item in dataApiItems"
        :key="item.id"
        ref="clone"
        @click="copy(item.value, item.title)"
      >
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="compTtl">
      <span>{{ copyVal }}</span>
    </div>
  </div>
</template>
<script>
import ControlDialog from "./ControlDialog.vue";
import NodeConnectionRow from "./NodeConnectionRow.vue";
export default {
  components: { NodeConnectionRow, ControlDialog },
  data() {
    return {
      copyVal: "click to copy",
      openDialog: false,
      dialogValue: "",
      copyIcon: "/img/icon/control/ok.png",
      dataApiItems: [
        // dataApiItems are dummy, for wire the have to change but the best stract. for the design is this one
        {
          id: 1,
          title: "TEKU",
          value: "11111",
        },
        {
          id: 2,
          title: "LIGHTHOUSE",
          value: "22222",
        },
      ],
    };
  },

  methods: {
    async copy(s, t) {
      await navigator.clipboard.writeText(s);
      this.copyVal = t + " copied";
      this.openDialog = !this.openDialog;
      this.dialogValue = t + " " + "Copied to clipboard!";
      if (this.openDialog === true) {
        setTimeout(() => {
          this.openDialog = false;
        }, 3000);
      }
    },
  },
};
</script>
<style scoped>
.dataApi-parent {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  width: 38%;
  height: 95%;
  border-radius: 10px;
  flex-direction: column;
}

.dialogBox {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}
.dialogIcon {
  display: flex;
  height: 100%;
  width: 20%;
  justify-content: center;
  align-items: center;
}
.dialogIcon img {
  width: 50%;
}
.dialogMessage {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 100%;
  font-weight: 600;
  font-size: 80%;
}
.rpc-box {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.dataApi-box {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.compTtl {
  display: flex;
  width: 100%;
  height: 20%;
  font-size: 50%;
  justify-content: center;
  align-items: center;
}
.dataApi-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
  height: 27%;
  margin: 2% 0;
  padding: 2%;
  font-size: 55%;
  border: 1px solid #707070;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}
.dataApi-data:hover,
.dataApi-data:active {
  color: rgb(246, 250, 141);
  font-weight: 800;
  background: #313131;
}
</style>
