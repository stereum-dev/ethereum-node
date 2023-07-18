import { defineStore } from "pinia";

export const useFooter = defineStore("theFooter", {
  state: () => {
    return {
      cursorLocation: "",
      stereumStatus: true,
    };
  },
  getters: {},
  actions: {},
});
