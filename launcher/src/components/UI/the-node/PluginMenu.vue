<template>
  <div class="menu-parent">
    <div class="menu-content">
      <div class="power">
        <img
          v-if="isServiceOn"
          src="/img/icon/plugin-menu-icons/shutdown.png"
          alt="icon"
        />
        <img v-else src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" />
      </div>
      <div class="book">
        <img src="/img/icon/plugin-menu-icons/book3.png" alt="icon" />
      </div>
      <div class="restart">
        <img src="/img/icon/plugin-menu-icons/refresh2.png" alt="icon" />
      </div>
      <div class="setting">
        <img src="/img/icon/plugin-menu-icons/setting1.png" alt="icon" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isServiceOn: false,
    };
  },
};
</script>
<style scoped>
.menu-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1;
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
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(10px, -31px);
  position: fixed;
}
.power img {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}

.book {
  grid-column: 2/3;
  grid-row: 1/2;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(51px, 10px);
  position: fixed;
}
.book img {
  width: 25px;
  height: 25px;
  border: 2px solid rgb(225, 225, 225);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.restart {
  grid-column: 1/2;
  grid-row: 2/3;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-32px, 10px);
  position: fixed;
}
.restart img {
  width: 25px;
  height: 25px;
  border: 2px solid rgb(225, 225, 225);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.setting {
  grid-column: 2/3;
  grid-row: 2/3;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 30.1%;
  left: 30.4%;
}
.setting img {
  width: 90%;
  height: 90%;
  border: 2px solid rgb(225, 225, 225);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
}
.power img:hover,
.book img:hover,
.restart img:hover,
.setting img:hover {
  transform: scale(1.1);
}

.book img:active,
.restart img:active,
.setting img:active,
.power img:active {
  transform: scale(1);
}
@keyframes slide {
  0% {
    width: 20px;
    height: 20px;
    top: 25%;
    left: 32%;
  }
  50% {
    width: 25px;
    height: 25px;
    top: 30%;
    left: 30.7%;
  }
  100% {
    width: 28px;
    height: 28px;
    top: 30.1%;
    left: 30.4%;
  }
}
/* @keyframes slide {
  0% {
    top: 25%;
    left: 32%;
  }
  50% {
    top: 30%;
    left: 32%;
  }
  100% {
    width: 30px;
    height: 30px;
    top: 30%;
    left: 30%;
  }
} */

.setting,
.book,
.power,
.restart {
  animation: slide 1s linear;
}
</style>
