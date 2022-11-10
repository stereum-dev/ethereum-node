<template>
  <div class="plugin-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="plugin-modal-parent">
        <div class="plugin-modal">
          <div class="name-box">
            <div class="name-title-box">
              <div class="name-title">
                <span>{{ selectedPreset.name }}</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="options-box">
              <div class="option-title">
                <span>AVAILABLE BLOCK RELAYS</span>
              </div>
              <div class="option-table">
                <div
                  class="row"
                  :class="{ selectedItemToAdd: item.isSelected }"
                  v-for="item in availableBlocks"
                  :key="item.id"
                  @click="selectItemToAdd(item)"
                >
                  <div class="rowIcon">
                    <img :src="item.icon" alt="icon" />
                  </div>
                  <div class="rowText">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="arrowBox">
              <div class="select" @click="addBlocksToUse">
                <img src="/img/icon/arrows/right-1.png" alt="icon" />
              </div>
              <div class="remove" @click="removeFromUsedBlocks">
                <img src="/img/icon/arrows/left-1.png" alt="icon" />
              </div>
            </div>
            <div class="included-box">
              <div class="included-title">
                <span>USED BLOCK RELAYS</span>
              </div>
              <div class="included-table">
                <div
                  class="row"
                  :class="{ selectedItemToRemove: item.isRemoved }"
                  v-for="item in usedBlocks"
                  :key="item.id"
                  @click="selectItemToRemove(item)"
                >
                  <div class="rowIcon">
                    <img :src="item.icon" alt="icon" />
                  </div>
                  <div class="rowText">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/install' }">
              <span>BACK</span>
            </router-link>
            <router-link
              :to="{ path: '/verify' }"
              :class="{ disabled: !usedBlocks.length }"
            >
              <span>NEXT</span>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "../../../store/services";
import { useNodeManage } from "../../../store/nodeManage";
export default {
  data() {
    return {
      availableBlocks: [],
      usedBlocks: [],
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      relaysList: "relaysList",
    }),
    ...mapWritableState(useClickInstall, {
      relayURL: "relayURL",
      selectedPreset: "selectedPreset",
      plugins: "presets",
      installationPath: "installationPath",
      checkPointSync: "checkPointSync",
    }),
    ...mapWritableState(useServices, {
      allPlugins: "allServices",
    }),
  },
  mounted(){
    this.availableBlocks = this.relaysList.filter(r => r[this.selectedPreset.network])
  },
  methods: {
    selectItemToAdd(el) {
      this.availableBlocks.forEach((item) => {
        if (item.id == el.id) {
          item.isSelected = true;
        }
      });
    },
    selectItemToRemove(el) {
      this.usedBlocks.forEach((item) => {
        if (item.id == el.id) {
          item.isSelected = false;
          item.isRemoved = true;
        }
      });
    },
    addBlocksToUse() {
      this.availableBlocks.forEach((i) => {
        if (i.isSelected && !this.usedBlocks.includes(i)) {
          i.isSelected = false;
          this.usedBlocks.push(i);
        }
      });
      this.relayURL = this.usedBlocks.map(r => r[this.selectedPreset.network]).join()
    },
    removeFromUsedBlocks() {
      this.usedBlocks.forEach((item) => {
        if (item.isRemoved) {
          item.isRemoved = false;
          this.usedBlocks.splice(this.usedBlocks.indexOf(item), 1);
        }
      });
      this.relayURL = this.usedBlocks.map(r => r[this.selectedPreset.network]).join()
    },
  },
};
</script>
<style scoped>
.plugin-parent {
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
.plugin-modal-parent {
  width: 80%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 11.2%;
  left: 10%;
  z-index: 2;
}
.plugin-modal {
  width: 70%;
  height: 95%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.name-box {
  width: 95%;
  height: 20%;
  margin-top: 5px;
  background-color: #8e8e8e;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.name-title-box {
  width: 96%;
  height: 80%;
  border-radius: 15px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.name-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
  text-transform: uppercase;
}
.content-box {
  width: 95%;
  height: 63%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-box .included-box {
  width: 43%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 3px 1px rgb(34, 54, 49);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.included-title {
  width: max-content;
  height: 11%;
  border: 1px solid rgb(98, 98, 98);
  margin: 0 auto;
  border-radius: 25px;
  display: flex;
  background-color: #30483b;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  padding: 0 10px;
  box-shadow: 0 1px 3px 1px rgb(67, 67, 67);
}

.content-box .options-box {
  width: 43%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 3px 1px rgb(35, 56, 50);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.option-title {
  width: max-content;
  height: 11%;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 25px;
  display: flex;
  background-color: #30483b;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  padding: 0 10px;
  box-shadow: 0 1px 3px 1px rgb(67, 67, 67);
}
.option-title span,
.included-title span {
  color: #dfdfdf;
  font-size: 0.7rem;
  font-weight: 600;
}

.content-box .arrowBox {
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.select {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.remove {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.select img,
.remove img {
  width: 60%;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid transparent;
  background-color: rgb(43, 48, 53);
  margin: 10px;
  padding: 5px;
}
.select img:hover,
.remove img:hover {
  border: 1px solid #e5e5e5;
}
.select img:active,
.remove img:active {
  transform: scale(0.9);
}

.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 25%;
  height: 60%;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box a span {
  width: 100%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #eaeaea;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px #353e39;
  outline-style: none;
  cursor: pointer;
  text-align: center;
}

.btn-box a span:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}

.btn-box a span:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}

.options-box .option-table,
.included-box .included-table {
  width: 95%;
  height: 85%;
  border-radius: 0 0 15px 15px;
  padding: 5px 1px 2px 1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.row {
  width: 100%;
  height: 30px;
  max-height: 18%;
  border-radius: 5px;
  border: 2px solid #272c36;
  display: flex;
  justify-content: flex-start;
  background: #2d3034;
  align-items: center;
  margin-top: 3px;
  padding: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.row:hover {
  background: #1a1a1a;
}
.row .rowIcon {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row .rowIcon img {
  width: 80%;
}
.row .rowText {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row .rowText span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #dedede;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}
.selectedItemToAdd {
  background-color: #1a3535;
  border: 2px solid #bfc4d3;
}
.selectedItemToRemove {
  background-color: #1a3535;
  border: 2px solid #e83d3d;
}
.disabled {
  opacity: 0.3;
  pointer-events: none;
}
</style>
