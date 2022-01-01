<template>
  <section>
    <background-page> <form-setup @page="page"></form-setup></background-page>
  </section>
  <!-- <section id="main">
    <section id="cont">
      <section>
        <img src="stereum_logo_extern.png" alt="" /> -->
  <!-- avale test -->
  <!-- akhare test -->
  <!-- </section>
    </section>
  </section> -->
</template>
<script>
import FormSetup from "../components/layers/FormSetup.vue";
export default {
  emits: ["page"],
  components: { FormSetup },
  methods: {
    page(pageId) {
      this.$emit("page", "welcome-page");
    },
  },
};
</script>
