<template>
  <div class="active-box">
    <div class="active-table">
      <div class="table-row" v-for="(item, index) in configData" :key="index">
        <div v-if="item.status === 'deactive'" class="status-icon">
          <span class="red"></span>
        </div>
        <div v-else-if="item.status === 'active'" class="status-icon">
          <span class="green"></span>
        </div>
        <div v-else-if="item.status === 'off'" class="status-icon">
          <span class="yellow"></span>
        </div>
        <div v-else class="status-icon">
          <span class="blue"></span>
        </div>
        <div class="row-content">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="badge">
      <div class="active-badge" :class="{ activated: activeBtn }">
        <span :class="{ spanColor: activeBtn }" @click="activeBtnHandler"
          >ACTIVE</span
        >
      </div>
      <div class="installed-badge" :class="{ activated: installedBtn }">
        <span :class="{ spanColor: installedBtn }" @click="installedBtnHandler"
          >INSTALLED</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { useNodeStore } from '@/store/theNode'
export default {
  data () {
    return {
      installedBtn: false,
      activeBtn: false
    }
  },
  computed: {
    ...mapState(useNodeStore,{
      configData: 'configData'
    })
  },
  methods: {
    installedBtnHandler () {
      this.installedBtn = true
      this.activeBtn = false
    },
    activeBtnHandler () {
      this.activeBtn = true
      this.installedBtn = false
    }
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.active-box {
  width: 96%;
  height: 55%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
  border: 1px solid #7f7f7f;
  border-radius: 20px;
  padding: 0 5px 5px 5px;
  background-color: gray;
}
.badge {
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: space-between;
}

.active-badge {
  width: 49%;
  height: 100%;
  border: 1px solid rgb(171, 169, 169);
  border-radius: 40px 0 0 40px;
  box-shadow: 0 1px 3px 1px #393939;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.installed-badge {
  width: 49%;
  height: 100%;
  border: 1px solid rgb(171, 169, 169);
  border-radius: 0 40px 40px 0;
  box-shadow: 0 1px 3px 1px #393939;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.active-badge span,
.installed-badge span {
  height: 70%;
  align-self: center;
  font-size: 9px;
  font-weight: 800;
  color: rgb(26, 30, 29);
}
.active-badge:hover,
.installed-badge:hover {
  background-color: #373737;
  box-shadow: 0 1px 3px 1px #373737;
}
.active-badge:active,
.installed-badge:active {
  box-shadow: none;
}
.active-badge:hover span,
.installed-badge:hover span {
  color: rgb(222, 222, 222);
}

.activated {
  background-color: #373737 !important;
  border: 1px solid #2a2a2a !important;
  box-shadow: none !important;
}
.spanColor {
  color: rgb(205, 205, 204) !important;
}
.active-table {
  width: 100%;
  height: 80%;
  border: 2px solid #747474;
  border-radius: 15px;
  background: #242526;
  color: rgb(41, 41, 41);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px auto;
}

.active-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  width: 96%;
  height: 10%;
  background-color: white;
  border: 1px solid gray;
  border-radius: 45px;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
}

.status-icon {
  width: 24%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.status-icon .red {
  width: 65%;
  height: 90%;
  background-color: rgb(216, 37, 37);
  border-radius: 50%;
  margin-left: 1px;
}
.status-icon .yellow {
  width: 65%;
  height: 90%;
  background-color: rgb(212, 159, 25);
  border-radius: 50%;
  margin-left: 1px;
}
.status-icon .green {
  width: 65%;
  height: 90%;
  background-color: rgb(55, 135, 77);
  border-radius: 50%;
  margin-left: 1px;
}
.status-icon .blue {
  width: 65%;
  height: 90%;
  background-color: rgb(35, 116, 229);
  border-radius: 50%;
  margin-left: 1px;
}

.row-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 86%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.row-content span {
  font-size: 0.6rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
}
</style>
