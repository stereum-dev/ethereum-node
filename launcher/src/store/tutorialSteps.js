import { defineStore } from "pinia";

export const useTutorialStore = defineStore("tutorialSteps", {
  state: () => {
    return {
      steps: [
        {
          name: "videos",
          title: "video",
          icon: "img/icon/tutorial-icons/big-camera.png",
          route: "/videos",
        },
        {
          name: "guide",
          title: "WALKTHROUGH",
          icon: "img/icon/tutorial-icons/guide-icon.png",
          route: "/guide",
        },
        {
          name: "text guide",
          title: "WRITTEN GUIDE",
          icon: "img/icon/tutorial-icons/manual-icon.png",
          route: "/guide/text",
        },
      ],
    };
  },
  actions: {
    showFirstStep() {
      this.modalIsVisible = true;
    },
    hideFirstStep() {
      this.modalIsVisible = false;
    },
  },
});
