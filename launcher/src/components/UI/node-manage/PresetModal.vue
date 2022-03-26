<template>
  <div class="modal-container">
    <div class="modal-content">
      <div class="plugins">
        <div class="plugin-item">
          <img
            src="../../../../public/Img/icon/manage-node-icons/obol-ssv-icon.png"
            alt="icon"
          />
          <img
            src="../../../../public/Img/icon/manage-node-icons/obol-ssv-icon.png"
            alt="icon"
          />
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>CHOOSE A PRESET</span>
        </div>
        <div class="description">
          <p>
            Stereum gives you the choice of choosing different use case focused
            pre-sets. You don't automatically commit to the changes, it just
            recommends you a selection. Try them out!
          </p>
        </div>

        <router-link class="install-btn" :to="{ path: '/install' }">
          <button>INSTALL</button>
        </router-link>
      </div>
    </div>
    <div class="close-preset" @click="$emit('closePreset')">
      <img
        src="../../../../public/Img/icon/manage-node-icons/close.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ["modalStatus"],
};
</script>
<style scoped>
.modal-container {
  width: 99.9%;
  height: 99.1%;
  border-radius: 0 35px 0 0;
  background: rgb(26, 25, 33);
  border: 3px solid rgb(112, 189, 210);
  position: absolute;
  top: -2px;
}
.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.modal-content .plugins {
  width: 50%;
  height: 70%;
  border-right: 1px solid rgb(63, 70, 99);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content .plugins .plugin-item {
  width: 95%;
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}
.plugin-item img {
  width: 80px;
  height: 80px;
  justify-self: center;
  align-self: center;
  border-radius: 10px;
  box-shadow: 0 0 5px 1px rgb(19, 19, 19);
}
.modal-content .content {
  width: 50%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.content .title {
  width: 80%;
  height: 20%;
  border-bottom: 1px solid rgb(63, 70, 99);
}
.content .title span {
  color: rgb(206, 206, 206);
  font-size: 20px;
  font-weight: 900;
}
.content .description {
  width: 80%;
  height: 60%;
}
.content .description p {
  color: rgb(183, 183, 183);
  font-size: 15px;
  font-weight: 500;
  text-align: justify;
  overflow: hidden;
}
.content .install-btn {
  width: 30%;
  height: 11%;
  border: 3px solid rgb(160, 160, 160);
  border-radius: 30px;
  background-color: #254f4c;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 1px 2px 8px #000000, inset 0 0 8px 2px #3e7670;
}
.content .install-btn:hover {
  background-color: rgb(27, 62, 60);

  box-shadow: none;
}
.content .install-btn:active {
  font-size: 1rem;
  box-shadow: inset 1px 1px 8px 1px #000000;
}
.install-btn button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}
.close-preset {
  width: 25px;
  height: 25px;
  border-radius: 50px;
  position: fixed;
  top: 10%;
  right: 2%;
  background-color: #171b1f;
}
.close-preset img {
  width: 25px;
  height: 25px;
  border: 1px solid #212223;
  border-radius: 50px;
  box-shadow: 0 1px 5px 0 rgb(12, 12, 12), inset 0 1px 10px 0 rgb(48, 72, 99);
}
</style>
