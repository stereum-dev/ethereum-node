import flagDialMutations from "./mutations.js";
import flagDialActions from "./actions";
import flagDialGetters from "./getters";

export default {
  state() {
    return {
      dialogIsVisible: false,
      linkFlags: [
        {
          langImg: "Img/Flag/ENGLISH.png",
          langSelect: "Img/Flag/En.png",
          langName: "english",
        },
        {
          langImg: "Img/Flag/GERMAN.png",
          langSelect: "Img/Flag/Gr.png",
          langName: "german",
        },
        {
          langImg: "Img/Flag/FRENCH.png",
          langSelect: "Img/Flag/Fr.png",
          langName: "french",
        },
        {
          langImg: "Img/Flag/SPANISH.png",
          langSelect: "Img/Flag/Sp.png",
          langName: "spanish",
        },
      ],
    };
  },
  mutations: flagDialMutations,
  actions: flagDialActions,
  getters: flagDialGetters,
};
