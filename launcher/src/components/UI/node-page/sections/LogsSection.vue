<template>
  <div></div>
</template>

//
<script setup>
// import ControlDialog from "../../the-control/ControlDialog.vue";
// import { useNodeStore } from "@/store/theNode";
// import { useServices } from "@/store/services";
// import { saveAs } from "file-saver";
// import { ref } from "vue";

// const props = defineProps({
//   item: {
//     type: Object,
//     default: null,
//   },
// });

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
