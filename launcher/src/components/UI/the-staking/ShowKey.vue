<template>

</template>
<script>
export default {
  props: ["keyFiles"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.table-content {
  height: 92%;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: grid;
  grid-template-columns: 10% 80% 10%;
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
.table-row 
.table-row .remove-icon {
  grid-column: 3;
  width: 20px;
  justify-self: flex-end;
}
</style>
