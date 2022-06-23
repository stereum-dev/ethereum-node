<template>
  <ul class="router__items">
    <li class="router__item">
      <router-link to="/node">NODE</router-link>
    </li>
    <span class="border"></span>
    <li class="router__item">
      <router-link to="/control">CONTROL</router-link>
    </li>
    <span class="border"></span>
    <li class="router__item">
      <router-link to="/staking">STAKING</router-link>
    </li>
  </ul>
</template>
<style scoped>
.router__items {
  width: 30%;
  max-width: 450px;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 80px 0 60px;
}
.router__items .router__item {
  width: 30%;
  max-width: max-content;
  height: 90%;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.router__items .router__item a {
  width: 100%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  color: #c2c2c2;
  transition-duration: 100ms;
}
.router__items .router__item a:hover {
  transform: scale(1.02);
  color: #3a8074;
  transition-duration: 50ms;
  text-shadow: 2px 2px #192c27;
}
.router__items .router__item a:active {
  transform: scale(1);
  color: #3a8074;
  text-shadow: none;
}
span.border {
  content: "";
  width: 0;
  height: 60%;
  border: 1px solid #a5a5a5;
}
</style>
