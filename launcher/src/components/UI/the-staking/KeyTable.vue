<template>
  <div class="keys-parent">
    <div class="keys-table-box">
      <div class="keys-table">
        <div class="table-header">
          <span id="name">NAME</span>
          <span id="service">SERVICE</span>
          <span id="active">ACTIVE SINCE</span>
          <span id="state">STATE</span>
          <span id="balance">BALANCE</span>
          <span id="option">OPTTIONS</span>
        </div>
        <div
          class="table-content"
          :class="{ 'drop-active': isDragOver }"
          @drag.prevent.stop
          @dragstart.prevent.stop
          @dragend.prevent.stop="isDragOver = false"
          @dragover.prevent.stop="isDragOver = true"
          @dragenter.prevent.stop="isDragOver = true"
          @dragleave.prevent.stop="isDragOver = false"
          @drop.prevent.stop="dropFileHandler"
        >
          <div class="table-row" v-for="(item, index) in keyFiles" :key="index">
            <span class="circle"></span>
            <span class="category">{{ item.pubkey }}</span>
            <span class="username">Max Behzadi</span>
            <img
              class="service-icon"
              src="../../../../public/img/icon/the-staking/blox-service.png"
              alt="icon"
            />
            <span class="since">12d 11h 20m</span>
            <img
              class="state-icon"
              src="../../../../public/img/icon/the-staking/state-icon.png"
              alt="icon"
            />
            <span class="balance">24.000001</span>
            <div class="option-box">
              <div class="grafiti-box">
                <img
                  class="grafiti-icon"
                  src="../../../../public/img/icon/the-staking/option-graffiti.png"
                  alt="icon"
                />
                <div class="grafiti-text">GRAFITI</div>
              </div>
              <div class="copy-box">
                <img
                  class="copy-icon"
                  src="../../../../public/img/icon/the-staking/option-copy.png"
                  alt="icon"
                />
                <div class="copy-text">COPY</div>
              </div>
              <div class="remove-box">
                <img
                  class="remove-icon"
                  src="../../../../public/img/icon/the-staking/option-remove.png"
                  alt="icon"
                />
                <div class="remove-text">REMOVE</div>
              </div>
              <div class="exit-box">
                <img
                  class="exit-icon"
                  src="../../../../public/img/icon/the-staking/redexit-icon.png"
                  alt="icon"
                />
                <div class="exit-text">EXIT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle-icon">
      <img
        class="rename"
        src="../../../../public/img/icon/the-staking/rename-icon.png"
        alt="icon"
      />
      <img
        class="folder"
        src="../../../../public/img/icon/the-staking/newfolder-icon.png"
        alt="icon"
      />
      <img
        class="filter"
        src="../../../../public/img/icon/the-staking/staking-filter.png"
        alt="icon"
      />
      <div class="insert-key" @click="openUploader">
        <input
          type="file"
          @change="uploadFileHandler"
          style="display: none"
          ref="fileInput"
          multiple="multiple"
          accept="application/json"
        />
        <span>CLICK OR DRAG TO INSERT KEY</span>
        <img
          class="black-key"
          src="../../../../public/img/icon/the-staking/black-key.png"
          alt="icon"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDragOver: false,
      keyFiles: [],
    };
  },
  mounted() {},
  methods: {
    openUploader() {
      this.$refs.fileInput.click();
    },
    uploadFileHandler(event) {
      let uploadedFiles = event.target.files;
      this.keyFiles.push(uploadedFiles);
      this.isDragOver = false;
      console.log(uploadedFiles);
    },
    dropFileHandler(event) {
      console.log("drop", event);
      let droppedFiles = event.dataTransfer.files;
      this.keyFiles.push(droppedFiles);
      this.isDragOver = false;
      console.log(droppedFiles);
    },
  },
};
</script>
<style scoped>
.keys-parent {
  width: 100%;
  height: 100%;
  margin-left: 5px;
  grid-column: 1/10;
  grid-row: 1/4;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.keys-table-box {
  width: 96%;
  height: 92%;
  margin: 10px 10px 0 0;
  border: 4px solid #bfbfbf;
  border-radius: 20px;
}
.keys-table {
  width: 100%;
  height: 100%;
}

.table-header {
  height: 30px;
  border-bottom: 7px solid #bfbfbf;
  display: grid;
  grid-template-columns: 3% 17% 13% 8% 13% 6% 10% 30%;
}
.table-header span {
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.table-header #name {
  grid-column: 3;
}
.table-header #service {
  grid-column: 4;
}
.table-header #active {
  grid-column: 5;
}
.table-header #state {
  grid-column: 6;
}
.table-header #balance {
  grid-column: 7;
}
.table-header #option {
  grid-column: 8;
}
.table-content {
  height: 92%;
  overflow-x: hidden;
  overflow-y: auto;
}
.drop-active {
  width: 100%;
  height: 92%;
  background-color: rgb(44, 151, 128);
  opacity: 0.2;
  border-radius: 20px;
}
.table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 3% 17% 13% 8% 13% 6% 10% 30%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
  position: relative;
}
.table-row span {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}
.table-row .circle {
  grid-column: 1;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 auto;
  align-self: center;
}
.table-row .category {
  width: 100%;
  grid-column: 2;
  font-size: 13px;
}
.table-row .username {
  width: 100%;
  grid-column: 3;
  font-size: 10px;
}
.table-row .service-icon {
  width: 20px;
  grid-column: 4;
  justify-self: center;
}
.table-row .since {
  grid-column: 5;
  font-size: 10px;
}
.table-row .state-icon {
  width: 18px;
  grid-column: 6;
  justify-self: center;
}
.table-row .balance {
  grid-column: 7;
}

