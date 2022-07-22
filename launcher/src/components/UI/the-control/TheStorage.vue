<template>
  <div class="storage-parent">
    <div class="storage-box">
      <div class="storage-icon">
        <div class="storage-icon_container">
          <img src="../../../../public/img/icon/control/ServiceIcon.png" />
        </div>
        <span>STORAGE</span>
      </div>
      <div class="storage-data_box">
        <div
          class="storage-data_row"
          v-for="item in storageDataItems"
          :key="item.id"
        >
          <div class="storage-data_row_title">
            <span>{{ item.title }}</span>
          </div>
          <div class="storage-data_row_value">
            <span>{{ item.storageValue }} GB</span>
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
      storageDataItems: [
        {
          id: 1,
          title: "GETH",
          storageValue: 13.2,
        },
        {
          id: 2,
          title: "PRYSM",
          storageValue: 13.2,
        },
        {
          id: 3,
          title: "PRYSM VC",
          storageValue: 13.2,
        },
      ],
    };
  },
};
</script>
<style scoped>
.storage-parent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.storage-box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.storage-icon {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.storage-icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
}
.storage-icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.storage-icon_container img {
  width: 80%;
}
.storage-data_box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  flex-direction: column;
}
.storage-data_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 25%;
  margin: 1.2px;
  font-size: 70%;
  font-weight: 600;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 1% 2%;
}
</style>
