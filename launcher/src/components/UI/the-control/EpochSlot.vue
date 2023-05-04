<template>
  <div class="epockSlot_parent">
    <commingSoon />
    <div class="epoch-box">{{ epoch }}</div>
    <div class="slot-box">{{ slot }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //this is dummy and these two data has to be number
      epoch: "{CURRENT EPOCH}",
      slot: "{CURRENT SLOT}",
    };
  },
};
</script>
<style scoped>
.epockSlot_parent {
  display: flex;
  width: 99%;

  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  color: #c1c1c1;
  position: relative;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  background: #2a2a2a;
}
.epockSlot_parent:hover {
  background: #313131;
}
.epoch-box,
.slot-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 90%;
  font-size: 70%;
  font-weight: 600;
}
.epoch-box {
  border-right: 2px solid #eee;
}
.slot-box {
  border-left: 2px solid #eee;
}
</style>
