<template>
  <div class="modal-bg" @click="$emit('hideModal')">
    <div class="modal-box">
      <div class="modal-box-title">
        <span>{{ itemToTutorial.name }}</span>
      </div>
      <div class="modal-items">
        <div
          class="item"
          v-for="(item, index) in steps"
          :key="index"
          @click="$emit('showItem', item)"
        >
          <div class="icon-box">
            <img :src="item.icon" alt="icon" />
          </div>
          <div class="item-text">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
      <span class="click">Click outside to close</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["itemToTutorial"],
  data() {
    return {
      steps: [
        {
          id: 1,
          name: "videos",
          title: "video",
          icon: "/img/icon/tutorial-icons/big-camera.png",
          videosLink: this.itemToTutorial.videosLink,
          route: "/videos",
          displayItem: false,
        },
        {
          id: 2,
          name: "walkthrough",
          title: "WALKTHROUGH",
          icon: "/img/icon/tutorial-icons/guide-icon.png",
          guideLink: this.itemToTutorial.guideLink,
          route: "/guide",
          displayItem: false,
        },
        {
          id: 3,
          name: "text guide",
          title: "WRITTEN GUIDE",
          icon: "/img/icon/tutorial-icons/manual-icon.png",
          writtenLink: this.itemToTutorial.writtenLink,
          route: "/guide/text",
          displayItem: false,
        },
      ],
    };
  },
  computed: {
    checkLinks() {
      this.steps.map((item) => {
        if (item.name == "videos") {
          item.videosLink = this.itemToTutorial.videosLink;
        } else if (item.name == "walkthrough") {
          item.guideLink = this.itemToTutorial.guideLink;
        } else if (item.name == "text guide") {
          item.writtenLink = this.itemToTutorial.writtenLink;
        }
      });
    },
  },
  methods: {},
};
</script>
<style scoped>
.modal-bg {
  width: 100%;
  height: 100%;
  background-color: #181818e1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 35px 5px 5px;
  z-index: 200;
  position: absolute;
  top: 0;
  left: 0;
  cursor: default;
}
.modal-box {
  width: 45%;
  height: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #3a6868;
  border: 1px solid #989898;
  border-radius: 15px;
  position: relative;
}
.modal-box .modal-box-title {
  width: 90%;
  height: 40px;
  border: 2px solid #7b7e83;
  border-radius: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box-title span {
  font-size: 1rem;
  font-weight: 600;
  color: #c3c3c3;
  text-transform: uppercase;
}
.modal-items {
  width: 90%;
  height: 65%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
}
.item {
  width: 32%;
  height: 80%;
  border: 2px solid #7b7e83;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px rgb(68, 68, 68);
}
.item:hover {
  border: 2px solid rgb(54, 174, 248);
  opacity: 0.8;
}
.item:active {
  transition-duration: 200ms;
  transform: scale(0.95);
}
.item .icon-box {
  background-color: #33393e;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 65%;
}
.item-text {
  width: 100%;
  height: 35%;
  border-top: 2px solid #7b7e83;
  background: #93979e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-text span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #303030;
  text-transform: uppercase;
}
.modal-items::-webkit-scrollbar {
  display: none;
}
.click {
  font-size: 0.7rem;
  color: #d8d8d8;
}
</style>
