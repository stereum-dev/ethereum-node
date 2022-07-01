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
          <div class="success-box" v-if="item.status == 'OK'">
            <span v-if="displayTaskResult">{{ item.action }}</span>
            <span v-else>{{ item.name }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/check3.png"
                alt=""
              />
            </div>
          </div>
          <div class="failed-box" v-if="item.status == 'FAILED'">
            <span v-if="displayTaskResult">{{ item.action }}</span>
            <span v-else>{{ item.name }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/close3.png"
                alt=""
              />
            </div>
          </div>
          <div class="skipped-box" v-if="item.status == 'SKIPPED'">
            <span v-if="displayTaskResult">{{ item.action }}</span>
            <span v-else>{{ item.name }}</span>
            <div class="loading-box">
             <img
                src="../../../../public/img/icon/task-manager-icons/check3.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div ref="task">
        </div>
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
  mounted(){
    const el = this.$refs.task;
        if (el) {
      //scroll to bottom when opening subtasks
     el.scrollIntoView({behavior: 'smooth'});
    }
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
  overflow-x: hidden;
  overflow-y: auto;
}

.subTask-content {
  width: 98%;
  border-radius: 15px;
}
.subTask-row {
  width: 100%;
  padding: 2px;
  margin: 5px 0;
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
}
.loading-box {
  width: 16px;
  height: 16px;
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
  color: #303030;
  margin-left: 10px;
  width: 100%;
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

</style>