.option-box {
  grid-column: 8;
  width: 90%;
  height: 80%;
  border: 3px solid #bfbfbf;
  background-color: #000000;
  border-radius: 30px;
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  align-items: center;
}
.option-box img {
  width: 20px;
  height: 20px;
  margin: 0 auto;
}
.option-box img:hover {
  width: 23px;
  height: 23px;
  box-shadow: 0 0 4px 0 rgb(228, 230, 228);
}
.option-box img:active {
  width: 21px;
  height: 21px;
  box-shadow: none;
}
.option-box .copy-box {
  height: 100%;
  grid-column: 1/2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.option-box .grafiti-box {
  height: 100%;
  grid-column: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.option-box .remove-box {
  height: 100%;
  grid-column: 4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.option-box .exit-box {
  height: 100%;
  grid-column: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.middle-icon {
  width: 60%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 6%;
  left: 2%;
}
.middle-icon img {
  width: 30px;
  height: 30px;
}
.middle-icon .rename,
.middle-icon .folder {
  margin-right: 10px;
}
.middle-icon .filter {
  margin-right: 20px;
}
.middle-icon .insert-key {
  width: 70%;
  height: 32px;
  background-color: #bfbfbf;
  border-radius: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}
.middle-icon .insert-key span {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}
.middle-icon .insert-key img {
  width: 28px;
  height: 28px;
}

.grafiti-text {
  color: #fff;
  position: absolute;
  bottom: -20px;
  left: 50px;
  font-size: 10px;
  font-weight: 600;
  background-color: rgb(23, 22, 22);
  opacity: 0.7;
  display: none;
}
.copy-text {
  color: #fff;
  position: absolute;
  bottom: -20px;
  left: 10px;
  font-size: 10px;
  font-weight: 600;
  background-color: rgb(23, 22, 22);
  opacity: 0.7;
  display: none;
}
.exit-text {
  color: #fff;
  position: absolute;
  bottom: -20px;
  right: 12px;
  font-size: 10px;
  font-weight: 600;
  background-color: rgb(23, 22, 22);
  opacity: 0.7;
  display: none;
}
.remove-text {
  color: #fff;
  position: absolute;
  bottom: -20px;
  right: 49px;
  font-size: 10px;
  font-weight: 600;
  background-color: rgb(23, 22, 22);
  opacity: 0.7;
  display: none;
}
.option-box div:hover > .grafiti-text,
.option-box div:hover > .copy-text,
.option-box div:hover > .exit-text,
.option-box div:hover > .remove-text {
  display: block;
}
</style>
