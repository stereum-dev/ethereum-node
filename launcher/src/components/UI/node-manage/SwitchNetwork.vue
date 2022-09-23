<template>
  <div class="switch-network">
    <div class="switch-network__content">
      <div
        class="switch-network__content__item"
        v-for="item in networkList"
        :key="item.id"
      >
        <div class="networkIcon">
          <img :src="item.icon" alt="icon" />
        </div>
        <div class="networkSelect">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="dropdown-box">
      <img
        class="dropdown-icon"
        src="/img/icon/manage-node-icons/down-1.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
export default {
  data() {
    return {
      currentNetwork: "",
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      networkList: "networkList",
    }),
  },
};
</script>
<style scoped>
.switch-network {
  width: 100%;
  height: 10%;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  border: 1px solid #3f3f3f;
}
.switch-network__content {
  width: 98%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  border-radius: 5px;
}
.switch-network__content__item {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
}
.switch-network__content__item .networkIcon {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.switch-network__content__item .networkIcon img {
  width: 55%;
}
.switch-network__content__item .networkSelect {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.switch-network__content .dropdown-box {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3134;
}
.switch-network__content .dropdown-box .dropdown-icon {
  width: 90%;
  height: 90%;
}
</style>
