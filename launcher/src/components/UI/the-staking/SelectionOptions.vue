<template>
  <div class="selection-box">
    <div class="selection-table">
      <div
        class="selection-row"
        v-for="(item, index) in buttonState"
        :key="index"
      >
        <div class="row-content">
          <img :src="item.icon" alt="icon" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonState: [
        {
          id: 1,
          name: "grafiti",
          icon: "/img/icon/the-staking/option-graffiti.png",
        },
        {
          id: 2,
          name: "remove keys",
          icon: "/img/icon/the-staking/option-remove.png",
        },
        {
          id: 3,
          name: "change fee recipient",
          icon: "img/icon/the-staking/fee-icon2.png",
        },
        {
          id: 4,
          name: "exit chain",
          icon: "img/icon/the-staking/redexit-icon.png",
        },
      ],
    };
  },
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
.selection-table .selection-row:last-child {
  position: absolute;
  bottom: 0;
}
.selection-table .selection-row:nth-child(3).row-content span {
  font-size: ;
}
.selection-row {
  width: 99%;
  height: 25px;
  border-radius: 20px;
  background-color: #dfdfdf;
  box-shadow: 0 1px 5px 1px rgb(32, 32, 32);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.row-content {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 100%;
  width: 90%;
  align-items: center;
}
.selection-row img {
  grid-column: 1;
  width: 19px;
  height: 20px;
}
.selection-row span {
  grid-column: 2;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgb(57, 57, 57);
  text-align: center;
  text-transform: uppercase;
}

.selection-row:hover {
  transition-duration: 100ms;
  background-color: #3d746e;
  box-shadow: none;
}
.selection-row:hover span {
  transition-duration: 100ms;
  color: #fff;
}
.selection-row:active {
  transition-duration: 100ms;
  transform: scale(0.9);
  box-shadow: none;
}
</style>
