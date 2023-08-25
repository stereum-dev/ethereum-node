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
          <label for="pickPath">Pick a save path</label
          ><input id="pickPath" v-model="pickPath" type="text" @click="openDirectoryPicker" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="sshPass">ssh password</label
          ><input
            id="sshPass"
            v-model="sshPass"
            :class="[controlPass, checkedPass]"
            type="password"
            :placeholder="passControl ? alertMessage : 'DEFINE AN OPTIONAL SSH PASSWORD'"
          />
        </div>
        <div class="generate-key-modal_rows">
          <label for="sshPass">re-enter password</label
          ><input
            id="sshPass"
            v-model="reEnterSshPass"
            type="password"
            :placeholder="passControl ? alertMessage : 'RE-ENTER THE CHOOSEN SSH PASSWORD'"
            :class="[controlPass, checkedPass]"
          />
        </div>
        <div class="generate-key-modal_rows">
          <label for="unlockExpert">unlock expert options</label>
          <div class="toggle" :style="{ backgroundColor: expert ? '#0BB910' : '#808080' }" @click="expertUnlock">
            <div class="toggle-circle" :class="{ animate: expert }" />
          </div>
        </div>
        <div class="generate-key-modal_rows">
          <label for="bitAmount">bit amount</label
          ><input
            id="bitAmount"
            v-model="bitAmount"
            type="text"
            placeholder="SPECIFY SSH BIT AMOUNT"
            :disabled="bitAmountControl"
            @mousedown.prevent.stop
            @click="bitAmountDropdown = !bitAmountDropdown"
          />
          <div v-if="bitAmountDropdown" class="dropdown bit-amount-dropdown">
            <div v-for="bit in bitAmountCollection" :key="bit" class="dropdown-row" @click="bitPicker(bit)">
              <span>{{ bit }}</span>
            </div>
          </div>
        </div>
        <div class="generate-key-modal_rows">
          <label for="specifyCypher">specify cypher</label>
          <input
            id="specifyCypher"
            v-model="specifyCypher"
            type="text"
            placeholder="USE A CUSTOM CYPER"
            :disabled="cypherControl"
            @mousedown.prevent.stop
            @click="cypherDropdown = !cypherDropdown"
          />
          <div v-if="cypherDropdown" class="dropdown cypher-dropdown">
            <div v-for="cypher in specifyCypherItems" :key="cypher" class="dropdown-row" @click="bitPicker(bit)">
              <span>{{ cypher }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="generate-btn" @click="generateKey">generate</div>
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
      pickPath: "",
      sshPass: "",
      bitAmount: "",
      specifyCypher: "",
      generatedKey: {},
      bitAmountCollection: ["1024", "2048", "4096", "8192", "16384", "32768", "65536", "131072"], //dummy data
      bitAmountDropdown: false,
      reEnterSshPass: "",
      passControl: false,
      alertMessage: "The passwords do not match",
      cypherDropdown: false,
      specifyCypherItems: ["aes128-ctr", "aes192-ctr", "aes256-ctr", "aes128-gcm"],
    };
  },
  computed: {
    ...mapWritableState(useControlStore, {
      generateModalShow: "generateModalShow",
    }),
    cypherControl() {
      if (this.reEnterSshPass === this.sshPass && this.sshPass !== "" && this.expert === true) {
        return false;
      } else {
        return true;
      }
    },
    bitAmountControl() {
      if ((this.keyType === "RSA" || this.keyType === "EDCSA") && this.expert === true) {
        return false;
      } else {
        return true;
      }
    },
    controlPass() {
      return this.passControl ? "again" : "";
    },
    checkedPass() {
      return this.sshPass === this.reEnterSshPass ? "check" : "again";
    },
  },
  watch: {
    expert() {
      if (!this.expert) {
        this.bitAmount = "";
        this.specifyCypher = "";
        this.bitAmountDropdown = false;
      }
    },
  },
  methods: {
    expertUnlock() {
      this.expert = !this.expert;
    },
    keyPicker(arg) {
      this.keyType = arg;
      this.keyTypeDropdown = false;
    },
    bitPicker(arg) {
      this.bitAmount = arg;
      this.bitAmountDropdown = false;
    },
    generateKey() {
      if (this.sshPass !== this.reEnterSshPass) {
        alert("The passwords do not match");
        this.sshPass = "";
        this.reEnterSshPass = "";
        this.passControl = true;
      } else {
        const data = {
          keyType: this.keyType,
          pickPath: this.pickPath,
          sshPass: this.sshPass,
          bitAmount: this.bitAmount,
          specifyCypher: this.specifyCypher,
        };

        this.generatedKey = data;
        console.log(this.generatedKey);
        this.generateModalShow = false;
      }
    },
    async openDirectoryPicker() {
      try {
        const handle = await window.showDirectoryPicker();
        this.pickPath = handle.name;
      } catch (error) {
        // Handle case when user cancels directory picker
        if (error.name === "AbortError") {
          this.pickPath = "";
        } else {
          console.error("Error picking directory:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.again {
  border: 1px solid #b9110b !important;
}
.check {
  border: 2px solid #0bb92b !important;
}
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
  height: 75%;
  background-color: #33393e;
  position: absolute;
  top: 5%;
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
  font-size: 85%;
  font-weight: 600;
  text-transform: uppercase;
}
.generate-key-modal_rows input {
  width: 65%;
  border-radius: 5px;
  font-size: 80%;
  padding-left: 2%;
  font-weight: 500;
  border: none;
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
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.bit-amount-dropdown {
  top: 66.3%;
  overflow-y: scroll;
}
.cypher-dropdown {
  top: 77%;
  overflow-y: scroll;
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
  padding: 0 0.7%;
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
  transform: translateX(99%);
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
