<template>
  <div class="statParent">
    <div class="balanceParent">
      <TotalBalance />
    </div>
    <div class="stateBox">
      <div class="stateInnerBox">
        <div class="dropDown_parent">
          <div class="title">
            <span>VALIDATOR</span>
          </div>
          <div class="dropDown_box">
            <div class="dropDown" @click="toggleDropDown">
              <div v-if="!selectedValidator.key" class="options">Choose a validator</div>
              <div v-else class="options">
                {{ selectedValidator.key }}
              </div>

              <div class="dropDown_icon">
                <img :class="{ rotate: dropDownIsOpen }" src="/img/icon/arrows/arrow-down.png" alt="Arrow Icon" />
              </div>
            </div>
            <div v-if="dropDownIsOpen" class="valueBox" @mouseleave="dropDownIsOpen = false">
              <div v-for="(key, index) in keys" :key="index" class="options_value" @click="chooseValidator(key)">
                <span>{{ `${key.key.substring(0, 10)}...${key.key.substring(key.key.length - 15)}` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="indexParent">
          <div class="indexBox">
            <div class="index">
              <span class="indexTitle">INDEX NO.</span>
              <span class="indexValue">123564</span>
            </div>
            <div class="apr">
              <span class="aprTitle">APR (all time)</span>
              <span class="aprValue">9.99%</span>
            </div>
          </div>
          <div class="withdrawal">
            <div class="withdrawal_title">
              <span>Withdrawal Addr.</span>
            </div>
            <div class="withdrawal_value">
              <span>{{
                `${withdrawalAddress.substring(0, 8)}...${withdrawalAddress.substring(withdrawalAddress.length - 13)}`
              }}</span>
            </div>
          </div>
        </div>
        <div class="tabBarParent">
          <div class="tabBar_innerBox">
            <TabBar :tabs="tabs" @get-title="getActiveComponent" />
          </div>
        </div>
        <div class="componentParent">
          <div class="dynamicComponent">
            <component :is="SyncCommitte" />
          </div>
          <div class="predicitionIcon">
            <img src="/img/icon/the-staking/predicition-icon.png" alt="Icon" />
          </div>
        </div>

        <div v-if="SyncCommitteIsActive" class="syncParent">
          <SyncCommitte />
          <div class="description">
            <p>New Sync Committee in <span>256</span> Epochs</p>
          </div>
        </div>
        <div class="historyParent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TotalBalance from "./TotalBalance.vue";
import TabBar from "./TabBar.vue";
import SyncCommitte from "./SyncCommitte.vue";
import { mapWritableState } from "pinia";
import { useStakingStore } from "@/store/theStaking";

export default {
  components: {
    TotalBalance,
    TabBar,
    SyncCommitte,
  },
  data() {
    return {
      tabs: [
        { id: 1, title: "ATTESTATION", imgPath: "/img/icon/the-staking/eye.png", display: false },
        { id: 2, title: "SYNC COMMITTEE", imgPath: "/img/icon/the-staking/comitte.png", display: false },
        { id: 3, title: "BLOCK PRODUCTION", imgPath: "/img/icon/the-staking/cube.png", display: false },
        // { id: 4, title: "", imgPath: "", display: false },
        // { id: 5, title: "", imgPath: "", display: false },
      ],
      selectedValidator: {},
      dropDownIsOpen: false,
      maxCharacters: 30,
      withdrawalAddress: "0x12345gbfdbf097df9gb7s9dfg7b9sdfg7b67890",
    };
  },
  computed: {
    ...mapWritableState(useStakingStore, {
      keys: "keys",
    }),
  },
  methods: {
    toggleDropDown() {
      this.dropDownIsOpen = !this.dropDownIsOpen;
    },
    chooseValidator(key) {
      this.selectedValidator = key;
      this.dropDownIsOpen = false;
    },
    getActiveComponent(item) {
      this.tabs.forEach((tab) => {
        if (tab.title === item) {
          tab.display = true;
        } else {
          tab.display = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.statParent {
  grid-column: 10/13;
  grid-row: 1/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 320px;
  height: 100%;
  padding: 10px 5px 10px 5px;
}
.balanceParent {
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stateBox {
  width: 100%;
  height: 74%;
  background-color: #bfbfbf;
  border-radius: 10px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.stateInnerBox {
  width: 100%;
  height: 100%;
  background-color: #242529;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(10, 1fr);
}
.dropDown_parent {
  grid-column: 1/7;
  grid-row: 1/2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px 0 5px;
}
.dropDown_parent .title {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dropDown_parent .title span {
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
}
.dropDown_parent .dropDown_box {
  width: 70%;
  height: 100%;
  padding: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.dropDown_box .dropDown {
  width: 100%;
  height: 100%;
  border: 1px solid rgb(238, 238, 238);
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.dropDown_box .dropDown .options {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  color: #e7e7e7;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dropDown_box .valueBox {
  width: 94%;
  height: 85%;
  padding: 5px 2px;
  max-height: 180px;
  background-color: #1258a2;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition-duration: 300ms;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 14%;
  left: 3%;
}

.valueBox::-webkit-scrollbar-thumb {
  background: #efefef;
  border-radius: 5px;
}

.options_value {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #3b3f42;
  padding: 2px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.options_value:hover {
  transition-duration: 300ms;
  background-color: #e4e4e4;
}
.options_value:hover span {
  color: #2d2d2d;
}

.options_value span {
  width: 100%;
  color: #cdcdcd;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}
.dropDown_box .dropDown .dropDown_icon {
  width: 10%;
  height: 100%;
  background-color: #0a7ae2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dropDown_box .dropDown .dropDown_icon img {
  width: 70%;
  height: 50%;
}
.rotate {
  transform: rotate(180deg) !important;
}

.indexParent {
  grid-column: 1/7;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
}
.indexParent .indexBox {
  width: 100%;
  height: 50%;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #cdcdcd;
  font-size: 0.8rem;
  font-weight: 700;
}
.indexBox .index {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}
.indexBox .index .indexTitle {
  width: 50%;
  height: 100%;
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 700;
}
.indexBox .index .indexValue {
  width: 50%;
  height: 100%;
  color: #cdcdcd;
  font-size: 0.5rem;
  font-weight: 700;
}

.indexBox .apr {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}
.indexBox .apr .aprTitle {
  width: 80%;
  height: 100%;
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 700;
}
.indexBox .apr .aprValue {
  width: 30%;
  height: 100%;
  color: #47c42e;
  font-size: 0.6rem;
  font-weight: 600;
}

.indexParent .withdrawal {
  width: 100%;
  height: 50%;
  padding: 0 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.indexParent .withdrawal .withdrawal_title {
  width: 40%;
  height: 100%;
  text-align: left;
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 700;
}
.indexParent .withdrawal .withdrawal_value {
  width: 60%;
  height: 100%;
  padding: 0 2px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.indexParent .withdrawal .withdrawal_value span {
  width: 100%;
  color: #cdcdcd;
  font-size: 0.6rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
}

.tabBarParent {
  grid-column: 1/7;
  grid-row: 3/6;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 5px;
  z-index: 0;
}
.tabBarParent .tabBar_innerBox {
  width: 100%;
  height: 100%;
  padding: 5px 3px;
  border-radius: 10px;
  background-color: #4d4d4d;
  border: 2px solid #505559;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
}
.componentParent {
  grid-column: 1/7;
  grid-row: 6/11;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.componentParent .dynamicComponent {
  width: 58%;
  height: 100%;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.componentParent .predicitionIcon {
  width: 32%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}
.componentParent .predicitionIcon img {
  width: 100%;
  height: 100%;
}

.blockBox .cubeIcon span {
  color: #cdcdcd;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
}
.tabBarParent .blockBox .cubeIcon img {
  width: 80%;
}
.tabBarParent .attestation .attestationTitle,
.tabBarParent .blockBox .blockTitle {
  width: 80%;
  height: 62%;
  padding: 0 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #318d1f;
  border: 1px solid #9e9e9e;
  border-radius: 3px;
}
.tabBarParent .attestation .attestationTitle span,
.tabBarParent .blockBox .blockTitle span {
  width: 100%;
  color: #f0f0f0;
  font-size: 0.5rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tabBarParent .blockBox {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.tabBarParent .attestationSlot {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.tabBarParent .attestationSlot .attestationSlotBox {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.attestationSlotBox .attestationSlot_row_1 {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.attestationSlot_row_1 .attestationSlotTitle {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.attestationSlot_row_1 .attestationSlotTitle span {
  width: 100%;
  color: #cdcdcd;
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
}

.attestationSlot_row_1 .attestationSlotValue {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.attestationSlot_row_1 .attestationSlotValue span {
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 700;
  overflow: hidden;
}
.attestationSlotBox .attestationSlot_row_2,
.attestationSlotBox .attestationSlot_row_3 {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2px;
}
.attestationSlot_row_2 .attestationSlotTitle,
.attestationSlot_row_3 .attestationSlotTitle {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.attestationSlot_row_2 .attestationSlotTitle span,
.attestationSlot_row_3 .attestationSlotTitle span {
  color: #cdcdcd;
  font-size: 0.6rem;
  font-weight: 600;
}
.attestationSlot_row_2 .attestationSlotValue,
.attestationSlot_row_3 .attestationSlotValue {
  width: max-content;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.attestationSlot_row_2 .attestationSlotValue span,
.attestationSlot_row_3 .attestationSlotValue span {
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 600;
  overflow: hidden;
}

.blockSlotBox {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.blockSlotBox .blockSlotTitle {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.blockSlotBox .blockSlotTitle span {
  width: 100%;
  color: #318d1f;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
.blockSlotBox .blockSlotValue {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.blockSlotBox .blockSlotValue span {
  width: 100%;
  color: #efd96bdf;
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
}

.syncParent {
  grid-column: 1/7;
  grid-row: 6/10;
  width: 100%;
  height: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.description {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.description p {
  color: #efefef;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.description p span {
  color: #f3e32f;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}

.sync-icon {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.historyParent {
  grid-column: 1/7;
  grid-row: 10/11;
  width: 100%;
  height: 100%;
}
</style>
