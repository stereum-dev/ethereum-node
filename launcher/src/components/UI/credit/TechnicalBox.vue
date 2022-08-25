<template>
  <div class="technical-box_parent"></div>
</template>
<script>
export default {
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
  display: flex;
  width: 95%;
  height: 80%;
}
</style>
