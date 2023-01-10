<template>
  <div class="verticalBar-parent">
    <div class="verticalBar-container">
      <div
        v-for="(number, index) in numbers"
        :key="index"
        :style="{ backgroundColor: getColor(number) }"
        class="bar"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputValue: [],
      // every 6 sec update
      //it's defult and fix stracture!
      numbers: [0, 1, 1, 1, 1, 2, 3, 4, 1, 1, 1, 1, 2, 3, 1, 2, 1, 1],
    };
  },
  methods: {
    getColor(number) {
      switch (number) {
        case 0:
          return "#707070";
        case 1:
          return "#74FA65";
        case 2:
          return "#FFD924";
        case 3:
          return "#FA831B";
        case 4:
          return "#EB5353";
      }
    },
  },
};
</script>
<style scoped>
.verticalBar-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.verticalBar-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.bar {
  width: 2.8%;
  height: 100%;
}
</style>
