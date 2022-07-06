<template>
  <div class="nodeConParent">
    <div class="nodConBox">
      <div class="rowStatus">
        <!-- <div class="title"><span>RPC-ENDPOINT</span></div> -->
        <div class="btn" :class="{ active: isActive }" @click="toggle">
          <span>{{ isActive ? "RPC-ENDPOINT ON" : "RPC-ENDPOINT OFF" }}</span>
        </div>
      </div>
      <div class="rowStatus">
        <!-- <div class="title"><span>DATA-API</span></div> -->
        <div class="btn" :class="{ active: isActive }" @click="toggle">
          <span>{{ isActive ? "DATA-API ON" : "DATA-API OFF" }}</span>
        </div>
      </div>
    </div>
    <div class="compTtl"><span>NODE CONNECTIONS</span></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },

  methods: {
    toggle() {
      this.isActive = this.isActive ? false : true;
    },
  },
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
.rowStatus {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;

  border-radius: 10px;
  margin: 5% 0;
}
.active {
  color: greenyellow !important;
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
.title {
  display: flex;
  width: 70%;
  font-size: 48%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 4%;
}
.btn {
  display: flex;
  width: 100%;
  font-size: 50%;
  font-weight: bold;
  padding: 0 2px;
  border-radius: 10px;
  cursor: pointer;
  color: red;
  justify-content: center;
  align-items: center;
}
</style>
