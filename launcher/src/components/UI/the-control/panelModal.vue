<template>
  <div class="modal-parent">
    <div class="modal-opacity" @click="$emit('close-modal')"></div>
    <div class="modal-box">
      <div class="modal">
        <div class="show-item">
          <div class="items-container">
            <div class="item-title">
              <span>{{ item.title }}</span>
            </div>
            <div class="item-description">
              <p>{{ item.description }}</p>
            </div>
            <span class="exit">Click outside to close</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item']
}
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
.modal {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  background-color: #23392e;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 5px 1px rgb(6, 6, 6), inset 1px 1px 5px rgb(88, 114, 91);
}
.show-item {
  width: 94%;
  height: 92%;
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
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.item-title {
  width: 100%;
  height: 20%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-title span {
  width: 100%;
  height: 100%;
  font-size: 2rem;
  font-weight: 900;
  color: rgb(237, 78, 78);
}
.item-description {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-description p {
  font-size: 1.2rem;
  font-weight: 900;
  text-align: justify;
  color: rgb(52, 51, 51);
}
.exit {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgb(37, 107, 126);
}
</style>
