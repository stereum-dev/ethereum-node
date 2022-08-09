<template>
  <div class="panelParent">
    <div class="panelOpacity" @click="$emit('removeModal')"></div>
    <div class="panelContent">
      <div class="stereumUpdates">
        <div class="stereumUpdates-title">
          <span class="title">Stereum updates</span>
          <span class="description"
            >After downloading and installing the update Stereum will be
            restarted</span
          >
        </div>
        <div class="stereum-updateBox">
          <div class="versionBox"></div>
          <div class="btnBox"></div>
        </div>
      </div>
      <div class="serviceUpdates">
        <div class="serviceUpdates-title">
          <span class="title">Service updates</span>
          <span class="description"
            >After an Service update the service in question will be
            restarted</span
          >
        </div>
        <div class="service-updateBox"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.panelParent {
  width: 50%;
  height: 91%;
  position: fixed;
  top: 10%;
  right: -37%;
  z-index: 310;
  transition-duration: 300ms;
}
.panelOpacity {
  width: 100%;
  height: 91%;
  position: fixed;
  left: 0;
  top: 52px;
  border-radius: 0 35px 0 0;
  z-index: 311;
}
.panelContent {
  width: 72%;
  height: 100%;
  border-radius: 1rem 0 0 1rem;
  background-color: #343434;
  border: 2px solid rgb(107, 107, 107);
  border-right: none;
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: -6px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stereumUpdates {
  width: 100%;
  height: 40%;
}
.serviceUpdates {
  width: 100%;
  height: 60%;
}
.stereumUpdates-title,
.serviceUpdates-title {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.stereumUpdates-title .title,
.serviceUpdates-title .title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #acacac;
  margin-left: 15px;
  text-transform: uppercase;
}
.description,
.description {
  font-size: 0.6rem;
  font-weight: 400;
  color: #f7f7f7;
  margin-left: 15px;
}
.stereum-updateBox {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-updateBox {
  width: 100%;
  height: 75%;
}
</style>
