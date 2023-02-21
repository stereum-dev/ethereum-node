<template>
  <div class="switch-network" @mouseleave="(closeDropdownActive = false), (dropdownIsActive = false);">
    <div class="switch-network__content">
      <div class="current" @click="openDropDown">
        <div class="networkIcon">
          <img :src="configNetwork.icon ? configNetwork.icon : loadingGIF" alt="icon" />
        </div>
        <div class="networkSelect">
          <span>{{ configNetwork.name }}</span>
        </div>
      </div>
      <ul v-if="dropdownIsActive" class="dropdown-parent">
        <li v-for="item in networkList" :key="item.id" @click="selectNetworkToDisplay(item)">
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
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
export default {
  data() {
    return {
      closeDropdownActive: false,
      dropdownIsActive: false,
      loadingGIF: "/img/icon/task-manager-icons/turning_circle_blue.gif",
    };
  },
  computed: {
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapWritableState(useNodeManage, {
      networkList: "networkList",
      currentNetwork: "currentNetwork",
      configNetwork: "configNetwork",
      newConfiguration: "newConfiguration",
      confirmChanges: "confirmChanges",
      actionContents: "actionContents",
    }),
  },
  watch: {
    dropdownIsActive() {
      this.closeDropdownActive = this.dropdownIsActive;
    },
    configNetwork: {
      handler: function (val) {
        this.changeConfig(val);
      },
      immediate: true,
    },
  },
  methods: {
    changeConfig(val) {
      const installed = JSON.parse(JSON.stringify(this.installedServices));
      this.newConfiguration = installed;
    },
    getActions(action, service, data) {
      let item = this.actionContents.find((item) => item.content === action);
      if (item) return { ...item, service: service, data: data };
      return undefined;
    },
    openDropDown() {
      this.dropdownIsActive = !this.dropdownIsActive;
      this.closeDropdownActive = !this.closeDropdownActive;
    },
    selectNetworkToDisplay(item) {
      if (!(item.network == this.configNetwork.network)) {
        if (this.confirmChanges.map((j) => j.content).includes("CHANGE NETWORK")) {
          let index = this.confirmChanges.findIndex((j) => j.content.includes("CHANGE NETWORK"));
          if (this.currentNetwork.network === item.network) {
            this.confirmChanges.splice(index, 1);
          } else {
            this.confirmChanges[index].data.network = item.network === "testnet" ? "goerli" : item.network;
            this.confirmChanges[index].service.icon = item.icon;
          }
        } else if (this.newConfiguration.length > 0) {
          this.confirmChanges.push(
            this.getActions(
              "CHANGE NETWORK",
              { icon: item.icon },
              { network: item.network === "testnet" ? "goerli" : item.network }
            )
          );
        }
      }
      this.configNetwork = item;
      this.dropdownIsActive = false;
      this.closeDropdownActive = false;
      console.log(this.configNetwork);
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
  border-radius: 5px;
  border: 1px solid #464646;
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
  border-radius: 5px 0 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #242529;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  width: 40%;
}
.current .networkSelect {
  grid-column: 2/5;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
}
.current .networkSelect span {
  font-size: 100%;
  font-weight: 700;
  color: #408886;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.dropdown-parent li .networkIcon img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  width: 30%;
  margin-left: 5px;
}
.dropdown-parent li .networkSelect {
  grid-column: 2/5;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
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
  border-radius: 0 5px 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #242529;

  cursor: pointer;
}
.switch-network .dropdown-box .dropdown-icon {
  width: 50%;
  height: 50%;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.close-dropdown {
  transform: rotate(180deg);
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>
