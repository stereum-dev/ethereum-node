<template>
  <div class="terminal-parent">
    <div class="error-box" @click="$emit('closeTerminal')"></div>
    <div class="error-modal">
      <div class="title-box">
        <span>{{ item.name }} :</span>
      </div>
      <div class="description">
        <span>{{ item.data }}</span>
      </div>
      <div class="copy-icon" @click="$emit('copyError')">
        <img src="/img/icon/service-icons/copy1.png" alt="icon" />
        <span>copied!</span>
      </div>
      <div class="btn-box">
        <span>Click outside to close</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useTaskManager } from "@/store/taskManager";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapWritableState(useTaskManager, {
      error: "fakeError",
    }),
  },
};
</script>
<style scoped>
.terminal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.error-box {
  width: 100%;
  height: 100%;
  background-color: rgb(8, 8, 8);
  opacity: 0.8;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
.error-modal {
  width: 64%;
  height: 88%;
  background-color: #2b3034;
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 5px;
  border: 3px solid #adadad;
  position: absolute;
  top: 10.4%;
  left: 19%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 1002;
  cursor: default;
}
.error-modal .title-box {
  width: 100%;
  height: 15%;
  border-radius: 9px 9px 0 0;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #adadad;
}
.title-box span {
  width: 100%;
  height: 100%;
  color: #d7d7d7;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  text-align: justify;
  margin-left: 10px;
  line-height: 1.1;
}
.error-modal .description {
  width: 96%;
  height: 100%;
  margin: 20px auto 10px auto;
  border: 1px solid #383f45;
  background-color: #212122;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.description::-webkit-scrollbar {
  width: 5px;
  margin: 5px 0;
}

/* Track */
.description::-webkit-scrollbar-track {
  background: transparent;
  margin: 20px 0;
  cursor: pointer;
}

/* Handle */
.description::-webkit-scrollbar-thumb {
  background: rgb(112, 199, 249);
  border-radius: 3px;
}

/* Handle on hover */
.description::-webkit-scrollbar-thumb:hover {
  background: rgb(24, 161, 241);
}
.error-modal .description span {
  width: 100%;
  height: 100%;
  margin-left: 10px;
  color: #a8a8a8;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: pre-wrap;
  text-transform: none;
  text-align: left;
}

.error-modal .btn-box {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box span {
  color: #b73737;
  font-size: 0.6rem;
  font-weight: 600;
  align-self: flex-end;
}
.error-modal .copy-icon {
  width: 5%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 5px;
  top: 8px;
}
.copy-icon img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.copy-icon:active img {
  transform: scale(0.95);
}
.error-modal .copy-icon:active span {
  display: block;
  z-index: 1005;
}

.copy-icon span {
  display: none;
  background-color: transparent;
  color: rgb(96, 150, 120);
  font-size: 0.5rem;
  position: absolute;
  top: 2px;
  right: 25px;
}
</style>
