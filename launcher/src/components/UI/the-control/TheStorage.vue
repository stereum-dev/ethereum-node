<template>
  <div class="storage-parent">
    <div class="storage-box">
      <div class="storage-icon">
        <div class="storage-icon_container">
          <img src="../../../../public/img/icon/control/ServiceIcon.png" />
        </div>
        <span>{{ $t("controlPage.storage") }}</span>
      </div>
      <div class="storage-data_box">
        <img v-show="isLoading" class="bttnLoading" :src="bttnLoading" />
        <div v-show="!isLoading" v-for="item in storagestatus" :key="item.id" class="storage-data_row">
          <div class="storage-data_row_title">
            <span>{{ item.title }}</span>
          </div>
          <div class="storage-data_row_value">
            <span>{{ item.storageValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
export default {
  data() {
    return {
      // datas are dummy, but the best stracture for the design is like this
      //for the wiring use this stracture
      isLoading: true, // initialize this here with true to show a spinner
      bttnLoading: "/img/icon/control/spinner.gif",
    };
  },
  computed: {
    ...mapState(useControlStore, {
      storagestatus: "storagestatus",
    }),
  },
  watch: {
    storagestatus(newVal) {
      if (newVal && Array.isArray(newVal) && newVal.length) {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.bttnLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
}
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
  color: #c1c1c1;
}
.storage-icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.storage-icon_container img {
  width: 72%;
  height: 90%;
}
.storage-data_box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
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
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  padding: 1% 2%;
}
.storage-data_row span {
  color: #c1c1c1;
  font-size: 0.6rem;
  margin-left: 2px;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
