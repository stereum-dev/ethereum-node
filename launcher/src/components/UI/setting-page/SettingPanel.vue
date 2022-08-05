<template>
  <div class="seting-panel_parent">
    <div class="seting-panel_box">
      <div class="setting-panel_title">
        <div class="ttl-box">
          <div class="setting-panel_title_ico">
            <img
              src="../../../../public/img/icon/setting-page/setting_icon.png"
            />
          </div>
          <div class="setting-panel_title_ttl">
            <span>STEREUM SETTING</span>
          </div>
        </div>
        <div class="confirm-btn" @click="confirm">
          <span>CONFIRM & APPLY</span>
        </div>
      </div>
      <div class="division-line"></div>
      <div class="general-panel">
        <div class="general-panel_title"><span>GENERAL</span></div>
        <hr />
        <div class="items-box">
          <setting-items
            v-for="item in generalItems"
            :key="item.id"
            :title="item.title"
            :btnValue="item.btnValue"
            :isColor="item.isColor"
          ></setting-items>
        </div>
      </div>
      <div class="update-panel">
        <div class="general-panel_title"><span>UPDATE</span></div>
        <hr />
        <div class="items-box"></div>
      </div>
    </div>

    <div class="footer"></div>
    <task-manager></task-manager>
  </div>
</template>
<script>
import TaskManager from "../task-manager/TaskManager.vue";
import SettingItems from "./SettingItems.vue";
export default {
  components: { TaskManager, SettingItems },
  data() {
    return {
      generalItems: [
        {
          id: 1,
          title: "Leanguage Selection",
          btnValue: "ENGLISH",
          isColor: "open",
        },
        {
          id: 2,
          title: "Credits",
          btnValue: "OPEN",
          isColor: "open",
        },
      ],
    };
  },
  methods: {
    confirm() {
      // confirm method have to write here
      alert("Done!");
    },
  },
};
</script>

<style scoped>
.seting-panel_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99.95%;
  height: 91%;
  background-color: #232323;
  border: 4px solid #979797;
  border-radius: 10px 35px 10px 10px;
  z-index: 0;
}
.seting-panel_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
  justify-content: flex-start;
  align-items: center;
}
.setting-panel_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 8%;
}
.ttl-box {
  display: flex;
  width: 40%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 5%;
}
.setting-panel_title_ico {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.setting-panel_title_ico img {
  width: 60%;
}
.setting-panel_title_ttl {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
  font-weight: 300;
  color: #eee;
}
.confirm-btn {
  width: 18%;
  height: 65%;
  background: #48e148;
  border: 1px solid #707070;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin: 5% 0;
}
.confirm-btn:hover,
.confirm-btn:focus {
  border: 1px solid white;
  font-weight: 800;
}
.division-line {
  width: 95%;
  height: 1%;
  background: #eee;
}
.general-panel {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.update-panel {
  width: 100%;
  height: 45%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.general-panel_title,
.general-panel_title {
  height: 15%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  font-size: 130%;
  font-weight: 600;
  color: #eee;
}
hr {
  width: 95%;
}
.footer {
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
  width: 100%;
  height: 5%;
  display: flex;
}
.items-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
