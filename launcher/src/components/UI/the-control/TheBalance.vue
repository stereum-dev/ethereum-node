<template>
  <div class="balance-parent">
    <CommingSoon />
    <div class="finilized-box">
      <div class="finilizes-value">{{ final }}</div>
      <div class="title">FINALIZED SLOT</div>
    </div>
    <div class="balance-box">
      <div class="balance-value">{{ balance }}</div>
      <div class="title">BALANCE CHANGE</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      final: "{LAST FINALIZED SLOT}", //dummy
      balance: 0, //dummy
    };
  },
};
</script>
<style scoped>
.balance-parent {
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
.balance-parent:hover {
  background: #313131;
}
.balance-box,
.finilized-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 50%;
  color: #eee;
  width: 50%;
  height: 100%;
  font-weight: 600;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  color: #eee;
  width: 100%;
  height: 50%;
}
.finilizes-value,
.balance-value {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 100%;
  width: 100%;
  height: 50%;
}
.balance-value {
  color: #74fa65;
}
</style>
