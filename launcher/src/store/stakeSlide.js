import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      sliderTutorial: [
        {
          id: 1,
          img: "/img/stake_Guide/1.jpg",
          text: "Lorem ipsum dolor sit amet.",
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
