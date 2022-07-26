<template>
  <div class="rpc-parent">
    <div class="rpc-box">
      <node-connection-row row-name="RPC-ENDPOINT"></node-connection-row>
      <div
        class="rpc-data"
        v-for="item in rpcItems"
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
import NodeConnectionRow from "./NodeConnectionRow.vue";
export default {
  components: { NodeConnectionRow },
  data() {
    return {
      copyVal: "click to copy",
      rpcItems: [
        // rpcItems is dummy, for wire the have to change but the best stract. for the design is this one
        {
          id: 1,
          title: "GETH",
          value: "123456",
        },
      ],
    };
  },

  methods: {
    async copy(s, t) {
      await navigator.clipboard.writeText(s);
      this.copyVal = t + " copied";
    },
  },
};
</script>
<style scoped>
.rpc-parent {
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

.rpc-box {
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
.rpc-data {
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
</style>
