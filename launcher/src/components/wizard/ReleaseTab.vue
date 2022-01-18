<template>
  <div>
    <div class="container text-left" v-if="!running || done">
      <h3>Version</h3>

      <p>Selected: <b>{{ model.stereumRelease }}</b></p>

      <b-form-checkbox v-model="showAdvanced" name="showAdvanced" switch>
        Show all versions
      </b-form-checkbox>
      <div class="text-left">
        <b-form-radio-group
          :stacked="true"
          label="Pick Stereum Release"
          :options="releases"
          v-model="model.stereumRelease"
          value-field="value"
          v-if="showAdvanced"
        >
        </b-form-radio-group>      
      </div>
    </div>

    <div v-if="running || done">
      <div v-if="running">
        <div class="alert alert-primary" role="alert">
          <b>Connection in progress. When connecting to a new node or updating a node it takes up to a couple of minutes to prepare the server.</b>&nbsp;
          <i class="fas fa-cog fa-spin"></i>
        </div>
      </div>

      <div v-if="success === true">
        <div class="alert alert-success" role="alert">
          Preparation Successful! You are good to go!
        </div>
      </div>
      <div v-if="success === false">
        <div class="alert alert-danger" role="alert">
          Unfortunately the preparations failed, please consult logs for details.
        </div>
      </div>        
    </div>
  </div>
</template>

<script>
export default {
  name: "ReleaseTab",
  components: {},
  data() {
    return {
      showAdvanced: false,
    };
  },
  props: {
    releases: Array,
    model: Object,
    running: Boolean,
    success: Boolean,
    done: Boolean,
    progress: Number,
    logs: Array,
  },
};
</script>

<style scoped></style>
