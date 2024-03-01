<template>
  <div class="update-parent">
    <div class="loading-icon">
      <img src="/animation/launcher-update/update-loading.gif" />
    </div>
    <div class="update-text">
      <span>{{ `${updateState.message}${updateState.MBps ? " " + updateState.MBps.toFixed(2) + " MBps" : ""}` }}</span>
    </div>
    <div v-if="updateState.state === 'downloading'" id="progressbar">
      <div :style="{ width: updateState.percent }"></div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      updateState: {
        state: "",
        message: "Starting Update...",
      },
    };
  },
  mounted() {
    ControlService.addListener("UpdateEvents", this.updateHandler);
  },
  unmounted() {
    ControlService.removeListener("UpdateEvents", this.updateHandler);
  },
  methods: {
    updateHandler(event, data) {
      this.updateState.MBps = data.data?.MBps;
      this.updateState.percent = data.data?.percent + "%";
      this.updateState.state = data.type;
      this.updateState.message = data.message;
    },
  },
};
</script>
<style>
.update-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: grey;
}
.loading-icon {
  display: flex;
  align-items: center;
}
.loading-icon img {
  margin-top: -300px;
  margin-bottom: -550px;
}
.update-text {
  font-size: 30px;
  font-weight: bold;
}
#progressbar {
  width: 80%;
  background-color: black;
  border-radius: 13px;
  padding: 3px;
}

#progressbar > div {
  background-color: orange;
  height: 20px;
  border-radius: 10px;
  transition: all 1s linear;
}
</style>
