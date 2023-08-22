<template>
  <div class="generate-key-modal-parent">
    <div class="generate-key-modal">
      <div class="generate-key-modal_title"><span>Generate a Key</span></div>
      <div class="generate-key-modal_container">
        <div class="generate-key-modal_rows">
          <label for="keyType">key type</label>
          <div class="key-type-selection">
            <span>{{ pickPath }}</span>
          </div>
        </div>
        <div class="generate-key-modal_rows">
          <label for="pickPath">Pick a save path</label><input id="pickPath" type="text" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="sshPass">ssh password</label
          ><input type="password" placeholder="DEFINE AN OPTIONAL SSH PASSWORD" />
        </div>
        <div class="generate-key-modal_rows"><label for="unlockExpert">unlock expert options</label></div>
        <div class="generate-key-modal_rows">
          <label for="bitAmount">bit amount</label><input type="text" placeholder="SPECIFY SSH BIT AMOUNT" />
        </div>
        <div class="generate-key-modal_rows">
          <label for="specifyCypher">specify cypher</label>
          <input
            ref="input4"
            v-model="pickPath"
            type="text"
            class="test"
            placeholder="USE A CUSTOM CYPER"
            @click="console.log('test', $refs.input4)"
            @focus="handleFocus"
          />
        </div>
      </div>
      <button>click</button>
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
      pickPath: "",
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
  border: 1px dotted yellow;
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
</style>
