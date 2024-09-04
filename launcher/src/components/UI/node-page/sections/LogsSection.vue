<template>
  <div class="absolute top-[1px] bottom-2 w-full h-[554px] p-2">
    <LogsPage
      :client="client"
      @close-log="closeLog"
      @export-log="exportLog"
      @export-all-log="exportAllLog"
      @export-customized-logs="exportCustomizedLogs"
    />
  </div>
</template>

<script setup>
import LogsPage from "@/components/UI/node-page/components/logs/LogsPage.vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close-log", "export-log", "export-all-log", "export-customized-logs"]);

const closeLog = () => {
  emit("close-log");
};

const exportLog = (item) => {
  emit("export-log", item);
};

const exportAllLog = (item) => {
  emit("export-all-log", item);
};

const exportCustomizedLogs = (item) => {
  emit("export-customized-logs", item);
};
</script>
