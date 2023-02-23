<template>
  <dialog open>
    <div class="formGroup">
      <label for="serverName">ServerName</label>
      <input id="serverName" ref="serverName" name="serverName" type="text" />
    </div>
    <div class="formGroup">
      <label for="localPort">LocalPort</label>
      <input id="localPort" ref="localPort" name="localPort" type="text" />
    </div>
    <div class="formGroup">
      <label for="DstPort">DstPort</label>
      <input id="DstPort" ref="dstPort" name="DstPort" />
    </div>
    <div v-if="logError" class="formGroup">
      <p>Please complete all filed!</p>
    </div>
    <div>
      <button id="add" @click="addServer">Add Server</button>

      <button id="canc" @click="$emit('dialogDis', true)">Cancel</button>
    </div>
  </dialog>
</template>
<script>
export default {
  name: "AddDialog",
  emits: ["pass", "dialogDis"],
  data() {
    return {
      logError: false,
    };
  },
  methods: {
    addServer() {
      const serverName = this.$refs.serverName.value;
      const localPort = this.$refs.localPort.value;

      const dstPort = this.$refs.dstPort.value;
      if (serverName != "" && localPort != "" && dstPort != "") {
        const obj = {
          name: serverName,
          localPort: localPort,
          dstPort: dstPort,
        };

        this.$emit("pass", obj);
      } else {
        this.logError = true;
      }
    },
  },
};
</script>
<style scoped>
dialog {
  border-radius: 40px;
  background-color: rgba(248, 247, 247, 0.849);
  resize: both;
  border: solid 3px rgb(124, 119, 119);
  z-index: 100;
  opacity: 140%;
}
dialog label {
  text-align: right;
  clear: both;
  float: left;
  font-size: large;
}
dialog input {
  border-radius: 15px;

  float: right;
  text-align: right;
}
#add {
  border-radius: 15px 0 0 15px;
  background-color: rgb(124, 119, 119);
  font-weight: bold;
  color: #fff;
  margin-top: 10px;
}
#canc {
  border-radius: 0 15px 15px 0;
  background-color: rgb(124, 119, 119);
  font-weight: bold;
  color: #fff;
}
</style>
