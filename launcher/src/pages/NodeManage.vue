<template>
  <section id="parent">
    <node-header id="head"></node-header>
    <node-bg>
      <div class="manage-parent">
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
        <div class="config-box">
          <div class="config-node"></div>
        </div>
        <div class="consensus">
          <the-trapezium> </the-trapezium>
        </div>
        <div class="validator">
          <the-trapezium> </the-trapezium>
        </div>
        <div class="execution">
          <the-trapezium> </the-trapezium>
        </div>

        <div class="service">
          <div class="title">SERVICE PLUGIN</div>
          <div class="service-container"></div>
        </div>
        <div class="change-menu">
          <div class="confirm-box">
            <div class="confirm-bg">
              <div class="check-icon">
                <img
                  src="Img/icon/manage-node-icons/check-mark.png"
                  alt="icon"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar">
          <sidebar-manage> </sidebar-manage>
        </div>

        <div class="footer">
          <div class="footer-content"></div>
        </div>
      </div>
    </node-bg>
  </section>
</template>

<script>
import TheTrapezium from "../components/UI/TheTrapezium.vue";
import SidebarManage from "../components/UI/node-manage/SidebarManage.vue";

export default {
  components: {
    TheTrapezium,
    SidebarManage,
  },
};
</script>

<style scoped>
#parent {
  box-sizing: border-box;
  padding: 0;
}

#head {
  position: fixed;
  top: 0;
  z-index: 100;
}
.manage-parent {
  display: grid;
  height: 92%;
  grid-template-columns: 3% 17% 45% 20% 15%;
  grid-template-rows: 8% repeat(3, 29%) 4.5%;
  grid-row-gap: 1px;
  position: relative;
  top: 9%;
}

.menu-side {
  grid-column-start: 1;
  grid-row: 1/6;
  background-color: transparent;
  width: 100%;
  position: relative;
}
.menu-background {
  grid-row: 1/5;
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

.config-box {
  color: white;
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 2/5;
  align-self: center;
  background-color: transparent;
}
.config-node {
  width: 90%;
  height: 90%;
  background-color: #33393e;
  border-radius: 0 30px 30px 30px;
}
.consensus {
  grid-column: 3/4;
  grid-row: 2/3;
  height: 100%;
  align-self: center;
}
.validator {
  grid-column: 3/4;
  grid-row: 3/4;
  color: white;
  align-self: center;
  box-sizing: border-box;
  height: 100%;
}
.execution {
  grid-column: 3/4;
  grid-row: 4/5;
  color: white;
  align-self: center;
  box-sizing: border-box;
  height: 100%;
}
.service {
  grid-column: 4/5;
  grid-row: 1/5;
  background: #336666;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.title {
  height: 5%;
  background: #000;
  margin: 1rem 0;
  font-weight: bold;
  padding: 0.5px;
  text-align: center;
  font-size: 90%;
}
.service-container {
  width: 90%;
  height: 85%;
  background: #4f4f4f;
  align-self: center;
  border-radius: 20px;
  overflow: hidden;
  padding: 5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.btn {
  width: 90%;
  margin: 3%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-self: center;
  overflow: hidden;
}
.arrow-up {
  width: 0;
  height: 50%;
  border-bottom: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
  resize: both;
}
.arrow-down {
  width: 0;
  height: 50%;
  border-top: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
}
.change-menu {
  grid-row: 1/5;
  grid-column: 5/6;
  margin: 0 5px;
  background: #334b3f;
  border: solid #1a2620;
  border-width: 1px 6px;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 4px;
}
.change-menu .confirm-box {
  width: 100px;
  height: 100px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .confirm-bg {
  width: 80px;
  height: 80px;
  background-color: #232628;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .check-icon {
  width: 70px;
  height: 70px;
  background-color: #33393e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu img {
  width: 40px;
  height: 40px;
}
.footer {
  color: white;
  grid-column: 1/7;
  grid-row: 5;
  background-color: gray;
  border-radius: 0 0 1.9rem 1.9rem;
  position: relative;
}
/* .footer-content {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  background-color: rgb(195, 21, 21);
} */
</style>
