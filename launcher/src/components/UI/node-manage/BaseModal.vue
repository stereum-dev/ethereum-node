<template>
  <div class="modal-bg">
    <div class="modal-box">
      <div class="modal-items">
        <div class="item" v-for="item in modalItems" :key="item.id">
          <img :src="item.source" alt="icon" />
        </div>
      </div>
      <button class="close-btn" @click="$emit('closeMe')">Close</button>
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
  width: 48.5vw;
  height: 87.6vh;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
.modal-box {
  width: 94%;
  height: 94%;
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
  position: absolute;
  top: 10px;
  right: 12px;
  border: 1px solid #ce4f4f;
  border-radius: 50px;
  background-color: #ce4f4f;
  color: #fff;
  outline-style: none;
  font-weight: bold;
}
</style>
