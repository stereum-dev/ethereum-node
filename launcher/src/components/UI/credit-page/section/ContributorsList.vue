<template>
  <div class="contributors-parent w-full h-full">
    <div v-if="loader" class="loader">
      <div class="spinner-square">
        <div class="square-1 square"></div>
        <div class="square-2 square"></div>
        <div class="square-3 square"></div>
      </div>
    </div>
    <div v-else class="contributors-list" name="contributors-list">
      <TheContributor
        v-for="(result, index) in results"
        :key="result.id"
        :class="getClass(index)"
        :name="result.name"
        :avatar="result.avatar"
        :crown="headerStore.choosedCreditType !== 'translation' && index === 0"
        :rank="headerStore.choosedCreditType !== 'translation' ? index + 1 : ''"
        :score="result.score"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TheContributor from "../components/TheContributor.vue";
import { useNodeHeader } from "@/store/nodeHeader";

const headerStore = useNodeHeader();

const results = ref([]);
const isLoading = ref(true);

const loader = computed(() => results.value.length === 0);

onMounted(() => {
  if (headerStore.choosedCreditType === "technical contribution") {
    fetchGithubContributors();
  } else if (headerStore.choosedCreditType === "feedback, testing & suggestions") {
    fetchStereumTesters();
  } else if (headerStore.choosedCreditType === "translation") {
    fetchStereumTranslators();
  }
});

const fetchStereumTesters = async () => {
  isLoading.value = true;
  try {
    const response = await fetch("/testers");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    results.value = responseData.data.testers.map((tester) => ({
      name: tester.username,
      avatar: tester.avatarUrl,
      score: tester.testsCount,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchStereumTranslators = async () => {
  isLoading.value = true;
  try {
    const response = await fetch("/translators");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    results.value = responseData.data.translators
      .map((translator) => ({
        name: translator.username,
        avatar: translator.avatarUrl,
        score: translator.testsCount,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchGithubContributors = () => {
  isLoading.value = true;
  fetch("https://api.github.com/repos/stereum-dev/ethereum-node/contributors")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      results.value = data.map((contributor, index) => ({
        id: index,
        name: contributor.login,
        avatar: contributor.avatar_url,
        score: contributor.contributions,
      }));
    })
    .catch((error) => console.error("Error fetching data:", error))
    .finally(() => (isLoading.value = false));
};

const getClass = (index) => {
  const baseClasses = {};
  if (headerStore.choosedCreditType !== "translation") {
    if (index === 0) baseClasses["gold-border"] = true;
    else if (index === 1) baseClasses["silver-border"] = true;
    else if (index === 2) baseClasses["bronze-border"] = true;
  }
  return baseClasses;
};
</script>

<style scoped>
.contributors-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(250px, auto);
  gap: 10px;
  max-height: 395px;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
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

.loader {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.spinner-square {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.square {
  width: 5%;
  height: 40%;
  border-radius: 20px;
  margin-right: 5%;
}

.square-1 {
  animation: square-anim 1200ms 0s infinite;
}

.square-2 {
  animation: square-anim 1200ms 200ms infinite;
}

.square-3 {
  animation: square-anim 1200ms 400ms infinite;
}

@keyframes square-anim {
  0% {
    height: 40%;
    background-color: #336666;
  }
  20% {
    height: 40%;
  }
  40% {
    height: 80%;
    background-color: #478e8e;
  }
  80% {
    height: 40%;
  }
  100% {
    height: 40%;
    background-color: #336666;
  }
}
</style>
