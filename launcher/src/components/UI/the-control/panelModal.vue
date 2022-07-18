<template>
  <div class="modal-parent">
    <div class="modal-opacity" @click="closeModel"></div>
    <div class="modal-box">
      <div class="modal-item">
        <div class="show-item">
          <div class="items-container">
            <div class="item-title">
              <span>{{ item.title }}</span>
            </div>
            <div class="item-description">
              <p>{{ item.description }}</p>
            </div>
            <div class="item-ip" v-if="item.ipBox">
              <input type="text" placeholder="127.0.0.1" v-model="ip" />
            </div>
            <div class="item-img-box">
              <div class="item-img">
                <img :src="item.img" />
              </div>
              <div class="item-img-discription">
                <span>{{ item.idescript }}</span>
              </div>
            </div>
            <div class="item-btn-box">
              <div class="item-btn" @click="btnAction">
                <span>{{ item.btn }}</span>
              </div>
            </div>
            <div class="item-footer">
              <span class="exit">Click outside to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  emits: ["click-option", "close-modal"],
  data() {
    return {
      ip: null,
      ipList: [],
    };
  },
  methods: {
    closeModel() {
      this.$emit("close-modal");
    },
    clickOption() {
      this.$emit("click-option");
    },
    btnAction() {
      if (this.item.ipBox) {
        alert(this.ip);
        var ipVar = this.ip;
        this.ipList.push(ipVar);
        this.ip = "";
        console.log(this.ipList);
      } else {
        alert("initite");
      }
    },
  },
};
</script>
<style scoped>
.modal-parent {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: -7px;
  left: -11px;
  z-index: 5;
}
.modal-opacity {
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  z-index: 6;
  opacity: 0.8;
}

.modal-box {
  width: 45%;
  height: 68%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16%;
  left: 28%;
  z-index: 7;
}
.modal-item {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 5px 1px rgb(6, 6, 6), inset 1px 1px 5px rgb(88, 114, 91);
}
.show-item {
  width: 100%;
  height: 100%;
  background-color: rgb(186, 186, 186);
  border: 1px solid rgb(35, 47, 38);
  border-radius: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px 1px rgb(0, 0, 0);
}
.items-container {
  width: 90%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.item-title {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120%;
  font-weight: 900;
  color: rgb(237, 78, 78);
}

.item-description {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 100%;
  font-weight: 700;
  text-align: justify;
  color: rgb(52, 51, 51);
  line-height: 200%;
}

.item-img-box {
  display: flex;
  width: 100%;
  height: 20%;
}
.item-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
}
.item-img-box img {
  width: 55%;
}
.item-img-discription {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 50%;
  color: #494949;
  font-size: 60%;
  flex-direction: column;
  text-align: left;
}
.item-btn-box {
  display: flex;
  width: 80%;
  height: 20%;
  justify-content: center;
  align-items: center;
}
.item-btn {
  width: 35%;
  height: 50%;
  border: 3px solid #707070;
  background: #33393e;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 400;
  color: #eee;
  border-radius: 10px;
}
.item-btn:hover,
.item-btn:focus {
  border: none;
  font-weight: 500;
}
.item-footer {
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgb(37, 107, 126);
  flex-direction: column;
}
.item-ip {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 15%;
}
.item-ip input {
  height: 70%;
  width: 100%;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #707070;
  color: #000;
  font-size: 100%;
  font-weight: 500;
}
.item-ip input:focus::placeholder {
  color: transparent;
}
</style>
