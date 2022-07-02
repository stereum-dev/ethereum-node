<template>
  <div class="subTask_parent">
    <div class="subTask-table">
      <div class="subTask-content">
        <div
          class="subTask-row"
          v-for="(item, index) in subTasks"
          :key="index"
          :class="{
            'skipping-installation': item.status == 'SKIPPED',
            'success-installation': item.status == 'OK',
            'failed-installation': item.status == 'FAILED',
          }"
        >
          <div
            class="success-box"
            v-if="item.status == 'OK'"
            @mouseover="tooltipShowHandler(item)"
            @mouseleave="tooltipHideHandler(item)"
          >
            <span class="itemAction" v-if="displayTaskResult">{{
              item.action
            }}</span>
            <span class="itemName" v-else>{{ item.name }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/check3.png"
                alt=""
              />
            </div>
            <div class="success-tooltip" v-if="item.showTooltip">
              <span>{{ item.action }}</span>
            </div>
          </div>
          <div
            class="failed-box"
            v-if="item.status == 'FAILED'"
            @mouseover="tooltipShowHandler(item)"
            @mouseleave="tooltipHideHandler(item)"
          >
            <span v-if="displayTaskResult">{{ item.action }}</span>
            <span v-else>{{ item.name }}</span>
            <div class="copy-icon" @click="copyErrorText(item.action)">
              <img src="/img/icon/service-icons/copy1.png" alt="icon" />
            </div>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/close3.png"
                alt=""
              />
            </div>
            <div class="failed-tooltip" v-if="item.showTooltip">
              <span>{{ item.action }}</span>
            </div>
          </div>
          <div
            class="skipped-box"
            v-if="item.status == 'SKIPPED'"
            @mouseover="tooltipShowHandler(item)"
            @mouseleave="tooltipHideHandler(item)"
          >
            <span v-if="displayTaskResult">{{ item.action }}</span>
            <span v-else>{{ item.name }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/check3.png"
                alt=""
              />
            </div>
            <div class="skipped-tooltip" v-if="item.showTooltip">
              <span>{{ item.action }}</span>
            </div>
          </div>
        </div>
        <div ref="task"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["subTasks"],
  data() {
    return {
      displayTaskResult: false,
    };
  },
  created() {
    // this.tooltipByHover();
  },
  mounted() {
    const el = this.$refs.task;
    if (el) {
      //scroll to bottom when opening subtasks
      el.scrollIntoView({ behavior: "smooth" });
    }
  },
  methods: {
    copyErrorText(text) {
      let errorToCopy = text;
      this.$copyText(errorToCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    tooltipShowHandler(el) {
      this.subTasks.filter((item) => {
        item.name.toLowerCase() === el.name.toLowerCase();
        el.showTooltip = true;
      });
    },
    tooltipHideHandler() {
      this.subTasks.filter((item) => {
        item.name.toLowerCase() === el.name.toLowerCase();
        el.showTooltip = false;
      });
    },
  },
};
</script>

<style scoped>
.subTask_parent {
  width: 92%;
  padding: 8px 0;
  position: absolute;
  left: 4%;
  top: 17px;
  z-index: 99;
}
.subTask-table {
  width: 100%;
  height: max-content;
}

.subTask-content {
  width: 98%;
  border-radius: 15px;
}
.subTask-row {
  width: 100%;
  padding: 1px;
  margin: 3px 0;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.subTask-row .skipped-box,
.subTask-row .success-box,
.subTask-row .failed-box {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.copy-icon {
  width: 10%;
  height: 100%;
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.copy-icon img {
  width: 20px;
  height: 90%;
}
.loading-box {
  width: 9%;
  height: 18px;
  border-radius: 15px;
  margin-right: 2px;
  background-color: rgb(59, 59, 59);
  display: flex;
  justify-content: center;
  align-items: center;
}
.subTask-row .skipped-box img,
.subTask-row .success-box img,
.subTask-row .failed-box img {
  width: 70%;
  height: 70%;
}

.subTask-row .skipped-box span,
.subTask-row .success-box span,
.subTask-row .failed-box span {
  font-size: 0.7rem;
  font-weight: 800;
  color: #5c5c5c;
  margin-left: 10px;
  width: 80%;
  overflow: hidden;
  text-transform: capitalize;
}

.success-installation {
  background-color: #5ed285;
  border-radius: 15px;
}
.failed-installation {
  background-color: rgb(219, 74, 74);
  border-radius: 15px;
}
.skipping-installation {
  background-color: rgb(134, 184, 202);
  border-radius: 15px;
}
.success-tooltip,
.failed-tooltip,
.skipped-tooltip {
  width: 90%;
  max-width: 246px;
  min-height: 25px;
  max-height: fit-content;
  border: 1px solid #979797;
  border-radius: 6px;
  position: absolute;
  top: -10px;
  left: 10px;
  padding: 5px 7px;
  background-color: rgb(41, 41, 41);
  text-align: left;
  z-index: 500;
}
.success-tooltip::after,
.failed-tooltip::after,
.skipped-toolt::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
.success-tooltip span,
.failed-tooltip span,
.skipped-tooltip span {
  width: 100%;
  height: 100%;
  font-size: 0.7rem;
  font-weight: 500;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgb(155, 155, 155) !important;
}
</style>
