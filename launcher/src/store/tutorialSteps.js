import { defineStore } from "pinia";

export const useTutorialStore = defineStore("tutorialSteps", {
  state: () => {
    return {
      playYoutubeVideo: false,
      chosenVideo: "",
    };
  },
  actions: {},
});
