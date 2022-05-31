<template>
  <nav class="main-nav1">
    <ul class="main-nav__items">
      <li class="main-nav__item main-nav__item--cta">
        <router-link :to="{ path: '/node' }"><a>NODE</a></router-link>
      </li>
      <li class="main-nav__item">
        <router-link :to="{ path: '/control' }"><a>CONTROL</a></router-link>
      </li>
      <li class="main-nav__item">
        <router-link :to="{ path: '/staking' }"><a>STAKING</a></router-link>
      </li>

      <li class="spacer"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
      <li class="box__item"></li>
    </ul>
    <ul class="main-nav__items main-nav__items2">
      <li class="spacer"></li>
      <li class="btn__item">
        <input
          type="image"
          id="image"
          alt="Login"
          src="/img/icon/HELP_BUTTON.png"
        />
      </li>

      <li class="btn__item">
        <input
          type="image"
          id="image"
          alt="Login"
          src="/img/icon/PHONE_ICON.png"
        />
      </li>

      <li class="btn__item">
        <input
          type="image"
          id="image"
          alt="Login"
          src="/img/icon/UPDATE_ICON.png"
        />
      </li>

      <li class="btn__item">
        <input
          type="image"
          id="image"
          alt="Login"
          src="/img/icon/SETTING_ICON.png"
        />
      </li>

      <li class="btn__item">
        <input
          type="image"
          id="image"
          alt="Login"
          src="/img/icon/EXIT_ICON.png"
        />
      </li>
    </ul>
  </nav>
</template>
<style scoped>
.main-nav1 {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 74px);
  vertical-align: middle;
  margin-left: 8%;
}

.main-nav__items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: spa;
  align-items: center;
}
.main-nav__items2 {
  margin-right: 20px;
}

.main-nav__item {
  margin: 0 0.5rem;
}

.box__item {
  margin: 0 0.5rem;
  width: 1rem;
  height: 1rem;
  border: 1px solid rgb(180, 179, 179);
  display: none;
}

.btn__item input {
  width: 70%;
  justify-self: end;
  align-self: flex-end;
}
.btn__item:hover {
  outline: none;
}
.spacer {
  margin: 0 0.8rem;
  width: 3pt;
  height: 1.2rem;
  background: grey;
  border: 1px solid rgb(180, 179, 179);
}

.main-nav__item a {
  text-decoration: none;
  color: #eee;
  font-weight: bold;
  padding: 0 0;
  font-size: 1.4rem;
}

.main-nav__item a:hover,
.main-nav__item a:active {
  color: #97ddff;
}

.main-nav__item--cta a {
  color: #a1c1ad;
}

.main-nav__item--cta a:hover,
.main-nav__item--cta a:active {
  color: #97ddff;
  border: none;
}
</style>
