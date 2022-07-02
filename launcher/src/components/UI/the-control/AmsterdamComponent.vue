<template>
  <div class="amsterdamparent">
    <div class="icoTitle">
      <div class="icoContainer">
        <img src="../../../../public/img/icon/control/testnetIconControl.png" />
      </div>
      <span>NODE</span>
    </div>
    <div class="docBox">
      <div class="upSide">
        <div class="epochBox">
          <div class="ttlEpoch"><span>EPOCH</span></div>
          <div class="epochText">
            <span>{{ counter }} #</span>
          </div>
          <div class="downTtl"><span class="downTtl">CONFIRMED</span></div>
        </div>
      </div>
      <div class="downSide">
        <div class="fahrradIco">
          <img src="../../../../public/img/icon/control/amsterdam.png" />
        </div>
        <div class="dateBox">
          <span>000000000 days</span>
          <span>-00h - 00m - 00s</span>
        </div>
        <div class="circleArrow">
          <img :src="activeIco" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      counter: 0,
      syncIco: [
        {
          id: 1,
          name: "error",
          icon: "/img/icon/arrows/SynchronisationIconError.gif",
        },
        {
          id: 2,
          name: "active",
          icon: "/img/icon/arrows/SynchronisationIconActive.gif",
        },
        {
          id: 3,
          name: "synched",
          icon: "/img/icon/arrows/SynchronisationIconSynchronized.gif",
        },
      ],
    };
  },
  computed: {
    errorIco() {
      return this.syncIco[0].icon;
    },
    activeIco() {
      return this.syncIco[1].icon;
    },
    synchedIco() {
      return this.syncIco[2].icon;
    },
  },
};
</script>
<style scoped>
.amsterdamparent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
}
.icoTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 100%;
}
.icoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.icoContainer img {
  width: 80%;
}
.icoTitle span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
}
.docBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.upSide {
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.epochBox {
  width: 95%;
  height: 98%;
  display: flex;
  background: #33393e;
  flex-direction: column;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.ttlEpoch {
  width: 90%;
  display: flex;
  height: 22%;
  font-size: 50%;
  margin-bottom: 2%;
  font-weight: bold;
}
.epochText {
  width: 90%;
  height: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 1px solid #eee;
  background: #000;
  font-size: 80%;
  padding-right: 2%;
}
.downTtl {
  width: 90%;
  height: 22%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 15%;
  margin-top: 1%;
}
.downSide {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fahrradIco {
  height: 85%;
  width: 20%;
  background: #33393e;
  border: 1px solid #191b1d;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fahrradIco img {
  width: 80%;
}
.dateBox {
  width: 40%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 45%;
  background: #33393e;
  border-radius: 5px;
  border: 1px solid #191b1d;
}

.circleArrow {
  width: 20%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5%;
  background: #33393e;
  border-radius: 5px;
  border: 1px solid #191b1d;
}
.circleArrow img {
  width: 60%;
}
</style>
