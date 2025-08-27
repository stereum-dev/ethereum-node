import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => ({
    serverSetups: [],
    allSetups: [],
    editSetups: [],
    stakingSetups: [],

    //select service pairs widget
    selectedServicePairs: null,
    currentPairIndex: 0,
    clientPairsLength: 0,
    relatedValidators: null,
    relatedValidatorPairs: null,
    selectedLCOMService: null,
    runningServicesCount: 0,
    //DEVNET NETWORK CONFIGURATION
    uploadedGenesisConfig: null,
    genesisFile: null,
    devnetConfigData: {
      network: "devnet",
      setupName: "",
      setupColor: "",
      genesisConfig: null,

      genesisChanged: false,
      configYaml: "",
      services: [],
    },
    devnetButtonDisabled: true,
    genesisChanged: false,
    isDevnetSetupModalActive: false,
    currentStep: 1,
    uploadedGenesisFile: null,

    configYaml: `
    CONFIG_NAME: interop
    PRESET_BASE: interop

    # Genesis
    GENESIS_FORK_VERSION: 0x20000089

    # Altair
    ALTAIR_FORK_EPOCH: 0
    ALTAIR_FORK_VERSION: 0x20000090

    # Merge
    BELLATRIX_FORK_EPOCH: 0
    BELLATRIX_FORK_VERSION: 0x20000091
    TERMINAL_TOTAL_DIFFICULTY: 0

    # Capella
    CAPELLA_FORK_EPOCH: 0
    CAPELLA_FORK_VERSION: 0x20000092
    MAX_WITHDRAWALS_PER_PAYLOAD: 16

    # Deneb
    DENEB_FORK_VERSION: 0x20000093
    DENEB_FORK_EPOCH: 0

    # Time parameters
    SECONDS_PER_SLOT: 12
    SLOTS_PER_EPOCH: 6

    # Deposit contract
    DEPOSIT_CONTRACT_ADDRESS: 0x4242424242424242424242424242424242424242
    `,

    //Setup Node Page
    isConfigViewActive: false,
    isRenameSetupActive: false,
    selectedSetup: {},

    //Setup Edit Page
    setupToRename: null,
    isEditConfigViewActive: false,
    selectedSetupInfos: null,

    //Create Setup
    selectedSetupNetwork: null,
    isCreateSetupModalActive: false,

    //Remove Setup
    isRemoveSetupActive: false,
    selectedSetupToRemove: [],

    //Import Setup YAML
    isImportAnimeActive: false,
    setupDataToImport: [],

    //Setup Connect
    isConnectSetupModalActive: false,
    selectedOPSetup: null,

    //Setup Others
    serverServices: ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService"],

    colorMappings: {
      default: { text: "text-gray-100", background: "bg-[#336666]" },
      blue: { text: "text-gray-100", background: "bg-blue-900" }, //#172554
      red: { text: "text-gray-800", background: "bg-red-300" }, //#fca5a5
      yellow: { text: "text-gray-800", background: "bg-[#dc9105]" },
      orange: { text: "text-gray-800", background: "bg-[#fb923c]" },
      green: { text: "text-gray-100", background: "bg-lime-900" }, //#365314
      beige: { text: "text-gray-800", background: "bg-[#D1BB9E]" },
      purple: { text: "text-gray-100", background: "bg-violet-900" }, //#4c1d95
      brown: { text: "text-gray-100", background: "bg-[#503C3C]" },
      gray: { text: "text-white", background: "bg-zinc-700" }, //#3f3f46
    },
    borderColorMappings: {
      default: { border: "border border-[#336666]" },
      blue: { border: "border border-blue-900" }, //#172554
      red: { border: "border border-red-300" }, //#fca5a5
      yellow: { border: "border border-[#dc9105]" },
      orange: { border: "border border-[#fb923c]" },
      green: { border: "border border-lime-900" }, //#365314
      beige: { border: "border border-[#D1BB9E]" },
      purple: { border: "border border-violet-900" }, //#4c1d95
      brown: { border: "border border-[#503C3C]" },
      gray: { border: "border border-zinc-700" }, //#3f3f46
    },
  }),
  getters: {
    //Setup layouts
    getColor: (state) => (colorName, type) => {
      const mapping = state.colorMappings[colorName] || {};
      return mapping[type] || (type === "text" ? "text-white" : "white");
    },

    //Setup Dropwdown
    getBGColor: (state) => (color) => {
      return state.colorMappings[color]?.background || "bg-[#33393E]";
    },
    getTextColor: (state) => (color) => {
      return state.colorMappings[color]?.text || "text-gray-300";
    },
    getBorderColor: (state) => (color) => {
      return state.borderColorMappings[color]?.border || "border border-[#33393E]";
    },
  },
  actions: {
    updateSelectedSetup() {
      const updatedSetup = this.editSetups.find((setup) => setup?.isActive === true);
      if (updatedSetup) {
        this.selectedSetup = updatedSetup;
      }
    },
    resetDevnetConfigData() {
      this.devnetConfigData = {
        network: "devnet",
        setupName: "",
        setupColor: "",
        genesisConfig: null,
        uploadedGenesisConfig: null,
        genesisChanged: false,
        configYaml: "",
        services: [],
      };
    },
  },
});
