import flagDialMutations from "./mutations.js";
import flagDialActions from "./actions";
import flagDialGetters from "./getters";

export default {
  state() {
    return {
      dialogIsVisible: false,
      linkFlags: [
        {
          langImg: "Img/flag/ENGLISH.png",
          langSelect: "Img/flag/En.png",
          langName: "english",
        },
        {
          langImg: "Img/flag/GERMAN.png",
          langSelect: "Img/flag/Gr.png",
          langName: "german",
        },
        {
          langImg: "Img/flag/FRENCH.png",
          langSelect: "Img/flag/Fr.png",
          langName: "french",
        },
        {
          langImg: "Img/flag/SPANISH.png",
          langSelect: "Img/flag/Sp.png",
          langName: "spanish",
        },
      ],
    };
  },
  mutations: flagDialMutations,
  actions: flagDialActions,
  getters: flagDialGetters,
};
