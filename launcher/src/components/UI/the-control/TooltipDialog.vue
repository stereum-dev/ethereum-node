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
import { computed, ref, watch } from "vue";
import { useFooter } from "@/store/theFooter";
import "animate.css";
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const animateClass = ref("");
    const flag = ref(false);
    const epochType = computed(() => useFooter().epochType);
    const epoch = computed(() => useFooter().epoch);
    const slot = computed(() => useFooter().slot);
    const status = computed(() => useFooter().status);
    const title = computed(() => useFooter().title);
    const first = computed(() => useFooter().first);
    const second = computed(() => useFooter().second);

    watch(
      () => props.open,
      (newVal) => {
        if (newVal) {
          animateClass.value = "animate__animated animate__flipInX";
          setTimeout(() => {
            animateClass.value = "";
          }, 600);
        }
      }
    );

    watch(
      () => epochType.value,
      (newVal) => {
        if (newVal !== "") {
          flag.value = true;
        } else {
          flag.value = false;
        }
      }
    );

    const formatValues = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return {
      animateClass,
      flag,
      epochType,
      epoch,
      slot,
      status,
      title,
      first,
      second,
      formatValues,
    };
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
  top: 15%;
  left: 47.5%;
}
.syncstatus {
  top: 30%;
  left: 47.5%;
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
