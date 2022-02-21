<template>
  <div class="menu-side">
    <div class="menu-background"></div>
    <div class="menu-box">
      <div class="menu">
        <router-link to="/node">
          <img
            class="home-icon"
            src="/img/icon/manage-node-icons/home-item-icon.png"
            alt="icon"
          />
        </router-link>
        <router-link to="/manage">
          <img
            class="manage-icon"
            src="/img/icon/manage-node-icons/manage-item-icon.png"
            alt="icon"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.menu-side {
  grid-column-start: 1;
  grid-row: 1/6;
  background-color: transparent;
  width: 100%;
  position: relative;
}
.menu-background {
  grid-row: 1/4;
  background-color: #336666;
  height: 100%;
  clip-path: polygon(0 0, 100% 0%, 40% 100%, 0% 100%);
  z-index: -3;
}
.menu-box {
  position: absolute;
  top: 0;
  width: 100%;
  height: 80%;
  background: #a1c1ad;
  z-index: 0;
}
.menu {
  position: absolute;
  bottom: 0;
  width: 95%;
  height: 90%;
  background: #1c4545;
  border-bottom-right-radius: 100% 15%;
  border-top-left-radius: 100% 15%;
}
.menu .home-icon {
  border-radius: 100%;
  outline-style: none;
  width: 25px;
  margin-top: 50px;
}
.menu .manage-icon {
  border-radius: 100%;
  outline-style: none;
  width: 25px;
  margin-top: 10px;
}
</style>
