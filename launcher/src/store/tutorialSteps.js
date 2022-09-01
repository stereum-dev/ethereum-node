import { defineStore } from "pinia";

export const useTutorialStore = defineStore("tutorialSteps", {
  state: () => {
    return {
      steps: [
        {
          id: 1,
          name: "videos",
          title: "video",
          icon: "/img/icon/tutorial-icons/big-camera.png",
          route: "/videos",
          displayItem: false,
        },
        {
          id: 2,
          name: "guide",
          title: "WALKTHROUGH",
          icon: "/img/icon/tutorial-icons/guide-icon.png",
          route: "/guide",
          displayItem: false,
        },
        {
          id: 3,
          name: "text guide",
          title: "WRITTEN GUIDE",
          icon: "/img/icon/tutorial-icons/manual-icon.png",
          route: "/guide/text",
          displayItem: false,
        },
      ],
    };
  },
  actions: {},
});
