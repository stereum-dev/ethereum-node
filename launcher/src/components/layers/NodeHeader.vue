<template>

  <div class="parent">
    <div class="header"></div>
    <div>
      <img src="/img/icon/LOGO.png" class="main-header__brand" />
    </div>
    <header class="main-header">
      <nav class="main-nav1">
        <ul class="main-nav__items">
          <li class="main-nav__item main-nav__item--cta">
            <router-link :to="{ path: '/node' }"><a>NODE</a></router-link>
          </li>
          <li class="main-nav__item">
            <router-link :to="{ path: '/control' }"><a>CONTROL</a></router-link>
          </li>
          <li class="main-nav__item">
            <a href="customers/index.html">STAKING</a>
          </li>
          <li class="spacer"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="box__item"></li>
          <li class="spacer"></li>
          <li class="btn__item">
            <input
              type="image"
              id="image"
              alt="Login"
              src="/img/icon/HELP BUTTON.png"
            />
          </li>

          <li class="btn__item">
            <input
              type="image"
              id="image"
              alt="Login"
              src="/img/icon/PHONE ICON.png"
            />
          </li>

          <li class="btn__item">
            <input
              type="image"
              id="image"
              alt="Login"
              src="/img/icon/UPDATE ICON.png"
            />
          </li>

          <li class="btn__item">
            <input
              type="image"
              id="image"
              alt="Login"
              src="/img/icon/SETTING ICON.png"
            />
          </li>

          <li class="btn__item">
            <input
              type="image"
              id="image"
              alt="Login"
              src="/img/icon/EXIT ICON.png"
            />
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<style scoped>
.main-header {
  width: 100vw;
  background: #336666;
  padding: 1% 0;
  border-bottom: 5px solid gray;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}

.main-header__brand {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  z-index: 2;
}

.main-nav1 {
  text-align: left;
  width: calc(100% - 74px);
  vertical-align: middle;
  margin-left: 14%;
}

.main-nav__items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: spa;
  align-items: center;
}

.main-nav__item {
  margin: 0 0.5rem;
}

.box__item {
  margin: 0 0.5rem;
  width: 1rem;
  height: 1rem;
  border: 1px solid rgb(180, 179, 179);
}

.btn__item input {
  width: 70%;
}
.btn__item:hover {
  border: 1px solid #eee;
  border-radius: 40%;
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

