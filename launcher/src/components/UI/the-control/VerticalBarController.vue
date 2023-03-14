<template>
  <div class="verticalBar-parent">
    <div class="verticalBar-container">
      <comming-soon></comming-soon>
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
      arrayWith18Ones: Array(10).fill(0),
    };
  },
  computed: {
    // every 6 sec update
    //it's defult and fix stracture!
    // arrayWith18Ones() {
    //   return Array(10).fill(0);
    // },
  },
  created() {
    setInterval(() => {
      this.barGenerator();
    }, 6000);
  },
  methods: {
    barGenerator() {
      const newBars = [];
      // newBars is just a sample to show the functionallity and it has to change with the right data
      // Generate 6 new random numbers between 1 and 4
      for (let i = 0; i < 10; i++) {
        newBars.push(Math.floor(Math.random() * 4) + 1);
      }

      // Replace the old array with the new one
      this.arrayWith18Ones = newBars;
    },
    getColor(number) {
      switch (number) {
        case 0:
          return "#eee";
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
  width: 4%;
  height: 90%;
  display: inline-block;
  margin: 0 1%;
}
</style>
