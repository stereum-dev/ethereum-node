<template>
  <div class="expert-parent">
    <div class="opacityBackground" @click="$emit('hideModal')"></div>
    <div class="expert-modal" :style="{ left: `${position}%` }">
      <div class="serviceDetails">
        <span class="nameSpan">{{ item.name }}</span>
        <p class="category">
          {{ item.category }}
          <span v-if="item.category != 'service'">client</span>
        </p>
        <span class="serviceId">ID: {{ item.config.serviceID }}</span>
      </div>
      <div class="expertRow" :class="{ shorterRowBox: isExpertModeActive }">
        <!-- plugin docs row -->
        <div v-if="!isExpertModeActive && !ssvExpertModeActive" class="docBox">
          <img class="titleIcon" src="/img/icon/plugin-menu-icons/doc.png" alt="icon" />
          <span class="docTitle">SERVICE DOCS</span>
          <span class="openBtn" @click="openDocs(item.docsUrl)">open</span>
        </div>
        <!-- expert mode row -->
        <div v-if="!ssvExpertModeActive" class="dataTitleBox" @click="openExpertMode">
          <img class="titleIcon" src="/img/icon/plugin-menu-icons/crown2.png" alt="icon" />
          <span>Expert Mode</span>
          <img v-if="isExpertModeActive" src="/img/icon/task-manager-icons/up.png" alt="" />
          <img v-else src="/img/icon/task-manager-icons/down.png" alt="" />
        </div>
        <div
          v-if="item.service === 'SSVNetworkService' && !isExpertModeActive"
          class="dataTitleBox"
          @click="openSSVExpertMode"
        >
          <img class="titleIcon" src="/img/icon/plugin-menu-icons/ssv-config.png" alt="icon" />
          <span>SSV Configuration</span>
          <img v-if="ssvExpertModeActive" src="/img/icon/task-manager-icons/up.png" alt="" />
          <img v-else src="/img/icon/task-manager-icons/down.png" alt="" />
        </div>

        <!--
        option needs: {
          title: string,
          type: "select",
          value: array,
          changeValue: null
          icon: string (path)
          unit: string
          }
        -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'select')"
          :key="index"
          class="selectBox"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span>{{ option.title }}</span>
          <div class="spaceParent">
            <select id="value" v-model="option.changeValue" @change="somethingIsChanged(option)">
              <option v-for="(rate, idx) in option.value" :key="idx" :value="rate">{{ rate }} {{ option.unit }}</option>
            </select>
          </div>
        </div>

        <!--
        option needs: {
          title: string,
          type: "text",
          changeValue: string,
          icon: string (path)
          }
        -->
        <!-- <div
          class="actionBox"
          v-if="!isExpertModeActive && !ssvExpertModeActive"
        >
          <img src="/img/icon/plugin-menu-icons/ServiceAutoUpdate.png" alt="" />
          <span class="actionBoxTitle">Services Update Configuration</span>
          <div class="updateService">
            <select
              name="update"
              id="updateService"
              v-model="updateSelect"
              @change="somethingIsChanged()"
            >
              <option value="auto">AUTO</option>
              <option value="manual">MANUAL</option>
            </select>
          </div>
        </div> -->
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'text')"
          :key="index"
          class="toggleTextBox"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img class="titleIcon" :src="option.icon" alt="icon" />
          <span>{{ option.title }}</span>
          <Transition name="slide-up">
            <img
              v-if="option.buttonState"
              class="buttonOff"
              src="/img/icon/plugin-menu-icons/confirm.png"
              alt="icon"
              @click="buttonOff(option)"
            />
            <img
              v-else
              class="buttonOn"
              src="/img/icon/plugin-menu-icons/edit2.png"
              alt="icon"
              @click="buttonOn(option)"
            />
          </Transition>
          <input
            v-model="option.changeValue"
            class="toggleTextInput"
            type="text"
            :class="{
              disabled:
                !option.buttonState &&
                (option.changeValue === null || option.changeValue === '0x0000000000000000000000000000000000000000'),
            }"
            @input="somethingIsChanged(option)"
          />
        </div>

        <!--
        option needs: {
          title: string,
          type: "action",
          action: string,
          icon: string (path)
          }
        -->

        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'action')"
          :key="index"
          class="actionBox"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img :src="option.icon" alt="icon" />
          <span class="actionBoxTitle">{{ option.title }}</span>
          <div class="toggleBox">
            <label class="switch">
              <input
                v-model="option.changeValue"
                :disabled="option.disabled"
                type="checkbox"
                name="check-button"
                @change="somethingIsChanged()"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div
          v-for="(option, index) in item.expertOptions.filter((option) => option.type === 'toggle')"
          :key="index"
          class="actionBox"
          :class="{ unvisible: isExpertModeActive }"
        >
          <img :src="option.icon" alt="icon" />
          <span class="actionBoxTitle">{{ option.title }}</span>
          <div class="toggleBox">
            <label class="switch">
              <input
                v-model="option.changeValue"
                :disabled="option.disabled"
                type="checkbox"
                name="check-button"
                @change="somethingIsChanged(option)"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <!-- expert mode textarea -->
      <div class="expertTable">
        <div v-if="isExpertModeActive" class="expertMode">
          <textarea v-model="item.yaml" class="editContent" @input="somethingIsChanged"></textarea>
        </div>
        <div v-if="ssvExpertModeActive" class="expertMode">
          <textarea v-model="item.ssvConfig" class="editContent" @input="somethingIsChanged"></textarea>
        </div>
      </div>
      <div class="btn-box">
        <!-- service version -->
        <p class="serviceVersion">
          version: <span>{{ item.config.imageVersion }}</span>
        </p>
        <!-- close text -->
        <span class="exit-btn">{{ $t("exitValidatorModal.clickClose") }}</span>
        <!-- confirm button box -->
        <div v-if="!nothingsChanged" class="confirmBtn" @click="confirmExpertChanges(item)">
          <span>Confirm</span>
        </div>
        <div v-else class="disabledBtn">
          <span>Confirm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ControlService from "@/store/ControlService";
