<template>
  <ul class="router__items">
    <li class="router__item">
      <router-link :to="{ path: '/node' }">NODE</router-link>
    </li>
    <li class="router__item">
      <router-link :to="{ path: '/control' }">CONTROL</router-link>
    </li>
    <li class="router__item">
      <router-link :to="{ path: '/staking' }">STAKING</router-link>
    </li>
  </ul>
</template>
<style scoped>
.router__items {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 20px;
}
.router__items .router__item {
  width: 80%;
  height: 80%;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.router__items .router__item a {
  width: 80%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 800;
  color: #c2c2c2;
  text-shadow: 2px 2px #192c27;
  transition-duration:150ms;
}
.router__items .router__item a:hover {
  width: 90%;
  font-size: 1.28rem;
  font-weight: 900;
  color: #3a8074;
}
.router__items .router__item a:active {
  width: 90%;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3a8074;
  text-shadow: none;
}
</style>
