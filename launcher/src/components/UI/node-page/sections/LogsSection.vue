<template>
  <div class="w-full h-full col-start-1 col-span-full items-center grid grid-cols-24 grid-rows-12 absolute">
    <LogsHeader :client="client" />
    <LogsBody :client="client" />
    <LogsFooter :client="client" />
  </div>
</template>

//
<script setup>
import LogsHeader from "../components/logs/LogHeader.vue";
import LogsBody from "../components/logs/LogBody.vue";
import LogsFooter from "../components/logs/LogFooter.vue";
// import ControlDialog from "../../the-control/ControlDialog.vue";
// import { useNodeStore } from "@/store/theNode";
// import { useServices } from "@/store/services";
// import { saveAs } from "file-saver";
// import { ref } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

// const nodeStore = useNodeStore();
// const serviceStore = useServices();

// const logsList = ref([]);
// const openDialog = ref(false);
// const dialogValue = ref("");
// const copyIcon = ref("/img/icon/control/ok.png");

// const filteredServiceLogs = () => {
//   nodeStore.serviceLogs.forEach((i) => {
//     if (i.config?.serviceID === props.item.config?.serviceID) {
//       logsList.value = i.logs;
//     }
//   });
// };

// const copy = (e) => {
//   const copyText = e.target.innerText;
//   navigator.clipboard.writeText(copyText);
//   openDialog.value = !openDialog.value;
//   dialogValue.value = "Copied to clipboard!";
//   dialogIcon.value = copyIcon;
//   if (openDialog.value === true) {
//     setTimeout(() => {
//       openDialog.value = false;
//     }, 700);
//   }
// };
//
</script>
