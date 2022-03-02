<template>
  <div>
    <div @click="showSidebar = !showSidebar" class="toggle-btn">
      <img
        onmousedown="return false"
        v-if="showSidebar"
        class="hidden-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-hidden-icon.png"
        alt=""
      />
      <img
        onmousedown="return false"
        v-else
        class="show-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-show-icon.png"
        alt=""
      />
    </div>
    <div :class="{ 'run-sidebar': showSidebar }" class="manage-sidebar">
      <div class="plugin-box">
        <img
          onmousedown="return false"
          class="up-arrow"
          src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 0"
        />
        <div class="plugin-col" ref="pluginCol">
          <div class="plugin-item">
            <div class="cloud-item">
              <img
                src="../../../../public/Img/icon/manage-node-icons/cloud-1.png"
                alt="icon"
              />
            </div>
          </div>
          <div
            draggable="true"
            @dragstart="startDrag($event, item)"
            class="plugin-item"
            v-for="item in sidebarPlugins"
            :key="item.id"
          >
            <img :src="item.source" alt="" />
          </div>
        </div>
        <img
          onmousedown="return false"
          class="down-arrow"
          src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 1000"
        />
      </div>
      <div class="filter-box" onmousedown="return false">
        <input class="filter-inp" type="text" placeholder="Filter..." />
        <div class="filter-icons">
          <img
            src="../../../../public/Img/icon/manage-node-icons/filter-icon.png"
            alt="icon"
          />
          <img
            src="../../../../public/Img/icon/manage-node-icons/filter-fav.png"
            alt="icon"
          />
          <img
            src="../../../../public/Img/icon/manage-node-icons/filter-confirm.png"
            alt="icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["startDrag", "sidebarPlugins"],
  data() {
    return {
      showSidebar: false,
    };
  },
};
</script>
<style scoped>
.manage-sidebar {
  position: fixed;
  top: 10%;
  right: -200px;
  width: 150px;
  height: 81.5%;
  padding: 5px;
  background-color: gray;
  border-top-left-radius: 35px;
  border-bottom-left-radius: 35px;
}
.run-sidebar {
  right: 0;
}
.hidden-icon {
  position: fixed;
  top: 41%;
  right: 123px;
  height: 120px;
  width: 66px;
  border: 2px solid rgb(183, 176, 176);
  border-radius: 35px;
}
.show-icon {
  position: fixed;
  top: 41%;
  right: -44px;
  height: 120px;
  width: 71px;
  border: 2px solid rgb(183, 176, 176);
  border-radius: 35px;
}

.plugin-box {
  padding: 0;
  margin: 0;
  height: 64vh;
  position: relative;
}
.plugin-box .up-arrow {
  position: absolute;
  top: -5px;
  right: 20px;
  width: 110px;
  height: 25px;
}
.plugin-box .down-arrow {
  position: absolute;
  width: 110px;
  height: 25px;
  margin: 0 auto;
  bottom: -12px;
  right: 20px;
}
.plugin-col {
  margin: 17px auto;
  padding: 25px 0 30px 0;
  width: 110px;
  height: 88%;
  background-color: #565656;
  border-radius: 15px;
  overflow-y: auto;
}
.plugin-col::-webkit-scrollbar {
  display: none;
}
.plugin-item {
  width: 50px;
  height: 50px;
  margin: 5px auto;
  border-radius: 12px;
  border: 2px solid rgb(70, 70, 70);
}

.plugin-item img {
  width: 50px;
  height: 50px;
  border-radius: 15px;
}
.cloud-item {
  width: 50px;
  height: 50px;
  border-radius: 11px;
  background: rgb(11, 148, 206);
  display: flex;
  justify-content: center;
  align-items: center;
}
.cloud-item img {
  width: 30px;
  height: 30px;
  border-radius: 11px;
  background: transparent;
}
.plugin-item:hover {
  border: 2px solid green;
}
.filter-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100px;
  margin: 17px auto;
}
.filter-box .filter-inp {
  width: 95px;
  height: 23px;
  padding-left: 5px;
  border: none;
  border-radius: 45px;
  outline-style: none;
  margin-top: 2px;
}
.filter-icons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100px;
  height: 25px;
  margin: 3px auto;
  padding: 1px;
  border-radius: 45px;
  background-color: #565656;
}
.filter-icons img {
  width: 23px;
  height: 23px;
}
.up-arrow,
.down-arrow {
  border-radius: 50px;
  box-shadow: 0 2px 3px 1px rgb(67, 67, 67);
}
.up-arrow:active,
.down-arrow:active {
  box-shadow: none;
}
</style>
