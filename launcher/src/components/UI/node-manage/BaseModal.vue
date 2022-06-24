<template>
  <div class="modal-bg">
    <div class="modal-box">
      <div class="modal-items">
        <div class="item" v-for="item in modalItems" :key="item.id">
          <img :src="item.sIcon" alt="icon" />
        </div>
      </div>
      <button class="close-btn" @click="$emit('closeMe')">
        <img src="/img/icon/manage-node-icons/close2.png" alt="" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["modalItems"],
};
</script>
<style scoped>
.modal-bg {
  width: 100%;
  height: 74%;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
.modal-box {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4f4f4f;
  position: relative;
}
.modal-items {
  width: 90%;
  height: 80%;
  background-color: #707070;
  display: grid;
  grid-template-columns: repeat(5, 17.9%);
  grid-template-rows: repeat(5, 16.3%);
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}
.item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.item img {
  width: 60px;
  height: 60px;
}
.modal-items::-webkit-scrollbar {
  display: none;
}
.close-btn {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 12px;
  color: #fff;
  outline-style: none;
  font-weight: 600;
  font-size: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-btn img {
  width: 100%;
}
.close-btn:hover {
  transform: scale(1.1);
}
.close-btn:active {
  transform: scale(1);
}
</style>
