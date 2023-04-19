<template>
  <div class="statParent">
    <div class="balanceParent">
      <TotalBalance />
    </div>
    <div class="stateBox">
      <div class="stateInnerBox">
        <StateDropdown :keys="keys" />
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
            <div
              v-for="(item, index) in optionsType"
              v-show="item.title === currentComponent"
              :key="index"
              class="outterBox"
            >
              <component :is="item.comp" v-bind="item" />
            </div>
          </div>
          <div class="predicitionIcon">
            <img src="/img/icon/the-staking/predicition-icon.png" alt="Icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StateDropdown from "./StateDropdown.vue";
import TotalBalance from "./TotalBalance.vue";
import TabBar from "./TabBar.vue";
import SyncCommitte from "./SyncCommitte.vue";
import BlockProduction from "./BlockProduction.vue";
import TheAttestation from "./TheAttestation.vue";
import { mapWritableState } from "pinia";
import { useStakingStore } from "@/store/theStaking";

export default {
  components: {
    TotalBalance,
    StateDropdown,
    TabBar,
    SyncCommitte,
    TheAttestation,
    BlockProduction,
  },
  data() {
    return {
      optionsType: [
        {
          title: "ATTESTATION",
          comp: TheAttestation,
        },
        {
          title: "SYNC COMMITTEE",
          comp: SyncCommitte,
        },
        {
          title: "BLOCK PRODUCTION",
          comp: BlockProduction,
        },
      ],
      tabs: [
        { id: 1, title: "ATTESTATION", imgPath: "/img/icon/the-staking/eye.png", display: false },
        { id: 2, title: "SYNC COMMITTEE", imgPath: "/img/icon/the-staking/comitte.png", display: false },
        { id: 3, title: "BLOCK PRODUCTION", imgPath: "/img/icon/the-staking/cube.png", display: false },
      ],
      selectedValidator: {},

      maxCharacters: 30,
      withdrawalAddress: "0x12345gbfdbf097df9gb7s9dfg7b9sdfg7b67890",
      currentComponent: "ATTESTATION",
    };
  },
  computed: {
    ...mapWritableState(useStakingStore, {
      keys: "keys",
    }),
  },

  mounted() {
    this.getActiveComponent("ATTESTATION");
  },
  methods: {
    toggleDropDown() {
      this.dropDownIsOpen = !this.dropDownIsOpen;
    },
    getActiveComponent(item) {
      this.currentComponent = item;
    },
    chooseValidator(key) {
      this.selectedValidator = key;
      this.dropDownIsOpen = false;
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
  width: 70%;
  height: 100%;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.dynamicComponent .outterBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.componentParent .predicitionIcon {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
}
.componentParent .predicitionIcon img {
  width: 100%;
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