import { useStore } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { ref, computed } from "vue";

const { emit } = defineEmits(["hideModal", "prunningWarning", "resyncWarning"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
});
const isExpertModeActive = ref(false);
const ssvExpertModeActive = ref(false);
const updateSelect = ref("auto");
// const enterPortIsEnabled = ref(false);

const nothingsChanged = ref(true);

// Add any other reactive state variables here as needed.

// Computed properties using the `computed` function.
const store = useStore();
const currentNetwork = computed(() => {
  return useNodeManage(store).currentNetwork;
});

// Methods
const openDocs = (docsUrl) => {
  window.open(docsUrl, "_blank");
  if (currentNetwork.value.network === "gnosis") {
    window.open("https://docs.gnosischain.com/node/", "_blank");
  }
};

const somethingIsChanged = (option) => {
  if (option && option.title) option.changed = true;
  nothingsChanged.value = false;
};

const readService = async () => {
  props.item.yaml = await ControlService.getServiceYAML(props.item.config.serviceID);

  // updateSelect.value = checkAutoUpdate([...props.item.yaml.match(new RegExp("(autoupdate: )(.*)(\\n)"))][2]);

  if (props.item.service === "SSVNetworkService") {
    props.item.ssvConfig = await ControlService.readSSVNetworkConfig(props.item.config.serviceID);
  }

  props.item.expertOptions = props.item.expertOptions.map((option) => {
    if (props.item.yaml.includes("isPruning: true")) {
      option.disabled = true;
      if (option.type === "action") option.changeValue = true;
    } else {
      if (option.type === "action") option.changeValue = false;
      option.disabled = false;
    }
    if (option.type === "select" || option.type === "text" || option.type === "toggle") {
      option.changeValue = [...props.item.yaml.match(new RegExp(option.pattern))][2];
    }
    return {
      ...option,
      buttonState: false,
      runningAction: false,
    };
  });
};

const writeService = async () => {
  props.item.yaml = props.item.yaml.replace(new RegExp("(autoupdate: )(.*)(\\n)"), "$1" + checkAutoUpdate() + "$3");
  props.item.expertOptions.forEach((option) => {
    if (option.changeValue != undefined && option.changeValue != null && !isNaN(option.changeValue)) {
      if (option.changed) {
        props.item.yaml = props.item.yaml.replace(new RegExp(option.pattern), "$1" + option.changeValue + "$3");
      }
      option.changed = false;
    }
  });
  if (props.item.service === "SSVNetworkService") {
    await ControlService.writeSSVNetworkConfig({
      serviceID: props.item.config.serviceID,
      config: props.item.ssvConfig,
    });
  }
  await ControlService.writeServiceYAML({
    id: props.item.config.serviceID,
    data: props.item.yaml,
    service: props.item.service,
  });
};

const checkAutoUpdate = (val) => {
  if (val != undefined && val != null && !isNaN(val)) {
    val = val == "true";
    return val ? "auto" : "manual";
  }
  return updateSelect.value == "manual" ? "false" : "true";
};

const openExpertMode = () => {
  isExpertModeActive.value = !isExpertModeActive.value;
};

const openSSVExpertMode = () => {
  ssvExpertModeActive.value = !ssvExpertModeActive.value;
};

// const endpointPortTrunOff = () => {
//   enterPortIsEnabled.value = false;
// };

// const endpointPortTrunOn = () => {
//   enterPortIsEnabled.value = true;
// };

const buttonOn = (option) => {
  option.buttonState = true;
};

const buttonOff = (option) => {
  option.buttonState = false;
};

const actionHandler = (el) => {
  if (el.name === "Geth") {
    el.expertOptions
      .filter((item) => {
        return item.title === "Pruning";
      })
      .map((item) => {
        if (item.changeValue) {
          item.displayWarningModal = true;
          emit("prunningWarning", item);
        }
      });
  }
  if (el.category === "execution" || el.category === "consensus") {
    el.expertOptions
      .filter((item) => {
        return item.title === "Resync";
      })
      .map((item) => {
        if (item.changeValue) {
          item.displayResyncModal = true;
          emit("resyncWarning", item);
        }
      });
  }
};

const confirmExpertChanges = async (el) => {
  await writeService();
  el.expertOptionsModal = false;
  actionHandler(el);
  await ControlService.restartService(el.config.serviceID);
};

readService();
</script>
