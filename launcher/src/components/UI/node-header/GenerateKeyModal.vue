<template>
  <div class="generate-key-modal-parent">
    <div class="generate-key-modal">
      <div class="generate-key-modal_title"><span>Generate a Key</span></div>
      <div class="generate-key-modal_container">
        <div class="generate-key-modal_rows">
          <label for="keyType">key type</label>
          <div class="key-type-selection" @click="keyTypeDropdown = !keyTypeDropdown">
            <span>{{ keyType }}</span>
          </div>
          <div v-if="keyTypeDropdown" class="dropdown">
            <div v-for="key in keyTypeCollection" :key="key" class="dropdown-row" @click="keyPicker(key)">
              <span>{{ key }}</span>
            </div>
          </div>
        </div>
        <div class="generate-key-modal_rows">
          <label for="pickPath">Pick a save path</label><input id="pickPath" type="text" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="sshPass">ssh password</label
          ><input type="password" placeholder="DEFINE AN OPTIONAL SSH PASSWORD" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="unlockExpert">unlock expert options</label>
          <div class="toggle" :style="{ backgroundColor: expert ? '#0BB910' : '#808080' }" @click="expertUnlock">
            <div class="toggle-circle" :class="{ animate: expert }" />
          </div>
        </div>
        <div class="generate-key-modal_rows">
          <label for="bitAmount">bit amount</label
          ><input type="text" placeholder="SPECIFY SSH BIT AMOUNT" :disabled="!expert" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="specifyCypher">specify cypher</label>
          <input type="text" placeholder="USE A CUSTOM CYPER" :disabled="!expert" />
        </div>
      </div>
      <div class="generate-btn">generate</div>
      <span class="click-close">click out site to close</span>
    </div>
    <div class="bg-modal" @click="generateModalShow = false" />
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useControlStore } from "@/store/theControl";
export default {
  data() {
    return {
      keyType: "RSA",
      keyTypeDropdown: false,
      keyTypeCollection: ["RSA", "EDCSA", "ED25519"],
      expert: false,
    };
  },
  computed: {
    ...mapWritableState(useControlStore, {
      generateModalShow: "generateModalShow",
    }),
  },
  methods: {
    handleFocus() {
      console.log("Input focused!");
    },
    expertUnlock() {
      this.expert = !this.expert;
    },
    keyPicker(key) {
      this.keyType = key;
      this.keyTypeDropdown = false;
    },
  },
};
</script>

<style scoped>
.generate-key-modal-parent {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 53;
}
.bg-modal {
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}
.generate-key-modal {
  width: 50%;
  height: 60%;
  background-color: #33393e;
  position: absolute;
  top: 25%;
  left: 25%;
  z-index: 54;
  border-radius: 50px;
  border: 5px solid #c1c1c1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
}
.generate-key-modal_title {
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #eee;
}
.generate-key-modal_container {
  width: 90%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.generate-key-modal_rows {
  width: 100%;
  height: 16%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.generate-key-modal_rows label {
  color: #eee;
  font-size: 100%;
  font-weight: 600;
  text-transform: uppercase;
}
.generate-key-modal_rows input {
  width: 65%;
  border-radius: 5px;
  font-size: 80%;
  padding-left: 2%;
  font-weight: 500;
}
.key-type-selection {
  width: 65%;
  height: 80%;
  background: #383838;
  border: 1px solid #707070;
  border-radius: 5px;
  padding-left: 2%;
}
.key-type-selection span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #eee;
  font-size: 100%;
  font-weight: 600;
  text-transform: uppercase;
}
.dropdown {
  width: 55%;
  background: #1258a2;
  color: #d5d5d5;
  height: 33%;
  position: absolute;
  top: 26%;
  left: 38%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.dropdown-row {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
  cursor: pointer;
}
.dropdown-row:hover {
  background: #d5d5d5;
  color: #1258a2;
}
.toggle {
  width: 10%;
  height: 60%;

  border-radius: 20px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  padding: 0 0.8%;
}
.toggle-circle {
  width: 50%;
  height: 85%;
  background: #eee;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease;
}
.animate {
  transform: translateX(95%);
}
.generate-btn {
  width: 30%;
  height: 10%;
  background: #0bb910;
  color: #d5d5d5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 100%;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
}
.generate-btn:hover {
  background: rgba(53, 168, 53, 0.5);
}
.generate-btn:active {
  background: rgba(53, 168, 53, 0.8);
  box-shadow: none;
  transform: scale(0.98);
}
.click-close {
  color: red;
  justify-self: flex-end;
  margin-top: 3.2%;
  font-size: 70%;
  text-transform: uppercase;
}
</style>
