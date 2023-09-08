<template>
  <div class="technical-box_parent" name="contributors-list">
    <select id="technikToggl" v-model="techToggl" class="techToggl" name="technikToggl">
      <option value="developers">{{ $t("creditPanel.developers") }}</option>
      <option value="testers">{{ $t("creditPanel.testers") }}</option>
    </select>
    <div v-if="compToggl" class="wrapper">
      <the-contributor
        v-for="(result, index) in results"
        :key="result.id"
        :class="{
          'gold-border': index === 0,
          'silver-border': index === 1,
          'bronze-border': index === 2,
        }"
        :name="result.name"
        :avatar="result.avatar"
        :crown="index == 0"
        :rank="index + 1"
        :score="result.score"
      />
    </div>
    <div v-else class="wrapper">
      <the-contributor
        v-for="(result, index) in testerResults"
        :key="result.score"
        :class="{
          'gold-border': index === 0,
          'silver-border': index === 1,
          'bronze-border': index === 2,
        }"
        :name="result.username"
        :avatar="result.avatar"
        :crown="index == 0"
        :rank="index + 1"
        :score="result.score"
      />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import TheContributor from "./TheContributor.vue";
export default {
  components: { TheContributor },
  data() {
    return {
      results: [],
      issuesVal: [],
      techToggl: "developers",
      compToggl: true,
      isLoading: true,
      testerResults: [],
    };
  },

  computed: {
    filterTesters() {
      return [...new Map(this.issuesVal.map((item) => [item.name, item])).values()];
    },
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },
  updated() {
    this.toggleHandler();
  },
  created() {
    this.github();
  },
  mounted() {
    this.stereumTesters();
  },
  methods: {
    async stereumTesters() {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const testersData = responseData.data.testers;

        const results = testersData.map((tester) => ({
          username: tester.username,
          avatar: tester.avatarUrl,
          score: tester.testsCount,
        }));

        this.testerResults = results;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    github() {
      fetch("https://api.github.com/repos/stereum-dev/ethereum-node/contributors")
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
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  text-align-last: center;
  line-height: inherit;
  border-radius: 10px;
  font-weight: 700;
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
