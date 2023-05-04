<template>
  <div>
    <background-page>
      <form-setup @page="page"></form-setup>
      <div class="version">
        <span>{{ launcher }}</span>
      </div>
    </background-page>
  </div>
</template>
<script>
import FormSetup from "../components/UI/server-connection/FormSetup.vue";
import ControlService from "@/store/ControlService";

export default {
  components: { FormSetup },
  data() {
    return {
      launcher: "",
    };
  },
  updated() {
    this.checkVersion();
  },
  created() {
    this.checkVersion();
  },

  methods: {
    page() {
      this.$emit("page", "welcome-page");
    },
    checkVersion: async function () {
      let launcher;
      try {
        launcher = await ControlService.getCurrentLauncherVersion();
        this.launcher = launcher;
      } catch (err) {
        console.log("Couldn't fetch versions...\nError:", err.message);
      }
    },
  },
};
</script>
<style scoped>
.version {
  background: #194747;
  box-shadow: 0 1px 3px 1px #1f3737;
  border: 3px solid #929292;
  border-radius: 40px;
  position: absolute;
  width: 15%;
  height: 5%;
  color: #cecece;
  display: flex;
  top: 5%;
  left: 5%;
  justify-content: center;
  align-items: center;
  font-size: 85%;
  font-weight: 600;
}
</style>
