<template>
  <div class="w-full h-full items-center grid grid-cols-24 grid-rows-12 rounded-md">
    <LogHeader :client="client" @close-log="closeLog" />
    <LogBody :client="client" />
    <LogFooter :client="client" @export-log="exportLog" @export-all-log="exportAllLog" @export-customized-logs="exportCustomizedLogs" />
  </div>
</template>

<script setup>
import LogHeader from "./LogHeader.vue";
import LogBody from "./LogBody.vue";
import LogFooter from "./LogFooter.vue";

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
