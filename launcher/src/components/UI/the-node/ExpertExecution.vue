<template>
  <div class="expert-modal">
    <div class="serviceDetails">
      <span class="nameSpan">{{ item.name }}</span>
      <span class="category">{{ item.category }} client</span>
      <span class="serviceId">ID: {{ item.config.serviceID }}</span>
    </div>
    <div class="expertRow">
      <div class="dataTitleBox" @click="$emit('openExpert')">
        <img
          class="titleIcon"
          src="../../../../public/img/icon/plugin-menu-icons/crown2.png"
          alt="icon"
        />
        <span>Expert Mode</span>
        <img
          v-if="isExpertModeActive"
          src="../../../../public/img/icon/task-manager-icons/up.png"
          alt=""
        />
        <img
          v-else
          src="../../../../public/img/icon/task-manager-icons/down.png"
          alt=""
        />
      </div>
      <div class="endpointPort">
        <img
          class="titleIcon"
          src="../../../../public/img/icon/plugin-menu-icons/endpoints.png"
          alt="icon"
        />
        <span>RPC Endpoint-Port</span>
        <span
          class="portOff"
          v-if="enterPortIsEnabled"
          @click="$emit('turnOff')"
          >OFF</span
        >
        <span class="portOn" v-else @click="$emit('turnOn')">ON</span>
        <input
          class="inputPort"
          type="text"
          v-model="enteredPort"
          :class="{ disabled: !enterPortIsEnabled }"
        />
      </div>
      <div class="prunning">
        <img
          src="../../../../public/img/icon/plugin-menu-icons/ram1.png"
          alt="icon"
        />
        <span class="prunningTitle">Prunning</span>
        <span class="startPrunning" v-if="isPrunningActive"
          >prunning . . .</span
        >
        <span class="initiate" v-else @click="$emit('prunningActive')"
          >INITIATE</span
        >
      </div>
    </div>
    <div class="expertTable">
      <div class="expertMode" v-if="isExpertModeActive">
        <textarea class="editContent" v-model="e.value"></textarea>
      </div>
    </div>
    <div class="btn-box">
      <span class="exit-btn">Click outside to close</span>
      <div class="confirmBtn" @click="$emit('confirmBtn', item)">
        <span>Confirm</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      editableData: null,
      enteredPort: "9006",
      checkedPrunning: null,
      isExpertModeActive: false,
      isPrunningActive: false,
      enterPortIsEnabled: false,
     
    };
  },
};
</script>
<style scoped>
.expert-modal .serviceDetails {
  width: 95%;
  height: 40px;
  border-bottom: 1px solid #adadad;
  border-radius: 9px 9px 0 0;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.serviceDetails .nameSpan {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 5px;
  color: #d3d3d3;
}
.serviceDetails .category {
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: -5%;
  color: #ababab;
}
.serviceDetails .serviceId {
  font-size: 0.6rem;
  font-weight: 500;
  color: #ababab;
  justify-self: end;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}
.expertRow {
  width: 95%;
  height: 35%;
  margin: 5px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  z-index: 1003;
}

.expertRow .dataTitleBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 3px 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-duration: 200ms;
}
.expertRow .ramTitleBox {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;
}
.ramTitleBox .spaceParent {
  grid-column: 3/4;
  grid-row: 1;
  width: 100%;
  height: 21px;
  margin-top: 1px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.ramTitleBox .spaceParent select {
  width: 86%;
  height: 94%;
  margin-right: 3px;
  border-radius: 25px;
  color: #4c4c4c;
  padding: 0;
  padding-left: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.spaceParent select option {
  height: 10px;
}

.expertRow .ramTitleBox img {
  grid-column: 1/2;
  margin-left: 20px;
  width: 20px;
  height: 20px;
}
.expertRow .endpointPort,
.expertRow .apiBinding {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 1px 4px 0 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 2fr;
  grid-template-rows: 1fr;
  transition-duration: 200ms;
}

.expertRow .dataTitleBox:hover {
  border: 1px solid #d6d6d6;
  color: #d9d9d9;
}

.expertRow .dataTitleBox:active {
  border: 1px solid #2d2d2d;
}

.expertRow .dataTitleBox img {
  width: 20px;
  height: 20px;
}
.expertRow .prunning {
  width: 100%;
  height: 25px;
  margin: 2px auto;
  padding: 1px 4px 0 20px;
  border: 1px solid #8a8a8a;
  border-radius: 25px;
  background-color: #8a8a8a;
  text-align: center;
  color: #393939;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: default;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  transition-duration: 200ms;
}
.expertRow .prunning img {
  grid-column: 1/2;
  grid-row: 1;
  width: 20px;
  height: 20px;
}
.expertRow .prunning .prunningTitle {
  grid-column: 2/4;
  grid-row: 1;
  margin-left: 54px;
}
.expertRow .prunning .initiate {
  grid-column: 4/6;
  grid-row: 1;
  width: 58%;
  height: 96%;
  background-color: rgb(49, 88, 66);
  border-radius: 20px;
  border: 1px solid #8a8a8a;
  padding: 2px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(207, 207, 207);
  box-shadow: 0 1px 3px 1px rgb(91, 91, 91);
  justify-self: end;
  cursor: pointer;
  transition-duration: 200ms;
}
.expertRow .prunning .initiate:hover {
  border: 1px solid #dedede;
}
.expertRow .prunning .initiate:active {
  transform: scale(0.95);
}
.expertRow .prunning .startPrunning {
  grid-column: 4/6;
  grid-row: 1;
  width: 58%;
  height: 96%;
  background-color: #238dce;
  border-radius: 20px;
  border: 1px solid #0c81c9;
  padding: 2px;
  font-size: 0.6rem;
  font-weight: 600;
  color: rgb(239, 239, 239);
  justify-self: end;
}
.expertRow .endpointPort .inputPort,
.apiBinding .inputApi {
  grid-column: 5/7;
  grid-row: 1;
  width: 65%;
  height: 90%;
  border-radius: 20px;
  padding: 0;
  padding-left: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(44, 44, 44);
  justify-self: end;
}
.disabled {
  opacity: 0.6 !important;
  background-color: rgb(104, 104, 104) !important;
  pointer-events: none !important;
}
.endpointPort span,
.apiBinding span {
  grid-column: 3/5;
  grid-row: 1;
  padding-left: 29px;
  width: 100%;
  height: 100%;
}
.endpointPort .portOn,
.apiBinding .apiOn {
  grid-column: 5/6;
  grid-row: 1;
  width: 25px;
  height: 20px;
  padding: 4px;
  margin-left: 10px;
  box-shadow: 0 1px 3px 1px rgb(93, 93, 93);
  border-radius: 3px;
  background-color: rgb(9, 193, 101);
  color: #f0f0f0;
  font-size: 0.6rem;
  font-weight: 700;
  cursor: pointer;
}
.endpointPort .portOff,
.apiBinding .apiOff {
  grid-column: 5/6;
  grid-row: 1;
  width: 26px;
  height: 20px;
  padding: 4px;
  margin-left: 10px;
  box-shadow: 0 1px 3px 1px rgb(93, 93, 93);
  border-radius: 3px;
  background-color: rgb(242, 75, 75);
  color: #d9d9d9;
  font-size: 0.6rem;
  font-weight: 700;
  cursor: pointer;
}
.portOff:active,
.portOn:active,
.apiOff:active,
.apiOn:active {
  transform: scale(0.9);
  box-shadow: none;
}
.expertRow .endpointPort img,
.expertRow .apiBinding img {
  grid-column: 1/2;
  grid-row: 1;
  width: 18px;
  height: 18px;
}
.expertTable {
  width: 100%;
  height: 48%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expertTable .expertMode {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expertTable .expertMode .editContent {
  width: 95%;
  height: 95%;
  background-color: rgb(46, 46, 46);
  resize: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d9d9d9;
}

.expert-modal .btn-box {
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 50px;
}
.expert-modal .btn-box .exit-btn {
  grid-column: 2/3;
  margin: 0 auto;
  grid-row: 1;
  color: #e24949;
  font-size: 0.6rem;
  font-weight: 500;
  align-self: flex-end;
}

.expert-modal .btn-box .confirmBtn {
  grid-column: 3/4;
  grid-row: 1;
  margin-right: 20px;
  width: 90%;
  height: 25px;
  padding: 3px;
  border: 2px solid #609879;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  justify-self: flex-end;
  transition-duration: 150ms;
}
.expert-modal .btn-box .confirmBtn span {
  font-size: 0.8rem;
  font-weight: 700;
  color: #609879;
  text-align: center;
}
.expert-modal .btn-box .confirmBtn:hover {
  transform: scale(1.1);
  background-color: #609879;
}
.expert-modal .btn-box .confirmBtn:hover span {
  color: #e0e0e0;
}
.expert-modal .btn-box .confirmBtn:active {
  transform: scale(1);
}
.expertMode::-webkit-scrollbar {
  width: 5px;
  margin: 5px 0;
}

/* Track */
.expertMode::-webkit-scrollbar-track {
  background: transparent;
  margin: 20px 0;
  cursor: pointer;
}

/* Handle */
.expertMode::-webkit-scrollbar-thumb {
  background: rgb(112, 199, 249);
  border-radius: 3px;
}

/* Handle on hover */
.expertMode::-webkit-scrollbar-thumb:hover {
  background: rgb(24, 161, 241);
}
</style>
