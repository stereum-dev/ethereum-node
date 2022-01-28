<template>
  <dialog open>
    <div class="formGroup">
      <label for="serverName">ServerName</label>
      <input name="serverName" id="serverName" type="text" ref="serverName" />
    </div>
    <div class="formGroup">
      <label for="localPort">LocalPort</label>
      <input name="localPort" id="localPort" type="text" ref="localPort" />
    </div>
    <div class="formGroup">
      <label for="DstPort">DstPort</label>
      <input name="DstPort" id="DstPort" ref="dstPort" />
    </div>
    <div class="formGroup" v-if="logError">
      <p>Please complete all filed!</p>
    </div>
    <div>
      <button @click="addServer" id="add">Add Server</button>

      <button @click="$emit('dialogDis', true)" id="canc">Cancel</button>
    </div>
  </dialog>
</template>
<script>
export default {
  name: "addDialog",
  emits: ["pass", "dialogDis"],
  data() {
    return {
      logError: false,
    };
  },
  methods: {
    addServer() {
      const serverName = this.$refs["serverName"].value;
      const localPort = this.$refs["localPort"].value;

      const dstPort = this.$refs["dstPort"].value;
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
  /* margin-right: 40px; */
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
