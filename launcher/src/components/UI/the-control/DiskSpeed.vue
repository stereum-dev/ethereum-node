<template>
  <div class="disk-speed_parent">
    <div class="dick-speed_box">
      <div class="disk-speed_icon">
        <div class="disk-speed_icon_container">
          <img src="/img/icon/control-page-icons/Speedmeter.png" />
        </div>
        <span>{{ $t("controlPage.disk") }}</span>
      </div>
      <div class="disk-speed_valueBox">
        <div
          class="disk-speed_value"
          @mouseenter="
            footerStore.cursorLocation = `write speed is ${convertWriteValueToMb} ${
              controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? 'Kilobyte' : 'MegaByte'
            }`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <div class="disk-speed_value_title">
            <span>{{ $t("controlPage.write") }}</span>
          </div>
          <div class="write_val">
            <span
              >{{ convertWriteValueToMb }}
              {{ controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}</span
            >
          </div>
        </div>
        <div
          class="disk-speed_value"
          @mouseenter="
            footerStore.cursorLocation = `read speed is ${convertReadValueToMb} ${
              controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? 'Kilobyte' : 'MegaByte'
            }`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <div class="disk-speed_value_title">
            <span>{{ $t("controlPage.read") }}</span>
          </div>
          <div class="read_val">
            <span
              >{{ convertReadValueToMb }} {{ controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";

const controlStore = useControlStore();
const footerStore = useFooter();
const writeValue = computed(() => controlStore.writeValue);
const readValue = computed(() => controlStore.readValue);

const convertWriteValueToMb = computed(() => {
  const mbValue = writeValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(writeValue.value);
  }
  return Math.floor(mbValue);
});

const convertReadValueToMb = computed(() => {
  const mbValue = readValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(readValue.value);
  }
  return Math.floor(mbValue);
});
</script>
<style scoped>
.disk-speed_parent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  color: #c1c1c1;
}
.dick-speed_box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.disk-speed_icon {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.disk-speed_icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 43%;
  font-weight: bold;
}
.disk-speed_icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.disk-speed_icon_container img {
  width: 80%;
}
.disk-speed_valueBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
}
.disk-speed_value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
}
.disk-speed_value_title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35%;
  font-size: 70%;
  font-weight: 600;
}
.write_val,
.read_val {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  font-size: 120%;
  font-weight: 800;
}
.write_val {
  color: #ec590a;
}
.read_val {
  color: #336666;
}
</style>
