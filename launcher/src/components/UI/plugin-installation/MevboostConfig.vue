<template>
  <installation-box :title="title" :back="back" :icon="selectedPreset.icon" :next="selectedUsedBlocks ? 'verify' : 'disabled'">
    <div class="plugin-parent">
      <div class="content-box">
        <div class="options-box">
          <div class="option-title">
            <span>{{ $t("mevboostConfig.availRelays") }}</span>
          </div>
          <div class="option-table">
            <div
              v-for="item in availableBlocks"
              :key="item.id"
              class="row"
              :class="{ selectedItemToAdd: item.isSelected }"
              @click="selectItemToAdd(item)"
              @dblclick="doubleClickAdd(item)"
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
            <img src="/img/icon/mevboost-icons/arrow-right.png" alt="icon" />
          </div>
          <div class="remove" @click="removeFromUsedBlocks">
            <img src="/img/icon/mevboost-icons/arrow-left.png" alt="icon" />
          </div>
        </div>
        <div class="included-box">
          <div class="included-title">
            <span>{{ $t("mevboostConfig.usedRelays") }}</span>
          </div>
          <div class="included-table">
            <div
              v-for="item in usedBlocks"
              :key="item.id"
              class="row"
              :class="{ selectedItemToRemove: item.isRemoved }"
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
    </div>
  </installation-box>
</template>
<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
export default {
  data() {
    return {
      title: "Mevboost Config",
      back: "sync",
      next: "verify",
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      relaysList: "relaysList",
      availableBlocks: "availableBlocks",
      usedBlocks: "usedBlocks",
      currentNetwork: "currentNetwork",
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
    selectedUsedBlocks() {
      if (this.usedBlocks.length === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.availableBlocks = this.shuffleRelaysList(this.relaysList.filter((r) => r[this.currentNetwork.network]));
  },

  methods: {
    shuffleRelaysList(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    doubleClickAdd(el) {
      this.availableBlocks.forEach((item) => {
        if (item.id == el.id) {
          item.isSelected = true;
        }
      });
      this.addBlocksToUse();
    },
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
      this.relayURL = this.usedBlocks.map((r) => r[this.currentNetwork.network]).join();
    },
    removeFromUsedBlocks() {
      this.usedBlocks.forEach((item) => {
        if (item.isRemoved) {
          item.isRemoved = false;
          this.usedBlocks.splice(this.usedBlocks.indexOf(item), 1);
        }
      });
      this.relayURL = this.usedBlocks.map((r) => r[this.currentNetwork.network]).join();
    },
  },
};
</script>
<style scoped>
.plugin-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content-box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 10px;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(25, 33, 32);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.included-box {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.options-box {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  padding: 0 8px;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.option-title,
.included-title {
  width: 90%;
  height: 25px;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 10px;
  padding: 5px 0;
  display: flex;
  background-color: #33393e;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.option-title span,
.included-title span {
  color: #d3d3d3;
  font-size: 0.7rem;
  font-weight: 400;
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
  width: 94%;
  height: 91%;
  margin: 10px auto;
  background-color: #080808;
  border: 1px solid #b4b4b4;
  padding: 2px 5px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #545454;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: 80%;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row .rowIcon img {
  width: 80%;
  border-radius: 100%;
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
