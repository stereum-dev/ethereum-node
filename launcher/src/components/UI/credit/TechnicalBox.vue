<template>
  <div class="technical-box_parent" name="contributors-list">
    <select
      class="techToggl"
      name="technikToggl"
      id="technikToggl"
      v-model="techToggl"
    >
      <option value="developers">{{ $t("creditPanel.developers") }}</option>
      <option value="testers">{{ $t("creditPanel.testers") }}</option>
    </select>
    <div class="wrapper" v-if="compToggl">
      <the-contributor
        :class="{
          'gold-border': index === 0,
          'silver-border': index === 1,
          'bronze-border': index === 2,
        }"
        v-for="(result, index) in results"
        :key="result.id"
        :name="result.name"
        :avatar="result.avatar"
        :crown="index == 0"
        :rank="index + 1"
        :score="result.score"
      ></the-contributor>
    </div>
    <div class="wrapper" v-else>
      <div class="testers-container">
        <test-contributor
          v-for="result in filterTesters"
          :key="result.id"
          :name="result.name"
          :avatar="result.avatar"
        ></test-contributor>
      </div>
    </div>
  </div>
</template>
<script>
import TheContributor from "./TheContributor.vue";
import TestContributor from "./TestContributor.vue";
export default {
  components: { TheContributor, TestContributor },
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
              score: data[id].contributions,
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
.testers-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(7, 1fr);
  width: 90%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-gap: 2%;
  overflow: visible;
  margin-top: 2%;
}
.gold-border {
  border: 2px solid gold;
}
.silver-border {
  border: 2px solid silver;
}
.bronze-border {
  border: 2px solid #cd7f32;
}

.technical-box_parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.techToggl {
  height: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  text-align-last: center;
  line-height: inherit;
  border-radius: 10px;
  font-weight: 500;
  box-sizing: border-box;
  box-shadow: 1px 1px 7px 1px rgb(6, 6, 6);
  position: fixed;
  top: 20%;
  left: 85%;
}

.wrapper {
  display: flex;
  width: 100%;
  height: 70vh;
  gap: 2.2%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
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
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
