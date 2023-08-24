<template>
  <div v-if="open" :class="['parent-dialog', animateClass, flag ? 'amsterdam' : 'syncstatus']">
    <div v-if="flag" class="wrapper">
      <div class="title">{{ epochType }}</div>
      <div class="top-epoch">
        <span>epoch</span><span>{{ formatValues(epoch) }}</span>
      </div>
      <div class="bottom-epoch">
        <span>slot</span
        ><span
          :class="{
            white: status == 'pending',
            green: status == 'proposed',
            red: status == 'missed',
          }"
          >{{ slot == 0 ? "N/A" : formatValues(slot) }}</span
        >
      </div>
    </div>
    <div v-else class="wrapper">
      <div class="title">{{ title }}</div>
      <div class="sync-step">
        <span>{{ formatValues(first) }}</span> / <span>{{ formatValues(second) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import "animate.css";
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      animateClass: "",
      flag: false,
    };
  },
  computed: {
    ...mapWritableState(useFooter, {
      epochType: "epochType",
      epoch: "epoch",
      slot: "slot",
      status: "status",
      title: "title",
      first: "first",
      second: "second",
    }),
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.animateClass = "animate__animated animate__flipInX";
        setTimeout(() => {
          this.animateClass = "";
        }, 600); // Adjust this delay to match your animation-duration
      }
    },
    epochType(newVal) {
      if (newVal !== "") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
  },
  methods: {
    formatValues(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
  },
};
</script>

<style scoped>
.parent-dialog {
  border-radius: 10px;
  z-index: 100;
  position: fixed;

  height: 20%;
  width: 25%;
  border: 3px solid #929292;
  background: #000;
  color: #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-duration: 0.5s;
}
.amsterdam {
  top: 16%;
  left: 48.8%;
}
.syncstatus {
  top: 30%;
  left: 48.8%;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 120%;
  text-transform: uppercase;
  font-weight: 600;
  padding-left: 5%;
  padding-top: 2%;
  border-bottom: 1px solid #929292;
  background: #929292;
  color: #000;
}
.top-epoch,
.bottom-epoch {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 120%;
  color: #c1c1c1;
  font-weight: 500;
  text-transform: uppercase;
}
.top-epoch > span:nth-child(2) {
  color: #568d50;
}
.white {
  color: #c1c1c1;
}
.green {
  color: #568d50;
}
.red {
  color: #ff0000;
}
.sync-step {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 120%;
  font-weight: 700;
}
</style>
