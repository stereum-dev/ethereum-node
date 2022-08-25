<template>
  <div class="technical-box_parent">
    <the-contributor
      v-for="result in results"
      :key="result.id"
      :name="result.name"
      :avatar="result.avatar"
    ></the-contributor>
  </div>
</template>
<script>
import TheContributor from "./TheContributor.vue";
export default {
  components: { TheContributor },
  data() {
    return {
      results: [],
    };
  },
  created() {
    this.github();
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
          console.log(this.results);
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
</style>
