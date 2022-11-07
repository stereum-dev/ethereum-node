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
      <div class="categoryBox">
        <div class="category" @click="selectCategoryTitle">
          <img src="/img/icon/arrows/left-arrow.png" alt="icon" />
          <span :style="{ ...fontSize }">{{ currentCategory }}</span>
          <img src="/img/icon/arrows/right-arrow.png" alt="icon" />
        </div>
      </div>
      <div class="plugin-box">
        <div class="plugin-col">
          <template v-for="item in plugins" :key="item.id">
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
      currentCategory: "",
      plugins: [],
    };
  },
  mounted() {
    this.currentCategory = "all";
    this.plugins = this.allServices.map((item) => {
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

    fontSize() {
      if (this.currentCategory.length > 7) {
        return {
          "font-size": "0.6rem",
          padding: "6px",
          " white-space": "nowrap",
          " -o-text-overflow": " ellipsis",
          "-ms-text-overflow": "ellipsis",
          "text-overflow": "ellipsis",
        };
      }
    },
  },
  methods: {
    selectCategoryTitle() {
      switch (this.currentCategory) {
        case "all":
          this.currentCategory = "execution client";
          this.plugins = this.allServices.filter((item) => {
            return item.category === "execution";
          });
          break;
        case "execution client":
          this.currentCategory = "consensus client";
          this.plugins = this.allServices.filter((item) => {
            return item.category === "consensus";
          });
          break;
        case "consensus client":
          this.currentCategory = "validator client";
          this.plugins = this.allServices.filter((item) => {
            return item.category === "validator";
          });
          break;
        case "validator client":
          this.currentCategory = "service";
          this.plugins = this.allServices.filter((item) => {
            return item.category === "service";
          });
          break;
        case "service":
          this.currentCategory = "all";
          this.plugins = this.allServices;
          break;
        default:
          this.plugins = this.allServices;
          break;
      }
    },
    showTooltipHandler(item) {
      item.displayNameTooltip = true;
    },
  },
};
</script>
<style scoped>
.manage-sidebar {
  position: fixed;
  top: 9%;
  right: -100%;
  width: 12%;
  height: 91%;
  padding: 5px;
  background-color: gray;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  transition-duration: 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: -1;
}
.run-sidebar {
  right: 0;
  z-index: -1;
}
.hidden-icon {
  position: fixed;
  top: 41%;
  right: 9.5%;
  height: 97px;
  width: 50px;
  border: 2px solid rgb(130, 149, 126);
  border-radius: 35px;
  cursor: pointer;
  animation: sidebar 500ms linear;
  z-index: -2;
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
  z-index: -2;
}
.categoryBox {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.category {
  width: 95%;
  height: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  overflow: hidden;
}
.category span {
  width: 75%;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
  color: white;
  cursor: pointer;
  background-color: #24272b;
  text-transform: uppercase;
  padding: 5px;
  border-radius: 5px;
  overflow: hidden;
  overflow: hidden;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.category img {
  width: 10%;
  height: 50%;
  cursor: pointer;
}
.category img:active {
  transform: scale(0.9);
}

.plugin-box {
  width: 90%;
  height: 89%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  z-index: 0;
}

.plugin-col {
  margin: 0 auto;
  padding: 15px 5px;
  width: 80%;
  height: 98%;
  background-color: #454d55;
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
  z-index: 101;
}

.itemBox:hover img {
  transform: scale(0.99);
  border: 2px solid rgb(74, 168, 219);
  border-radius: 5px;
  transition-duration: 50ms;
}

.tooltip {
  position: absolute;
  top: -40%;
  left: -38%;
  border: 1px solid rgb(157, 157, 157);
  width: 80px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.988);
  opacity: 0.9;
  border-radius: 5px;
  padding: 2px;
  z-index: 120;
  overflow: hidden;
  transition-duration: 200ms;
}

.tooltip .tooltipText {
  width: 100%;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: center;
  color: rgb(245, 208, 106);
  text-align: center;
  border-radius: 6px;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
</style>
