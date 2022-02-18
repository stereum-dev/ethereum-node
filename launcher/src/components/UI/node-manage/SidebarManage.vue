<template>
  <div>
    <div @click="showSidebar = !showSidebar" class="toggle-btn">
      <img
        v-if="showSidebar"
        class="hidden-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-hidden-icon.png"
        alt=""
      />
      <img
        v-else
        class="show-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-show-icon.png"
        alt=""
      />
    </div>
    <div :class="{ 'run-sidebar': showSidebar }" class="manage-sidebar">
      <div class="cloud">
        <img
          src="../../../../public/Img/icon/manage-node-icons/cloud-icon.png"
          alt="icon"
        />
      </div>
      <div class="plugin-box">
        <div class="plugin-col">
          <img
            class="up-arrow"
            src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
            alt="icon"
          />
          <div class="plugin-item">
            <img
              src="../../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"
              alt=""
            />
          </div>
          <div class="plugin-item">
            <img
              src="../../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"
              alt=""
            />
          </div>
          <div class="plugin-item">
            <img
              src="../../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"
              alt=""
            />
          </div>
          <div class="plugin-item">
            <!-- <img
              src="../../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"
              alt=""
            /> -->
          </div>
          <img
            class="down-arrow"
            src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
            alt="icon"
          />
        </div>
      </div>
      <div class="filter-box">
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
  data() {
    return {
      showSidebar: false,
    };
  },
  methods: {},
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
  top: 36%;
  right: 108px;
  height: 150px;
  width: 85px;
  border: 1px solid rgb(183, 176, 176);
  border-radius: 35px;
}
.show-icon {
  position: fixed;
  top: 36%;
  right: -50px;
  height: 150px;
  width: 85px;
  border: 1px solid rgb(183, 176, 176);
  border-radius: 35px;
}
.cloud {
  width: 120px;
  margin: 0 auto;
  height: 40px;
}
.cloud img {
  margin-top: 5px;
  width: 90%;
}
.plugin-box {
  padding: 0;
  margin: 0;
  height: 64vh;
  position: relative;
}
.plugin-box .up-arrow {
  width: 110px;
  height: 25px;
  margin: 0 auto;
}
.plugin-box .down-arrow {
  width: 110px;
  height: 25px;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  right: 20px;
}
.plugin-col {
  margin: 0 auto;
  width: 110px;
  height: 100%;
  background-color: #565656;
  border-radius: 15px;
}
.plugin-item {
  width: 65px;
  height: 65px;
  margin: 5px auto;
  border-radius: 15px;
  border: 2px solid rgb(70, 70, 70);
}
.plugin-item img {
  width: 65px;
  height: 65px;
}
.filter-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100px;
  margin: 3px auto;
}
.filter-box .filter-inp {
  width: 95px;
  height: 23px;
  padding-left: 5px;
  border: none;
  /* border: 2px solid white; */
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
</style>
