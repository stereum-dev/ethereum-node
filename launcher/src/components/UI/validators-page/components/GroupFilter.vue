<template>
  <div v-if="groups.length > 0 || validatorsStore.groupFilter !== 'all'" ref="root" class="relative shrink-0">
    <button
      class="h-7 rounded-full bg-[#0D0D12] border px-3 text-2xs uppercase font-semibold flex items-center gap-1.5 max-w-[150px] shrink-0"
      :class="validatorsStore.groupFilter !== 'all' ? 'border-teal-400' : 'border-[#4b8585]'"
      :title="label"
      @click="open = !open"
    >
      <img src="/img/icon/staking-page-icons/group.png" class="w-4 h-4 shrink-0" alt="" />
      <span class="truncate">{{ label }}</span>
    </button>

    <!-- overlays the list, so it never changes the list's size -->
    <div
      v-if="open"
      class="absolute top-8 left-0 z-20 w-[320px] max-h-[260px] overflow-y-auto rounded-lg bg-linear-to-br from-[#1A1A20] to-[#0D0D12] border border-[#4b8585] shadow p-1 flex flex-col gap-0.5"
    >
      <button :class="[LINE, lineClass('all')]" @click="choose('all')">
        <span class="grow text-left truncate">{{ t("validatorsPage.allKeys") }}</span>
        <span class="text-gray-400">{{ allRows.length }}</span>
      </button>
      <button :class="[LINE, lineClass('ungrouped')]" @click="choose('ungrouped')">
        <span class="grow text-left truncate">{{ t("validatorsPage.ungrouped") }}</span>
        <span class="text-gray-400">{{ ungroupedCount }}</span>
      </button>
      <div v-for="group in groups" :key="group.id" :class="[LINE, lineClass(group.id)]">
        <button class="flex items-center gap-2 grow min-w-0 h-full text-left" :title="group.name" @click="choose(group.id)">
          <img src="/img/icon/staking-page-icons/group-circle-icon.png" class="w-4 h-4 shrink-0" alt="" />
          <span class="grow truncate font-semibold">{{ group.name }}</span>
          <span class="shrink-0 text-gray-400">{{ t("validatorsPage.groupKeys", { count: group.count }, group.count) }}</span>
          <span class="shrink-0 text-amber-300">{{ hasStats ? formatEth(group.balance, 2) : "n/a" }}</span>
        </button>
        <IconButton
          small
          icon="/img/icon/staking-page-icons/rename.png"
          :label="t('validatorsPage.renameGroupTitle')"
          @click="openModal('renameGroup', group.id)"
        />
        <IconButton
          small
          icon="/img/icon/staking-page-icons/remove-group.png"
          :label="t('validatorsPage.ungroup')"
          @click="openModal('ungroup', group.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import IconButton from "./IconButton.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../useHolderRows";
import { formatEth } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { allRows, groups, ungroupedCount, hasStats } = useHolderRows();
const open = ref(false);
const root = ref(null);

const LINE = "flex items-center gap-2 h-8 shrink-0 rounded-full border px-3 text-xs cursor-pointer";
const lineClass = (filter) =>
  validatorsStore.groupFilter === filter ? "bg-[#224141] border-[#4b8585]" : "border-transparent hover:bg-[#1f2a2a]";

const label = computed(() => {
  const filter = validatorsStore.groupFilter;
  if (filter === "all") return t("validatorsPage.allGroups");
  if (filter === "ungrouped") return t("validatorsPage.ungrouped");
  return groups.value.find((g) => g.id === filter)?.name ?? t("validatorsPage.allGroups");
});

const choose = (filter) => {
  validatorsStore.groupFilter = filter;
  open.value = false;
};
const openModal = (type, groupID) => {
  open.value = false;
  validatorsStore.modal = { type, pubkeys: [], groupID };
};

// a group whose keys were all ungrouped or removed would leave an empty list without a line to undo it
watch(
  () => [validatorsStore.groupFilter, groups.value],
  ([filter]) => {
    if (filter !== "all" && filter !== "ungrouped" && !groups.value.some((g) => g.id === filter)) validatorsStore.groupFilter = "all";
  },
  { immediate: true }
);

const onMousedown = (event) => open.value && root.value && !root.value.contains(event.target) && (open.value = false);
// capture, so Escape closes the dropdown and not the drawer underneath
const onKeydown = (event) => {
  if (!open.value || event.key !== "Escape") return;
  event.stopImmediatePropagation();
  open.value = false;
};
onMounted(() => {
  document.addEventListener("mousedown", onMousedown);
  window.addEventListener("keydown", onKeydown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onMousedown);
  window.removeEventListener("keydown", onKeydown, true);
});
</script>
