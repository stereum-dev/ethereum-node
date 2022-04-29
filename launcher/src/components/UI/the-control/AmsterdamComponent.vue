<template>
  <div class="AmsParent">
    <div class="ttlLine">
      <div class="ttl"><span>NODE STARTED</span></div>
      <div class="dateLine">
        <span>{{ StopWatch }}</span>
      </div>
      <div class="icoByc">
        <img src="../../../../public/img/icon/amsterdam.png" />
      </div>
    </div>
    <div class="syncPart">
      <div class="icoPart">
        <img src="../../../../public/img/icon/testnetIconControl.png" />
        <span>{{ net }}</span>
      </div>
      <div class="syncItems">
        <div class="synTtl"><span>SYNCHRONISATION</span></div>
        <div class="syncCont">
          <span>Execution Client</span>
        </div>
        <div class="syncCont">
          <span>Consensus Client</span>
        </div>
      </div>
      <div class="epoch">
        <div class="synTtl"><span>EPOCH</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      StopWatch: "00:00",
      net: "NETWORK",
    };
  },
};
</script>

<style scoped>
.amsParent {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ttlLine {
  width: 100%;
  height: 1rem;
  display: flex;
}
.ttl {
  width: 30%;
  background-color: #33393e;
  border-radius: 10px 0 0 10px;
  border-radius: 0.2px solid grey;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ttl span {
  font-size: 50%;
}
.dateLine {
  width: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.dateLine span {
  font-size: 80%;
}
.icoByc {
  width: 20%;
  background-color: #33393e;
  border-radius: 0 10px 10px 0;
  border-radius: 0.2px solid grey;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icoByc img {
  width: 40%;
}
.syncPart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.icoPart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 20%;
}
.icoPart img {
  width: 40%;
  justify-self: center;
  align-self: center;
}
.icoPart span {
  font-size: 7px;
  border-radius: 10px;
  background-color: #33393e;
}
.synTtl {
  font-size: 8px;
  border-radius: 10px;
  background-color: #33393e;
  padding: 1px;
  width: 90%;
}
.synTtl span {
}
.syncItems {
  width: 40%;
  border-radius: 10px;
  background-color: rgb(41, 39, 39);
}
.syncCont {
  width: 100%;
  background-color: grey;
  height: 40%;
  display: flex;
  border-radius: 10px;
  align-items: center;
  padding: 1px;
}

.syncCont span {
  font-size: 8px;
}
.epoch {
  width: 20%;
}
</style>
