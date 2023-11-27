<template>
  <staking-custom-modal
    main-title="Remove Group"
    title-color="remove"
    message-text="Are you sure you want to remove this group?"
    confirm-text="DELETE"
    :active-button="activeButton"
    @confirm-action="removeGroup"
  >
    <template #content>
      <div class="col-start-1 col-span-full row-start-4 row-end-6 w-full h-full grid grid-cols-12 grid-rows-2">
        <p
          class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-1 text-sm text-left text-gray-300 flex justify-start items-center px-4"
        >
          Group ID: <span class="text-amber-400 ml-5">{{ group.id }}</span>
        </p>
        <p
          class="w-full h-full col-start-3 col-end-11 row-start-2 row-span-1 text-sm text-left text-gray-300 flex justify-start items-center px-4"
        >
          Group Name:
          <span class="text-amber-400 ml-5">{{ group.name }}</span>
        </p>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const emit = defineEmits(["removeGroup"]);

const stakingStore = useStakingStore();

const group = computed(() => {
  return stakingStore.currentGroup;
});

const activeButton = computed(() => {
  if (stakingStore.currentGroup) {
    return true;
  }
  return false;
});

const removeGroup = () => {
  emit("removeGroup", group.value);
};
</script>
