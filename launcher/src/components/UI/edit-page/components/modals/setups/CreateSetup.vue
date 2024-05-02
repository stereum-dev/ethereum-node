<template>
  <custom-modal
    main-title="CREATE A NEW SETUP"
    confirm-text="CONFIRM"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confrim"
  >
    <template #content>
      <div class="w-full h-full grid grid-cols-6 grid-rows-4 py-4 px-8 mt-12 gap-y-1">
        <input v-model="setupName" class="col-start-1 col-span-full row-start-1 row-span-1" type="text" />
        <input v-model="setupType" class="col-start-1 col-span-full row-start-2 row-span-2" type="text" />
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import CustomModal from "../CustomModal.vue";
import { useSetups } from "@/store/setups";
import ControlService from "@/store/ControlService";
import { v4 as uuidv4 } from "uuid";

const props = defineProps({
  network: String,
});

const emit = defineEmits(["closeWindow"]);
const setupStore = useSetups();
const setupName = ref("");
const setupType = ref("");

//Lifecycle
onMounted(() => {
  console.log(props.network);
});

//Methods

const confrim = async () => {
  const data = {
    id: uuidv4(),
    name: setupName.value,
    network: props.network,
    color: "blue",
    type: setupType.value,
    services: [],
  };
  console.log("confirm clicked", data);
  await ControlService.createMultiSetupContent(data);
  setupStore.isCreateSetupModalActive = false;
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>
