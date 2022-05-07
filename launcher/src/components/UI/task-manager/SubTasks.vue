<template>
  <div class="subTask_parent">
    <div class="subTask-table">
      <div class="subTask-content">
        <div
          class="subTask-row"
          v-for="(item, index) in subTasks"
          :key="index"
          :class="{
            'active-installation': item.status == 'active',
            'progress-installation': item.status == 'success',
            'success-installation': item.status == 'success',
            'failed-installation': item.status == 'failed',
          }"
        >
          <div class="active-box" v-if="item.status == 'active'">
            <span>{{ item.statusLabel }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/loading4.png"
                alt=""
              />
            </div>
          </div>
          <div class="progress-box" v-if="item.status == 'progress'">
            <span>{{ item.statusLabel }}</span>
            <div class="loading-box"></div>
          </div>
          <div class="success-box" v-if="item.status == 'success'">
            <span>{{ item.statusLabel }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/check3.png"
                alt=""
              />
            </div>
          </div>
          <div class="failed-box" v-if="item.status == 'failed'">
            <span>{{ item.statusLabel }}</span>
            <div class="loading-box">
              <img
                src="../../../../public/img/icon/task-manager-icons/close3.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["subTasks"],
};
</script>

<style scoped>
.subTask_parent {
  width: 92%;
  height: 80%;
  position: absolute;
  left: 4%;
  top: 15%;
}
.subTask-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}

.subTask-content {
  width: 98%;
  height: 9%;
  margin-top: 5px;
  border: 2px solid #b7b7b7;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.subTask-row {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.subTask-row .active-box,
.subTask-row .progress-box,
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
  width: 6%;
  height: 82%;
  border-radius: 15px;
  margin-right: 2px;
  background-color: rgb(59, 59, 59);
  display: flex;
  justify-content: center;
  align-items: center;
}
.subTask-row .success-box img,
.subTask-row .failed-box img {
  width: 70%;
  height: 70%;
}
.subTask-row .active-box img {
  width: 80%;
  height: 80%;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.subTask-row .active-box span,
.subTask-row .progress-box span,
.subTask-row .success-box span,
.subTask-row .failed-box span {
  font-size: 0.7rem;
  font-weight: 800;
  color: #303030;
  margin-left: 10px;
}

.active-installation {
  background-color: rgb(141, 215, 255);
  border-radius: 15px;
}
.progress-installation {
  background-color: rgb(125, 125, 125);
  border-radius: 15px;
}
.success-installation {
  background-color: rgb(94, 210, 133);
  border-radius: 15px;
}
.failed-installation {
  background-color: rgb(219, 74, 74);
  border-radius: 15px;
}
</style>
