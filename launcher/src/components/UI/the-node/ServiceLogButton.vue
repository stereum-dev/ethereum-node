<template>
  <div class="service-log-button_parent" @click="openLog">
    <div class="service-icon_box">
      <img
        src="/img/icon/plugin-icons/consensus/LightHouse.png"
        alt="client-icon"
      />
    </div>
    <div class="service-title-type_box">
      <div class="title">
        <span>{{ clientName }}</span>
      </div>
      <div class="type">
        <span>{{ clientType }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["img", "clientName", "clientType", "gridRow"],
  emit: ["open-log"],
  methods: {
    openLog() {
      this.$emit("open-log");
    },
  },
};
</script>
<style scoped>
.service-log-button_parent {
  width: 90%;
  min-height: 2.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2% 0;
  background-color: #242529;
  font-weight: 800;
  text-transform: uppercase;
  border: 1px solid #787878;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.service-log-button_parent:hover {
  background-color: #18191c;
}
.service-log-button_parent:active {
  box-shadow: none;
  transform: scale(0.99);
}
.service-icon_box img {
  width: 80%;
}
.service-icon_box {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-title-type_box {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50%;
  font-size: 60%;
  font-weight: 700;
}
.type {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50%;
  font-size: 50%;
  font-weight: 600;
  color: #cfaf65;
}
</style>
