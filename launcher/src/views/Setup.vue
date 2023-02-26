<template>
  <div class="home">
    <setup-wizard :model="connectionParams"></setup-wizard>
  </div>
</template>

<script>
// @ is an alias to /src
import SetupWizard from "@/components/SetupWizard.vue";

export default {
  name: "SetupView",
  components: {
    SetupWizard,
  },
  data() {
    return {
      connectionParams: {
        host: "",
        user: "",
        keyfileLocation: "",
        sshKeyAuth: false,
        port: 22,
        stereumRelease: "",
      },
    };
  },
};
</script>
