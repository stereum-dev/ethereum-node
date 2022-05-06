<template>
  <div class="parentVal">
    <div class="vldTtl"><span>Validator</span></div>
    <div class="rating">
      <img src="../../../../public/img/icon/Control/keyEth.svg" /><span
        class="vldCnt"
        >{{ vldCnt }}</span
      ><span>ACTIVE</span>
    </div>
    <div class="gewiParent">
      <div class="vldcontIn">
        <div class="vldIco">
          <img src="../../../../public/img/icon/Control/ethBag.svg" />
        </div>
        <div class="contVldNo">
          <div class="vldNo">
            <span>{{ vldIndex }}</span>
          </div>
          <div class="gewiNo">
            <span class="cnt">{{ gewiNo }}</span
            ><span>GEWI</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vldCnt: 1,
      vldIndex: 32.00000001,
      gewiNo: 1,
    };
  },
};
</script>

<style scoped>
.parentVal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.vldTtl {
  width: 50%;
}
.rating {
  display: flex;
  gap: 5%;
  
}
.rating img {
  width: 22%;
}
.rating span {
  font-size: 80%;
}
.gewiParent {
  display: flex;
}
.vldcontIn {
  display: flex;
}
.vldIco {
  width: 25%;
}
.vldIco img {
  width: 70%;
}
.contVldNo {
  display: flex;
  flex-direction: column;
}
.vldNo span{
    color: #74FA65;
    font-size: 70%;
}
.gewiNo span{
    font-size: 80%;
    font-weight: bold;
}
.cnt{
    font-size: 70%!important;
    margin: 5%;
}
</style>
