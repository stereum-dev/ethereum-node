<template>
  <div @mouseleave="showSidebar = false">
    <div @click="showSidebar = !showSidebar" class="toggle-btn">
      <img
        @mousedown.prevent.stop
        v-if="showSidebar"
        class="hidden-icon"
        src="../../../../public/img/icon/manage-node-icons/sidebar-in.png"
        alt=""
      />
      <img
        @mousedown.prevent.stop
        v-else
        @mouseenter="showSidebar = true"
        class="show-icon"
        src="../../../../public/img/icon/manage-node-icons/sidebar-out.png"
        alt=""
      />
    </div>
    <div :class="{ 'run-sidebar': showSidebar }" class="manage-sidebar">
      <div class="plugin-box">
        <img
          @mousedown.prevent.stop
          class="up-arrow"
          src="../../../../public/img/icon/manage-node-icons/white-arrow-up.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 0"
        />
        <div class="plugin-col" ref="pluginCol">
          <template
            v-for="item in allServices.filter(
              (s) => s.service != 'SSVNetworkService'
            )"
            :key="item.id"
          >
            <div
              @dragstart="startDrag($event, item)"
              @dblclick="$emit('addService', item)"
              class="itemBox"
            >
              <div class="tooltip" v-if="item.displayNameTooltip">
                <span class="tooltipText">{{ item.name }}</span>
              </div>
              <img
                :src="item.sIcon"
                alt="icon"
                @mouseover="showTooltipHandler(item)"
                @mouseleave="item.displayNameTooltip = false"
              />
            </div>
          </template>
        </div>
        <img
          @mousedown.prevent.stop
          class="down-arrow"
          src="../../../../public/img/icon/manage-node-icons/white-arrow-down.png"
          alt="icon"
          @click="$refs.pluginCol.scrollTop = 1000"
        />
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
      showSidebar: true,
    };
  },
  mounted() {
    this.allServices = this.allServices.map((item) => {
      return {
        ...item,
        displayNameTooltip: false,
      };
    });
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
  },
  methods: {
    showTooltipHandler(item) {
      this.allServices.map((i) => {
        if (i.id === item.id) {
          i.displayNameTooltip = true;
        }
      });
    },
  },
};
</script>
<style scoped>
.manage-sidebar {
  position: fixed;
  top: 9.1%;
  right: -100%;
  width: 10%;
  height: 90%;
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
  right: 7.5%;
  height: 97px;
  width: 50px;
  border: 2px solid rgb(130, 149, 126);
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
  right: -1.7%;
  height: 16%;
  width: 3.5%;
  border: 2px solid rgb(47, 52, 46);
  border-radius: 35px;
  cursor: pointer;
}

.plugin-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.plugin-box .up-arrow {
  width: 80%;
  height: 8%;
  cursor: pointer;
  transition-duration: 100ms;
  z-index: 2;
}
.plugin-box .down-arrow {
  width: 80%;
  height: 8%;
  cursor: pointer;
  z-index: 2;
  transition-duration: 100ms;
}

.down-arrow:active,
.up-arrow:active {
  transform: scale(0.9);
}
.plugin-col {
  margin: 0 auto;
  padding: 5px;
  width: 80%;
  height: 98%;
  background-color: #565656;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
}
.plugin-col::-webkit-scrollbar {
  display: none;
}
.itemBox {
  width: 50px;
  height: 50px;
  margin: 5px auto;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.itemBox:hover img {
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
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  height: 15%;
  margin: 10px auto;
}
.filter-box .filter-inp {
  width: 100%;
  height: 25%;
  padding: 0;
  padding-left: 5px;
  border: none;
  border-radius: 45px;
  outline-style: none;
  margin-top: 2px;
  font-size: 0.6rem;
}
.filter-icons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 30%;
  margin: 10px auto;
  padding: 1px;
  border-radius: 45px;
  background-color: #565656;
}
.filter-icons img {
  width: 23%;
  height: 85%;
}

.tooltip {
  position: absolute;
  top: -50%;
  left: -10%;
  width: max-content;
  height: 5vh;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.8;
  border: 1px solid rgb(7, 7, 7);
  border-radius: 5px;
  z-index: 10;
}

.tooltip .tooltipText {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgb(30, 29, 29);
  text-align: center;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
</style>
