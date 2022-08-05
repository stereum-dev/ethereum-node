<template>
  <div class="selection-box">
    <div class="selection-table">
      <div
        class="buttonRow"
        v-for="(button, index) in buttonState"
        :key="index"
        @click="$emit('clickBtn', button)"
      >
        <div class="btnContent">
          <img :src="button.icon" alt="icon" />
          <span>{{ button.displayName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["buttonState"],
  methods: {},
};
</script>
<style scoped>
.selection-box {
  grid-column: 10/13;
  grid-row: 3/4;
  width: 90%;
  height: 95%;
  border: 4px solid #bfbfbf;
  border-radius: 10px;
  background-color: #464a44;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.selection-table {
  width: 98%;
  height: 98%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.selection-table .buttonRow:last-child {
  position: absolute;
  bottom: 2px;
  padding: 5px 8px 3px 8px;
}

.buttonRow {
  width: 99%;
  height: 25px;
  border-radius: 20px;
  border: 1px solid #eee;
  padding: 5px 8px 3px 8px;
  background-color: #dfdfdf;
  box-shadow: 0 1px 5px 1px rgb(32, 32, 32);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btnContent {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 100%;
  width: 90%;
  align-items: center;
}
.buttonRow img {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 19px;
  height: 100%;
}
.buttonRow span {
  grid-column: 2;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgb(57, 57, 57);
  text-align: center;
  text-transform: uppercase;
}

.buttonRow:hover {
  transition-duration: 100ms;
  background-color: #3d746e;
  box-shadow: none;
}
.buttonRow:hover span {
  transition-duration: 100ms;
  color: #fff;
}
.buttonRow:active {
  padding: 4px 8px;
  transform: scale(0.96);
  box-shadow: none;
}
</style>
