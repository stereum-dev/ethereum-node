<template>
  <div class="nodeparent">
    <div class="asside">
      <div class="side-background"></div>
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
    <div class="execution">
      <drop-zone></drop-zone>
    </div>
    <div class="consensus">
      <drop-zone></drop-zone>
    </div>
    <div class="validator">
      <drop-zone></drop-zone>
    </div>
    <div class="nodesetup">
      <node-setup-config></node-setup-config>
    </div>

    <div class="service">
      <div class="title-box">
        <span class="title">SERVICE PLUGINS</span>
      </div>
      <service-plugin></service-plugin>
    </div>

    <div class="sidebar">
      <sidebar-parent></sidebar-parent>
    </div>
    <div class="footer">FOOTER</div>
  </div>
</template>

<script>
import NodeSetupConfig from '../layers/NodeSetupConfig.vue'
import SidebarParent from './the-node/NodeSidebarParent.vue'
import DropZone from '../UI/node-manage/DropZone.vue'

export default {
  components: {
    NodeSetupConfig,
    SidebarParent,
    DropZone
  },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Title'
    },
    list: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style scoped>
.nodeparent {
  display: grid;
  height: 94%;
  grid-template-columns: 3% 58% 22% 17%;
  grid-template-rows: repeat(3, 21%) 27.5% 4.5%;
  grid-row-gap: 1px;
}

.asside {
  grid-column-start: 1;
  grid-row: 1/5;
  background-color: transparent;
  width: 100%;

  position: relative;
}

.side-background {
  grid-row: 1/5;
  background-color: #336666;
  height: 100%;

  clip-path: polygon(0 0, 100% 0%, 40% 100%, 0% 100%);
  z-index: -1;
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

.execution {
  color: white;
  height: 100%;
  grid-column-start: 2;
  grid-column-end: 3;
  align-self: center;
}

.consensus {
  color: red;
  grid-column-start: 2;
  grid-column-end: 3;
  height: 100%;
  align-self: center;
}

.validator {
  color: white;
  grid-column-start: 2;
  grid-column-end: 3;
  align-self: center;
  box-sizing: border-box;
  height: 100%;
}

.nodesetup {
  background: transparent;
  height: 85%;
  width: 96%;
  color: white;
  grid-column-start: 2;
  grid-row: 4/5;
  overflow-x: hidden;
  margin: 13px auto 0 auto;
  border: 4px solid rgb(116, 116, 116);
  border-radius: 15px;
}

.service {
  background: black;
  border: 3px solid gray;
  grid-row-start: 1;
  grid-row-end: 5;
  grid-column-start: 3;
  grid-column-end: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
}
.title-box {
  width: 99%;
  height: 20px;
  margin: 10px 0;
  background-color: #374b3b;
  padding: 1px;
  text-align: center;
  color: #fff;
}
.title {
  font-size: 15px;
  font-weight: 800;
}

.validator {
  color: white;
  grid-column-start: 2;
  grid-column-end: 3;
  align-self: center;
  box-sizing: border-box;
}
.trap-container {
  background-color: #2c4030;
  margin: 5px auto 0 auto;
  width: 95%;
  height: 95%;
  padding: 5px;
}
.trap-container .trap-box {
  height: 1%;
}
.trapezoid {
  background: #000;
  height: 1% !important;
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

.sidebar {
  display: grid;
  grid-row-start: 1;
  grid-row-end: 5;
  grid-column-start: 4;
  background: transparent;
  border-top-right-radius: 40px;
}

.footer {
  background: #4c4848;
  color: white;
  grid-column: 1/6;
  grid-row: 5;
  border-radius: 0 0 7px 7px;
}
</style>
