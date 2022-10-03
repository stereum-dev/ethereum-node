<template>
  <transition-group
    tag="div"
    class="technical-box_parent"
    name="contributors-list"
  >
    <the-contributor
      v-for="result in results"
      :key="result.id"
      :name="result.name"
      :avatar="result.avatar"
    ></the-contributor>
    <the-contributor
      :name="issuesVal.name"
      :avatar="issuesVal.avatar"
    ></the-contributor>
  </transition-group>
</template>
<script>
import TheContributor from "./TheContributor.vue";
export default {
  components: { TheContributor },
  data() {
    return {
      results: [],
      issuesVal: [],
    };
  },
  created() {
    this.github();
    this.issues();
  },
  methods: {
    github() {
      fetch(
        "https://api.github.com/repos/stereum-dev/ethereum-node/contributors"
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const results = [];
          for (const id in data) {
            results.push({
              id: id,
              name: data[id].login,
              avatar: data[id].avatar_url,
            });
          }
          this.results = results;
        });
    },
    issues() {
      fetch("https://api.github.com/repos/stereum-dev/ethereum-node/issues")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const issuesVal = [];
          for (const id in data) {
            issuesVal.push({
              id: id,
              name: data[id].title,
              avatar: data[id].number,
            });
          }
          this.issuesVal = issuesVal;
        });
    },
  },
};
</script>
<style scoped>
.technical-box_parent {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(4, 1fr);
  width: 95%;
  height: 80%;
}

.contributors-list-enter-from {
  opacity: 0;
}
.contributors-list-enter-active {
  transition: all 0.5s ease-out;
}
.contributors-list-enter-to {
  opacity: 1;
}
</style>
