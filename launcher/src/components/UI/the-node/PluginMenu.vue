<template>
  <div class="menu-parent">
    <div class="menu-content">
      <div class="power">
        <img src="/img/icon/plugin-menu-icons/shutdown.png" alt="icon" />
        <img src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" />
      </div>
      <div class="book">
        <img src="/img/icon/plugin-menu-icons/open-book.png" alt="icon" />
      </div>
      <div class="restart">
        <img src="/img/icon/plugin-menu-icons/refresh.png" alt="icon" />
      </div>
      <div class="setting">
        <img src="/img/icon/plugin-menu-icons/setting.png" alt="icon" />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.menu-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-column: repeat(2, 1fr);
  grid-row: repeat(2, 1fr);
}
.power {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  background: #000;
  border: 1px solid rgb(233, 233, 233);
  border-radius: 5px;
}
.power img {
  width: 18px;
  height: 18px;
}
.book {
  grid-column: 2/3;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  background: #000;
  border: 1px solid rgb(233, 233, 233);
  border-radius: 5px;
}
.book img {
  width: 18px;
  height: 18px;
}
.restart {
  grid-column: 1/2;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  background: #000;
  border: 1px solid rgb(233, 233, 233);
  border-radius: 5px;
}
.restart img {
  width: 18px;
  height: 18px;
}
.setting {
  grid-column: 2/3;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  background: #000;
  border: 1px solid rgb(233, 233, 233);
  border-radius: 5px;
}
.setting img {
  width: 18px;
  height: 18px;
}
</style>
