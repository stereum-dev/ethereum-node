<template>
    <div class="parent">
      <div>
        <img src="/img/icon/LOGO.png" class="main-header__brand" />
      </div>
      <header class="main-header">
        <nav class="main-nav1">
          <ul class="main-nav__items">
            <li class="main-nav__item main-nav__item--cta">
              <a href="start-hosting/index.html">NODE</a>
            </li>
            <li class="main-nav__item">
              <a href="packages/index.html">CONTROL</a>
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
            <li class="btn__item"><input type="image" id="image" alt="Login"
                src="/img/icon/HELP BUTTON.png"></li>
            <li class="btn__item"><input type="image" id="image" alt="Login"
                src="/img/icon/PHONE ICON.png"></li>
            <li class="btn__item"><input type="image" id="image" alt="Login"
                src="/img/icon/UPDATE ICON.png"></li>
            <li class="btn__item"><input type="image" id="image" alt="Login"
                src="/img/icon/SETTING ICON.png"></li>
            <li class="btn__item"><input type="image" id="image" alt="Login"
                src="/img/icon/EXIT ICON.png"></li>
          </ul>
        </nav>
      </header>
    </div>
</template>

<style scoped>
.parent{
    position: relative;
}
.main-header {
    width: 100%;
    background: #336666;
    padding: 1% 0;
   border-bottom:5px solid gray;
}

.main-header > div {
    display: inline-block;
    vertical-align: middle;
}

.main-header__brand {
    position: absolute;
    top: 0;
  
}

.main-nav1 {
    display: inline-block;
    text-align: left;
    width: calc(100% - 74px);
    vertical-align: middle;
    margin-left: 12%;
}

.main-nav__items {
    margin: 0;
    padding: 0;
    list-style: none;
}

.main-nav__item {
    display: inline-block;
    margin: 0 10px;
}

.box__item{
    display: inline-block;
    margin: 0 10px;
    width: 25pt;
    height: 25pt;
    border: 1px solid rgb(180, 179, 179);
}
.btn__item{
    display: inline-block;
    margin: 0 4px;
}
.btn__item:hover{
border: 1px solid #eee;
border-radius: 40%;
}
.spacer{
    display: inline-block;
    margin: 0 10px;
    width: 3pt;
    height: 20pt;
    background: grey;
    border: 1px solid rgb(180, 179, 179);
}

.main-nav__item a {
    text-decoration: none;
    color: #eee;
    font-weight: bold;
    padding:0  0;
    font-size:25pt;
}

.main-nav__item a:hover,
.main-nav__item a:active {
    color: #97DDFF;
   
}

.main-nav__item--cta a {
    color: #A1C1AD;
    padding: 8px 16px;
    border-radius: 8px;
}

.main-nav__item--cta a:hover,
.main-nav__item--cta a:active {
    color: #97DDFF;
    border: none;
}
</style>