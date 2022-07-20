<template>
  <div class="disk-speed_parent">
    <div class="dick-speed_box">
      <div class="disk-speed_icon">
        <div class="disk-speed_icon_container">
          <img src="../../../../public/img/icon/control/Speedmeter.png" />
        </div>
        <span>DISK SPEED</span>
      </div>
      <div class="disk-speed_valueBox">
        <div class="disk-speed_value">
          <div class="disk-speed_value_title"><span>WRITE</span></div>
          <div class="write_val">
            <span>{{ writeValue }} kb</span>
          </div>
        </div>
        <div class="disk-speed_value">
          <div class="disk-speed_value_title"><span>READ</span></div>
          <div class="read_val">
            <span>{{ readValue }} kb</span>
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
      writeValue: 10,
      readValue: 11,
    };
  },
};
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
  font-size: 50%;
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
  height: 35%;
  font-size: 100%;
  font-weight: 800;
}
.write_val {
  color: #ec590a;
}
.read_val {
  color: #336666;
}
</style>
