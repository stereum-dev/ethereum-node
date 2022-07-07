<template>
  <div class="nodeConParent">
    <div class="nodConBox">
      <node-connection-row row-name="RPC-ENDPOINT"></node-connection-row>
      <node-connection-row row-name="DATA-API"></node-connection-row>
    </div>
    <div class="compTtl"><span>NODE CONNECTIONS</span></div>
  </div>
</template>
<script>
import NodeConnectionRow from "./NodeConnectionRow.vue";
export default {
  components: { NodeConnectionRow },
};
</script>
<style scoped>
.nodeConParent {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  width: 38%;
  height: 95%;
  border-radius: 15px;
  flex-direction: column;
}

.nodConBox {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.compTtl {
  display: flex;
  width: 100%;
  height: 20%;
  font-size: 40%;
  justify-content: center;
  align-items: center;
}
</style>
