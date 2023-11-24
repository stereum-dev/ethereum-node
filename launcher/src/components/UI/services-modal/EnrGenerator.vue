<template>
  <div class="obol-modal-plugin_parent">
    <div class="obol-modal-plugin_header"><span>GENERATING NEW ENR</span></div>
    <div class="obol-modal-plugin_spaceWindow">
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni qui veritatis officiis quos culpa. Error
        corporis atque rerum natus ipsum.
      </p>
    </div>
    <div class="obol-modal-plugin_btn">GENERATING...</div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.obol-modal-plugin_parent {
  width: 95%;
  height: 90%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.obol-modal-plugin_header {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1% 0;
}
.obol-modal-plugin_header span {
  color: #dbdbdb;
  font-size: 1.2rem;
  font-weight: 600;
}
.obol-modal-plugin_spaceWindow {
  width: 90%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  padding: 1%;
  cursor: text;
  color: #dbdbdb;
  font-size: 100%;
  font-weight: 400;
}
.obol-modal-plugin_btn {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  cursor: pointer;
  color: #dbdbdb;
  font-size: 1rem;
  font-weight: 600;
  margin: 2% 0;
}
.obol-modal-plugin_btn:hover {
  transition-duration: 100ms;
  background-color: #1e3a3f;
}
.obol-modal-plugin_btn:active {
  transition-duration: 100ms;
  background-color: #1e3a3f;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
