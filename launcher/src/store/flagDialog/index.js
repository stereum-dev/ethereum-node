import flagDialMutations from "./mutations.js";
import flagDialActions from "./actions";
import flagDialGetters from "./getters";

export default {
  state() {
    return {
      dialogIsVisible: false,
      linkFlags: [
        {
          langImg: "img/flag/ENGLISH.png",
          langSelect: "img/flag/En.png",
          langName: "english",
        },
        {
          langImg: "Img/flag/GERMAN.png",
          langSelect: "Img/flag/Gr.png",
          langName: "german",
        },
        {
          langImg: "img/flag/FRENCH.png",
          langSelect: "img/flag/Fr.png",
          langName: "french",
        },
        {
          langImg: "img/flag/SPANISH.png",
          langSelect: "img/flag/Sp.png",
          langName: "spanish",
        },
      ],
    };
  },
  mutations: flagDialMutations,
  actions: flagDialActions,
  getters: flagDialGetters,
};
