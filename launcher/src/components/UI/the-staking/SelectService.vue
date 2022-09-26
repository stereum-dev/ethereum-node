<template>
  <div class="selectBox">
    <div class="display-service">
      <div
        class="serviceBox"
        v-for="service in installedServices.filter((i) => i.category === 'validator')"
        :key="service.id"
        @click="$emit('selectService', service)"
      >
        <div class="service-icon">
          <img :src="service.icon" alt="icon" />
        </div>
        <div class="serviceDetails">
          <span class="name">{{ service.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
  },
};
</script>
<style scoped>
.selectBox {
  grid-column: 3/11;
  grid-row: 2/4;
  width: 100%;
  height: 60%;
  margin-top: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selectBox .display-service {
  width: 100%;
  height: 95%;
  background-color: #3b3b3b;
  border-radius: 5px;
  padding: 2px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.selectBox .display-service .serviceBox {
  width: 19%;
  height: 90%;
  background-color: #1c2023;
  border: 1px solid #1c2023;
  box-sizing: border-box;
  margin-left: 4px;
  padding: 2px;
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.display-service .serviceBox .service-icon {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.display-service .serviceBox .service-con img {
  width: 100%;
  height: 100%;
}
.selectBox .display-service .serviceBox:hover {
  background-color: #272c30;
  border: 1px solid #98bfdf;
  transition-duration: 0.1s;
}

.selectBox .display-service .serviceBox:active {
  background-color: #1c2023;
  border: 1px solid #1c2023;
}
.display-service .serviceBox .serviceDetails {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.display-service .serviceBox .serviceDetails .name {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgb(179, 179, 179);
}
</style>
