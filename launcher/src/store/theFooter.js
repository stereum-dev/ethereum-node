import { defineStore } from "pinia";

export const useFooter = defineStore("theFooter", {
  state: () => {
    return {
      cursorLocation: "",
      stereumStatus: true,
      dialog: false,
      epochType: "",
      epoch: null,
      slot: null,
      status: "",
      title: "",
      first: "",
      second: "",
    };
  },
  getters: {},
  actions: {},
});
