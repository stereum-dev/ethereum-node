<template>
  <div class="w-full mt-2 mx-auto px-4">
    <div class="w-full h-[240px] overflow-y-auto bg-[#18191a] rounded-md">
      <div class="grid grid-cols-2 gap-4 p-2">
        <template v-for="(value, key) in flattenedGenesis" :key="key">
          <div class="flex items-center">
            <img src="/img/icon/edit-node-icons/setting.png" alt="Gear" class="w-6 h-6 mr-2" />
            <span class="text-xs uppercase text-gray-300">{{ formatLabel(key) }}</span>
          </div>
          <div class="flex justify-end items-center">
            <input
              v-model="flattenedGenesis[key]"
              :placeholder="key"
              class="bg-gray-700 text-white p-2 rounded"
              :class="getInputType(flattenedGenesis[key]) === 'checkbox' ? 'w-5 h-5' : 'w-full h-9'"
              :type="getInputType(flattenedGenesis[key])"
              @input="updateStore"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGenesis } from "@/store/genesis";
import { onMounted, ref, watch } from "vue";

const genesisStore = useGenesis();

const flattenedGenesis = ref({});

watch(
  () => genesisStore.genesis,
  () => {
    initializeFlattenedGenesis();
  }
);

const initializeFlattenedGenesis = () => {
  // eslint-disable-next-line no-unused-vars
  const { alloc, ...rest } = genesisStore.genesis;
  flattenedGenesis.value = flattenObject(rest);
  console.log(flattenedGenesis.value);
};

const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const formatLabel = (key) => {
  return key
    .split(".")
    .pop()
    .replace(/([A-Z])/g, " $1")
    .toUpperCase();
};

//Handle different input types
const getInputType = (value) => {
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (typeof value === "string" && value.startsWith("0x")) return "text";
  return "text";
};

const unflattenObject = (obj) => {
  const result = {};
  for (const key in obj) {
    const keys = key.split(".");
    keys.reduce((acc, k, i) => {
      return (acc[k] = i === keys.length - 1 ? obj[key] : acc[k] || {});
    }, result);
  }
  console.log("unflatt", result);

  return result;
};

//Update genesis store in pina
const updateStore = () => {
  const updatedGenesis = unflattenObject(flattenedGenesis.value);
  genesisStore.updateGenesisExceptAlloc(updatedGenesis);
};

//Lifecycle hooks
onMounted(() => {
  initializeFlattenedGenesis();
});
</script>

<style scoped>
.overflow-y-auto {
  max-height: calc(300px - 2rem);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
