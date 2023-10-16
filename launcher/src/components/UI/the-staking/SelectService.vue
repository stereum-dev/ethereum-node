<template>
  <div class="selectBox">
    <div class="display-service">
      <div
        v-for="service in installedServices.filter((i) => i.category === 'validator' && i.service !== 'CharonService')"
        :key="service.id"
        class="serviceBox"
        @click="$emit('selectService', service)"
      >
        <div class="service-icon">
          <img :src="service.sIcon" alt="icon" />
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
    }),
  },
};
</script>
<style scoped>
.selectBox {
  grid-column: 2/10;
  grid-row: 3/4;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  align-self: flex-end;
  margin-bottom: -9px;
}
.selectBox .display-service {
  width: 100%;
  height: 95%;
  background-color: #d9dbdc;
  border-radius: 5px;
  padding: 2px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.selectBox .display-service .serviceBox {
  min-width: 100px;
  width: max-content;
  height: 90%;
  background-color: #1c2023;
  border: 1px solid #1c2023;
  box-sizing: border-box;
  margin-left: 2px;
  padding: 2px;
  border-radius: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.display-service .serviceBox .service-icon {
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.display-service .serviceBox .service-con img {
  width: 20px !important;
}
.selectBox .display-service .serviceBox:hover {
  background-color: #94cefd;
  border: 1px solid #3c464e;
  transition-duration: 0.1s;
}
.selectBox .display-service .serviceBox:hover .name {
  color: #1c2023;
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
