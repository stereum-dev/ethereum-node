<template>
  <div class="verticalBar-parent">
    <comming-soon></comming-soon>
    <div class="verticalBar-container">
      <div
        v-for="(number, index) in arrayWith18Ones"
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
    };
  },
  computed: {
    // every 6 sec update
    //it's defult and fix stracture!
    arrayWith18Ones() {
      return Array(18).fill(0);
    },
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
  position: relative;
}
.verticalBar-container {
  width: 100%;
  height: 100%;
}
.bar {
  width: 2.8%;
  height: 90%;
  display: inline-block;
  margin: 0 1%;
}
</style>
