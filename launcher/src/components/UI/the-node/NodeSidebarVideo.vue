<template>
  <div class="tutorial-box">
    <div class="tutorial-table">
      <div
        class="table-row"
        v-for="(item, index) in configData"
        :key="index"
        @click="$emit('showModal')"
      >
        <div class="camera-icon">
          <img
            src="../../../../public/img/icon/manage-node-icons/QuestionMark.png"
            alt="camera-icon"
          />
        </div>
        <div class="row-content">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="round-icon">
      <img src="/img/icon/round-icon.png" alt="round-icon" />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useTutorialStore } from "@/store/tutorialSteps";

export default {
  data() {
    return {};
  },
  mounted() {
    this.configData = this.configData.map((item) => {
      return {
        showPlayModal: false,
        ...item,
      };
    });
  },
  computed: {
    ...mapWritableState(useNodeStore, {
      configData: "configData_nodeSidebarVideo",
    }),
    ...mapWritableState(useTutorialStore, {
      showTutorialModal: "showTutorialModal",
    }),
  },
  methods: {

  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.tutorial-box {
  width: 96%;
  height: 43%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 20px;

  background-color: #336666;
}
.tutorial-table {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 70%;
  width: 90%;
  border: 3px solid #232a2a;
  border-radius: 10px;
  background: #161b1b;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 5px;
}
.tutorial-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  width: 98%;
  height: 22px;
  margin-top: 2px;
  background-color: #222c2c;
  border: 2px solid #314242;
  border-radius: 3px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.table-row:hover {
  border: 2px solid #45d1ae;
}
.table-row:hover .camera-icon {
  border-right: 2px solid #45d1ae;
}
.camera-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23%;
  text-align: left;
  border-right: 2px solid #314242;
}

.camera-icon img {
  width: 60%;
  height: 70%;
}

.row-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272a2d;
  height: 100%;
  width: 77%;
  padding-top: 2px;
}

.row-content span {
  text-align: center;
  width: 100%;
  color: rgb(208, 208, 208);
  font-size: 0.5rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  overflow-x: hidden;
}
.round-icon {
  width: 100%;
  height: 20%;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-icon img {
  width: 30%;
  height: 100%;
}
</style>
