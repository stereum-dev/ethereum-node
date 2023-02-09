<template>
  <div class="service-log-button_parent" :style="{ gridRow: `${gridRow}` }">
    <div class="service-icon_box">
      <img :src="img" alt="client-icon" />
    </div>
    <div class="service-title-type_box">
      <div class="title">
        <span>{{ clientName }}</span>
      </div>
      <div class="title">
        <span>{{ clientType }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["img", "clientName", "clientType", "gridRow"],
};
</script>
<style scoped>
.service-log-button_parent {
  width: 95%;
  height: 80%;
  padding: 0 10px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: center;
  background-color: #242529;
  font-size: 0.7rem;
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
</style>
