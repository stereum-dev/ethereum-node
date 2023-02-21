<template>
  <div class="home">
    <!--<installation-parameters :model="connectionParms" />-->
    <setup-wizard :model="connectionParms"></setup-wizard>
  </div>
</template>

<script>
// @ is an alias to /src
import InstallationParameters from "@/components/InstallationParameters.vue";
import SetupWizard from "@/components/SetupWizard.vue";

export default {
  name: "Setup",
  components: {
    InstallationParameters,
    SetupWizard,
  },
  data() {
    return {
      connectionParms: {
        host: "",
        user: "",
        keyfileLocation: "",
        sshKeyAuth: false,
        port: 22,
        stereumRelease: "",
      },
      /*
      connectionParms: {
        host: '135.181.44.221',
        user: 'root',
        keyfileLocation: '/Users/stefa2k/.ssh/id_rsa',
        sshKeyAuth: false,
        port: 22,
      } */
    };
  },
};
</script>
