<template>
  <div>
    <div @click="showSidebar = !showSidebar" class="toggle-btn">
      <img
        @mousedown.prevent.stop
        v-if="showSidebar"
        class="hidden-icon"
        width="88"
        src="../../../../public/img/icon/manage-node-icons/sidebar-hidden-icon.png"
        alt=""
      />
      <img
        @mousedown.prevent.stop
        v-else
        class="show-icon"
        width="88"
        src="../../../../public/img/icon/manage-node-icons/sidebar-show-icon.png"
        alt=""
      />
    </div>
    <div
      :class="{ 'run-sidebar': showSidebar }"
      class="manage-sidebar"
      @mouseleave="showSidebar = false"
    >
      <div class="plugin-box">
        <img
          onmousedown="return false"
          class="up-arrow"
          src="../../../../public/img/icon/manage-node-icons/up-arrow.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 0"
        />
        <div class="plugin-col" ref="pluginCol">
          <div class="cloud-box">
            <div class="cloud-item">
              <img
                onmousedown="return false"
                src="../../../../public/img/icon/manage-node-icons/cloud-1.png"
                alt="icon"
              />
            </div>
          </div>
          <div
            @dragstart="startDrag($event, item)"
            @dblclick="$emit('addService', item)"
            class="cloud-box"
            v-for="item in allServices"
            :key="item.id"
          >
            <img :src="item.sIcon" alt="" />
          </div>
        </div>
        <img
          onmousedown="return false"
          class="down-arrow"
          src="../../../../public/img/icon/manage-node-icons/down-arrow.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 1000"
        />
      </div>
      <div class="filter-box" onmousedown="return false">
        <input class="filter-inp" type="text" placeholder="Filter..." />
        <div class="filter-icons">
          <img
            src="../../../../public/img/icon/manage-node-icons/filter-icon.png"
            alt="icon"
          />
          <img
            src="../../../../public/img/icon/manage-node-icons/filter-fav.png"
            alt="icon"
          />
          <img
            src="../../../../public/img/icon/manage-node-icons/filter-confirm.png"
            alt="icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
export default {
  props: ["startDrag"],
  data() {
    return {
      showSidebar: false,
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
  },
};
</script>
<style scoped>
.manage-sidebar {
  position: fixed;
  top: 9%;
  right: -200px;
  width: 120px;
  height: 86%;
  padding: 5px;
  background-color: gray;
  border-top-left-radius: 35px;
  border-bottom-left-radius: 35px;
  transition-duration: 0.5s;
}
.run-sidebar {
  right: 0;
}
.hidden-icon {
  position: fixed;
  top: 41%;
  right: 93px;
  height: 97px;
  width: 50px;
  border: 2px solid rgb(47, 52, 46);
  border-radius: 35px;
  cursor: pointer;
  animation: sidebar 500ms linear;
}
@keyframes sidebar {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.show-icon {
  position: fixed;
  top: 41%;
  right: -46px;
  height: 110px;
  width: 69px;
  border: 2px solid rgb(47, 52, 46);
  border-radius: 35px;
  cursor: pointer;
}

.plugin-box {
  padding: 0;
  margin: 0;
  height: 64vh;
  position: relative;
}
.plugin-box .up-arrow {
  position: absolute;
  top: -9px;
  right: 10px;
  width: 90px;
  height: 25px;
  cursor: pointer;
  border-radius: 50px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42);
  z-index: 1;
}
.plugin-box .down-arrow {
  position: absolute;
  width: 90px;
  height: 25px;
  margin: 0 auto;
  bottom: -2px;
  right: 9px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px rgb(58, 58, 58);
  z-index: 1;
  transition-duration: 100ms;
}
.down-arrow:hover,
.up-arrow:hover {
  transform: scale(1.1);
}
.down-arrow:active,
.up-arrow:active {
  transform: scale(1);
}
.plugin-col {
  margin: 17px auto;
  padding: 25px 0 30px 0;
  width: 80%;
  height: 100%;
  background-color: #565656;
  border-radius: 15px;
  overflow-y: auto;
}
.plugin-col::-webkit-scrollbar {
  display: none;
}
.cloud-box {
  width: 50px;
  height: 50px;
  margin: 5px auto;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cloud-box:hover img {
  transform: scale(0.99);
  border: 2px solid rgb(74, 168, 219);
  border-radius: 5px;
  transition-duration: 50ms;
}
.cloud-item {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  transition-duration: 100ms;
}
.cloud-item img {
  width: 95%;
  height: 86%;
  border-radius: 5px;
  border: 2px solid transparent;
  background: rgb(11, 148, 206);
}
.cloud-item img:hover {
  transform: scale(0.99);
  border: 2px solid rgb(145, 243, 202);
  transition-duration: 50ms;
}
.filter-box {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  height: 20%;
  margin: 5px auto;
}
.filter-box .filter-inp {
  width: 100%;
  height: 23px;
  padding: 0;
  padding-left: 5px;
  border: none;
  border-radius: 45px;
  outline-style: none;
  margin-top: 2px;
  font-size: 0.8rem;
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
  width: 23%;
  height: 90%;
}
</style>
