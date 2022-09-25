<template>
  <div
    class="switch-network"
    @mouseleave="(closeDropdownActive = false), (dropdownIsActive = false)"
  >
    <div class="switch-network__content">
      <div class="current" @click="openDropDown">
        <div class="networkIcon">
          <img :src="currentNetwork.icon" alt="icon" />
        </div>
        <div class="networkSelect">
          <span>{{ currentNetwork.name }}</span>
        </div>
      </div>
      <ul class="dropdown-parent" v-if="dropdownIsActive">
        <li
          v-for="item in networkList"
          :key="item.id"
          @click="selectNetworkToDisplay(item)"
        >
          <div class="networkIcon">
            <img :src="item.icon" alt="icon" />
          </div>
          <div class="networkSelect">
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="dropdown-box" @click="openDropDown">
      <img
        :class="{ 'close-dropdown': closeDropdownActive }"
        class="dropdown-icon"
        src="/img/icon/manage-node-icons/down-1.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
export default {
  data() {
    return {
      closeDropdownActive: false,
      dropdownIsActive: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      networkList: "networkList",
      currentNetwork: "currentNetwork",
    }),
  },
  watch: {
    dropdownIsActive() {
      this.closeDropdownActive = this.dropdownIsActive;
    },
  },
  methods: {
    openDropDown() {
      this.dropdownIsActive = !this.dropdownIsActive;
      this.closeDropdownActive = !this.closeDropdownActive;
    },
    selectNetworkToDisplay(item) {
      this.currentNetwork = item;
      this.dropdownIsActive = false;
      this.closeDropdownActive = false;
    },
  },
};
</script>
<style scoped>
.switch-network {
  width: 95%;
  height: 10%;
  margin: 0 auto;
  padding: 5px;
  border-radius: 2px;
  border:1px solid #464646;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #3a3d40;
  box-sizing: border-box;
}
.switch-network__content {
  width: 98%;
  height: 100%;
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #272727;
  transition-duration: 0.3s;
}
.current {
  width: 98%;
  height: 98%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
}
.current .networkIcon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  margin-left: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.current .networkIcon img {
  width: 40%;
}
.current .networkSelect {
  grid-column: 3/5;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-right: 10px;
}
.current .networkSelect span {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(128, 181, 205);
  text-transform: uppercase;
  margin-right: 10px;
}
.dropdown-parent {
  width: 95%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2px;
  border-radius: 2px;
  position: absolute;
  top: 10%;
  left: 2.5%;
  z-index: 10;
}
.dropdown-parent li {
  width: 98%;
  height: 50%;
  padding: 5px 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  background-color: #414549;

  border-bottom: 1px solid rgb(93, 93, 93);
  cursor: pointer;
  transition-duration: 0.3s;
}
.dropdown-parent li:hover {
  background-color: #22afe7;
  transition-duration: 0.3s;
}

.dropdown-parent li .networkIcon {
  grid-column: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.dropdown-parent li .networkIcon img {
  width: 30%;
  margin-left: 5px;
}
.dropdown-parent li .networkSelect {
  grid-column: 3/5;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.dropdown-parent li .networkSelect span {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(211, 211, 211);
  text-transform: uppercase;
  margin-left: 17px;
}
.switch-network .dropdown-box {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  
  cursor: pointer;
}
.switch-network .dropdown-box .dropdown-icon {
  width: 50%;
  height: 50%;
}
.close-dropdown {
  transform: rotate(180deg);
}
</style>
