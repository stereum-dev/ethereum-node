<template>
  <div class="technical-box_parent" name="contributors-list">
    <select
      class="techToggl"
      name="technikToggl"
      id="technikToggl"
      v-model="techToggl"
    >
      <option value="developers">DEVELOPERS</option>
      <option value="testers">TESTERS</option>
    </select>
    <div class="wrapper" v-if="compToggl">
      <the-contributor
        v-for="result in results"
        :key="result.id"
        :name="result.name"
        :avatar="result.avatar"
      ></the-contributor>
    </div>
    <div class="wrapper" v-else>
      <the-contributor
        v-for="result in filterTesters"
        :key="result.id"
        :name="result.name"
        :avatar="result.avatar"
      ></the-contributor>
    </div>
  </div>
</template>
<script>
import TheContributor from "./TheContributor.vue";
export default {
  components: { TheContributor },
  data() {
    return {
      results: [],
      issuesVal: [],
      techToggl: "developers",
      compToggl: true,
    };
  },
  updated() {
    this.toggleHandler();
  },
  created() {
    this.github();
    this.issues();
  },

  computed: {
    filterTesters() {
      return [
        ...new Map(this.issuesVal.map((item) => [item.name, item])).values(),
      ];
    },
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
          const results = [];
          for (const id in data) {
            results.push({
              id: id,
              name: data[id].user.login,
              avatar: data[id].user.avatar_url,
            });
          }
          this.issuesVal = results;
        });
    },
    toggleHandler() {
      if (this.techToggl === "developers") {
        return (this.compToggl = true);
      } else if (this.techToggl === "testers") {
        return (this.compToggl = false);
      }
    },
  },
};
</script>
<style scoped>
.technical-box_parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.techToggl {
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  text-align-last: center;
  line-height: inherit;
  border-radius: 10px;
  font-weight: 500;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  position: fixed;
  top: 20%;
  left: 85%;
}
.techToggl:hover,
.techToggl:focus,
.techToggl:active {
  outline: none;
  border: none;
}
.wrapper {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(4, 1fr);
  width: 95%;
  height: 80%;
  gap: 2.2%;
  justify-content: center;
  align-items: center;
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
