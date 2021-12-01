import Vue from "vue";
import VueRouter from "vue-router";
//import Setup from "../views/Setup.vue";
import TheFirst from "../components/layers/TheFirst.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Setup",
  //   component: Setup,
  // },
  {
    path: "/",
    name: "TheFirst",
    component: TheFirst,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
