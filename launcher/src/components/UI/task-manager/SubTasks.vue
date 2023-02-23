<template>
  <div class="subTask_parent">
    <div class="subTask-table">
      <div class="subTask-content">
        <div
          v-for="(item, index) in modifiedSubTasks"
          :key="index"
          class="subTask-row"
          :class="{
            'skipping-installation': item.status == 'SKIPPED',
            'success-installation': item.status == 'OK',
            'failed-installation': item.status == 'FAILED',
          }"
        >
          <error-terminal
            v-if="item.showErrorterminal"
            :item="item"
            @close-terminal="hideTerminalHandler(item)"
            @copy-error="copyErrorText(item)"
          ></error-terminal>
          <div v-if="item.status == 'OK'" class="success-box" @click="openTerminalHandler(item)">
            <span v-if="displayTaskResult" class="itemAction">{{ item.action }}</span>
            <span v-else class="itemName">{{ item.name }}</span>
            <div class="loading-box">
              <img src="../../../../public/img/icon/task-manager-icons/check5.png" alt="" />
            </div>
            <div v-if="item.showTooltip" class="success-tooltip">
              <span>{{ item.action }}</span>
            </div>
          </div>
          <div v-if="item.status == 'FAILED'" class="failed-box" @click="openTerminalHandler(item)">
            <span v-if="displayTaskResult" class="error">{{ item.action }}</span>
            <span v-else class="noError">{{ item.name }}</span>
            <div class="error-icon">
              <img src="../../../../public/img/icon/task-manager-icons/cancel.png" alt="" />
              <div v-if="item.showTooltip" class="failed-tooltip">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div v-if="item.status == 'SKIPPED'" class="skipped-box" @click="openTerminalHandler(item)">
            <span v-if="displayTaskResult" class="error">{{ item.action }}</span>
            <span v-else class="noError">{{ item.name }}</span>
            <div class="loading-box">
              <img src="../../../../public/img/icon/task-manager-icons/check5.png" alt="" />
            </div>
            <div v-if="item.showTooltip" class="skipped-tooltip">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div ref="task"></div>
      </div>
    </div>
  </div>
</template>
<script>
import ErrorTerminal from "./ErrorTerminal.vue";
export default {
  components: { ErrorTerminal },
  props: ["subTasks", "item"],
  data() {
    return {
      displayTaskResult: false,
      modifiedSubTasks: this.subTasks,
      terminalModal: false,
    };
  },
  created() {
    this.modifiedSubTasks = this.modifiedSubTasks.map((item) => {
      return {
        showErrorterminal: false,
        ...item,
      };
    });
  },
  mounted() {
    const el = this.$refs.task;
    if (el) {
      //scroll to bottom when opening subtasks
      el.scrollIntoView({ behavior: "smooth" });
    }
  },
  methods: {
    copyErrorText(item) {
      let errorToCopy = item.data;
      navigator.clipboard
        .writeText(errorToCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    tooltipShowHandler(el) {
      this.modifiedSubTasks.filter((item) => {
        item.name.toLowerCase() === el.name.toLowerCase();
        el.showTooltip = true;
      });
    },
    tooltipHideHandler(el) {
      this.modifiedSubTasks.filter((item) => {
        item.name.toLowerCase() === el.name.toLowerCase();
        el.showTooltip = false;
      });
    },
    openTerminalHandler(el) {
      this.modifiedSubTasks.forEach((item) => {
        if (el.showTooltip) {
          el.showTooltip = false;
        }
        if (el.showErrorterminal) {
          el.showErrorterminal = false;
        }
      });
      this.modifiedSubTasks.filter((item) => {
        item.name.toLowerCase() === el.name.toLowerCase();
        el.showErrorterminal = true;
      });
    },
    hideTerminalHandler(el) {
      el.showTooltip = false;
      el.showErrorterminal = false;
    },
  },
};
</script>

<style scoped>
.subTask_parent {
  width: 92%;
  position: absolute;
  left: 4%;
  top: 27px;
  z-index: 1000;
}
.subTask-table {
  width: 100%;
  height: max-content;
}

.subTask-content {
  width: 98%;
  max-height: 146;
  border-radius: 15px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: -1;
}

/* width */
.subTask-content::-webkit-scrollbar {
  width: 1px;
}

.subTask-row {
  width: 100%;
  padding: 1px;
  margin: 3px 0;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 0;
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

.error-icon,
.loading-box {
  width: 10%;
  height: 20px;
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-icon img {
  width: 20px;
  height: 20px;
}
.loading-box img {
  width: 20px;
  height: 20px;
}

.subTask-row .skipped-box img,
.subTask-row .failed-box img,
.subTask-row .success-box img {
  width: 70%;
  height: 70%;
}

.subTask-row .skipped-box span,
.subTask-row .success-box span {
  font-size: 0.7rem;
  font-weight: 800;
  color: #5c5c5c;
  margin-left: 10px;
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  text-transform: capitalize;
}
.subTask-row .failed-box span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #cbcbcb;
  margin-left: 10px;
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  text-transform: capitalize;
}

.success-installation {
  background-color: #5ed285;
  border-radius: 15px;
}
.failed-installation {
  background-color: #aa4343;
  border-radius: 15px;
}
.skipping-installation {
  background-color: rgb(134, 184, 202);
  border-radius: 15px;
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
  z-index: 1001;
}
.success-tooltip,
.failed-tooltip,
.skipped-tooltip {
  width: max-content;
  height: 25px;
  border: 1px solid #979797;
  border-radius: 6px;
  position: absolute;
  top: -20px;
  left: 10px;
  padding: 3px 2px 2px 0;
  background-color: rgb(41, 41, 41);
  text-align: left;
  z-index: 1005;
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: left;
  color: rgb(211, 211, 211) !important;
}
.success-tooltip span,
.failed-tooltip span,
.skipped-tooltip span {
  width: max-content;
  margin-right: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: left;
  color: rgb(211, 211, 211) !important;
}
</style>
