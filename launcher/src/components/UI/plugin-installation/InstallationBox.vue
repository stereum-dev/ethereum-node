<template>
  <background-page>
    <div class="parent">
      <div class="plugin-modal">
        <div class="header">
          <img v-if="icon" :src="icon" alt="Preset Icon" class="presetIcon" />
          <span>{{ title }}</span>
        </div>
        <slot></slot>
        <div class="btn-container">
          <router-link :to="{ path: back }" class="back">
            <span>{{ $t("installOption.back") }}</span>
          </router-link>

          <router-link v-if="next === 'disabled'" :class="{ disabled: btnActive }" to="verify" class="install disabled">
            <span>{{ $t("pluginName.next") }}</span>
          </router-link>
          <router-link v-else-if="next !== 'disabled' && next" :to="{ path: next }" class="install">
            <span>{{ $t("pluginName.next") }}</span>
          </router-link>
<<<<<<< HEAD
          <router-link v-else to="" class="install" @click="$emit('openModal')">
=======
          <router-link v-else to="{ path:'' }" class="install" @click="$emit('executeInstallation')">
>>>>>>> main
            <span>{{ $t("pluginName.next") }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </background-page>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeManage } from "../../../store/nodeManage";
import { useClickInstall } from "@/store/clickInstallation";
export default {
  name: "InstallationBox",
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    next: {
      type: String,
      default: "",
    },
    back: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      usedBlocks: "usedBlocks",
    }),
    ...mapWritableState(useClickInstall, {
      btnActive: "btnActive",
      checkPointUrl: "checkPointUrl",
    }),
  },

  methods: {},
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  left: 0;
  top: 0;
  text-align: center;
  content: attr(data-tooltip);
  color: #eee;
  background: black;
  border-radius: 5px;
  font-size: 47%;
  padding: 2% 3%;
  border: 1px solid #929292;
  visibility: hidden;
  opacity: 0;
  transform: translateY(20%);
  transition: opacity 0.3s transform 0.2s;
  z-index: 100;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: rotateY(0);
}

.parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugin-modal {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 10% 15% 60% 25%;
}
.header {
  grid-column: 2/5;
  grid-row: 2/3;
  margin: 0 auto;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  border-radius: 15px;
  width: 100%;
  height: 80%;
  text-align: center;
  font-size: 1.5rem;
  color: rgb(214, 214, 214);
  font-weight: 700;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}

.header span {
  font-size: 2.2rem;
  font-weight: 700;
  color: #b4b4b4;
}

.header .presetIcon {
  position: absolute;
  left: -1%;
  width: 15%;
}

.btn-container {
  grid-column: 1/6;
  grid-row: 4/5;
  width: 80%;
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  position: relative;
}

.install,
.back {
  height: 40px;
  min-width: 120px;
  border-radius: 40px;
  border: 3px solid #929292;
  background-color: #194747;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(191, 191, 191);
  box-shadow: 0 1px 3px 1px rgb(41, 61, 51);
  outline-style: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.install:hover,
#back:hover {
  background-color: rgb(31, 48, 43);
  box-shadow: 0 1px 3px 0 rgb(21, 31, 26);
}
.install:active,
.back:active {
  box-shadow: inset 1px 1px 3px 1px rgb(14, 19, 17);
}
.disabled {
  opacity: 0.2;
  pointer-events: none;
}
</style>
