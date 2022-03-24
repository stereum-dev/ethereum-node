<template>
  <div class="verify-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="verify-modal-parent">
        <div class="verify-modal">
          <div class="verify-box">
            <div class="verify-title-box">
              <div class="verify-title">
                <span>VERIFY & INSTALL</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="table-box">
              <div class="table">
                <div class="table-row"></div>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/install' }">
              <button class="back-btn">BACK</button>
            </router-link>
            <router-link :to="{ path: '/verify' }">
              <button class="next-btn">INSTALL</button>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<style scoped>
.verify-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-bg {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
}
.verify-modal-parent {
  width: 75%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 14%;
  left: 13%;
  z-index: 2;
}
.verify-modal {
  width: 70%;
  height: 90%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.verify-box {
  width: 95%;
  height: 25%;
  background-color: #c2bebe;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.verify-title-box {
  width: 95%;
  height: 80%;
  border-radius: 20px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.verify-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
}

.content-box {
  width: 95%;
  height: 53%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.table-box {
  width: 100%;
  height: 99%;
  background-color: #5b5b5b;
  border-radius: 15px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 95%;
  height: 90%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 55%;
  height: 60%;
  border: 2px solid rgb(103, 103, 103);
  border-radius: 20px;
  background-color: #336666;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 4px 1px rgb(23, 23, 23),
    inset 1px 1px 3px 1px rgb(147, 159, 147);
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(23, 23, 23),
    inset 1px 1px 5px 1px rgb(67, 86, 67);
}
.next-btn:active,
.back-btn:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}
</style>
