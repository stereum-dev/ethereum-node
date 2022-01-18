<template>
  <section>
    <background-page> <form-setup @page="page"></form-setup></background-page>
  </section>
</template>
<script>
import FormSetup from "../components/layers/FormSetup.vue";
export default {
  emits: ["page"],
  components: { FormSetup },
  methods: {
    page() {
      this.$emit("page", "welcome-page");
    },
  },
};
</script>
