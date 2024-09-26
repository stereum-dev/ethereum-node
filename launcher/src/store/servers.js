import { defineStore } from "pinia";

export const useServers = defineStore("servers", {
  state: () => {
    return {
      //Terminal
      isTerminalRunning: false,
      killTerminalActive: false,
      newTerminalActive: false,
      terminalForceClear: false,
      //Connection

      connectingAnimActive: false,
      connectingProcess: false,
      errorMsgExists: false,
      error: "",
      alertBox: false,
      connections: [],
      selectedName: "",
      showPassword: false,

      //Server Management
      isUpdatePanelActive: false,
      newPassword: "",
      verifyPassword: "",
      isChangingPasswordActive: false,
      isPasswordChanged: false,
      passResponse: "",
      refreshServers: false,
      savedServers: [],
      selectedServerConnection: null,
      isServerAccessManagementActive: false,
      selectedServerToConnect: null,
      isAvatarModalActive: false,
      isRemoveModalActive: false,
      isRemoveProcessing: false,
      selectedAvatar: null,
      updateHandlerModal: true,

      avatars: [
        { id: 1, img: "/avatar/server_selection_1.png" },
        { id: 2, img: "/avatar/server_selection_2.png" },
        { id: 3, img: "/avatar/server_selection_3.png" },
        { id: 4, img: "/avatar/server_selection_4.png" },
        { id: 5, img: "/avatar/server_selection_5.png" },
        { id: 6, img: "/avatar/server_selection_6.png" },
        { id: 7, img: "/avatar/server_selection_7.png" },
        { id: 8, img: "/avatar/server_selection_8.png" },
        { id: 9, img: "/avatar/server_selection_9.png" },
        { id: 10, img: "/avatar/server_selection_10.png" },
        { id: 11, img: "/avatar/server_selection_11.png" },
        { id: 12, img: "/avatar/server_selection_12.png" },
        { id: 13, img: "/avatar/server_selection_13.png" },
        { id: 14, img: "/avatar/server_selection_14.png" },
        { id: 15, img: "/avatar/server_selection_15.png" },
        { id: 16, img: "/avatar/server_selection_16.png" },
        { id: 17, img: "/avatar/server_selection_17.png" },
        { id: 18, img: "/avatar/server_selection_18.png" },
        { id: 19, img: "/avatar/server_selection_19.png" },
        { id: 20, img: "/avatar/server_selection_20.png" },
      ],

      //SSH Key
      savePath: "",
      sshPassword: "",
      selectedCyper: "",
      bitAmount: "",
      selectedKeyType: "",
      internalLoginState: false,
      isGenerateModalActive: false,
      sshKeys: [],
      keyTypes: ["RSA", "ECDSA", "ED25519"],
      specifyCipherItems: [
        "3des-cbc",
        "aes128-cbc",
        "aes192-cbc",
        "aes256-cbc",
        "aes128-ctr",
        "aes192-ctr",
        "aes256-ctr",
        "aes128-gcm@openssh.com",
        "aes256-gcm@openssh.com",
      ],
      loginState: {
        hostName: "",
        ip: "",
        port: "",
        username: "",
        password: "",
        keyPath: "",
        passphrase: "",
        useAuth: false,
      },

      //Update
      serverUpdates: [],
      isUpdateProcessing: false,
      upgradablePackages: [],
      numberOfUpdatablePackages: null,
      allTasks: [],
      isMajorUpgradeActive: false,
      isMajorUpgradeButtonActive: false,

      //Form
      addNewServer: false,
      connectExistingServer: false,
      isIpScannerModalActive: false,

      //Server Management tabs
      isServerAnimationActive: false,
      isServerLoginActive: false,
      isServerDetailsActive: false,
      isServerSSHActive: false,
      isServerUpdateActive: false,
      isServerSettingsActive: false,
      isTwoFactorAuthActive: false,

      tabs: [
        { name: "login", icon: "/img/icon/server-management-icons/login.png", isActive: true, isDisabled: false },
        { name: "info", icon: "/img/icon/server-management-icons/infos.png", isActive: false, isDisabled: false },
        { name: "ssh", icon: "/img/icon/server-management-icons/lock.png", isActive: false, isDisabled: false },
        { name: "update", icon: "/img/icon/server-management-icons/download.png", isActive: false, isDisabled: false },
        { name: "settings", icon: "/img/icon/setting-page-icons/setting_icon.png", isActive: false, isDisabled: false },
        { name: "2fa", icon: "/img/icon/server-management-icons/2fa.png", isActive: false, isDisabled: false },
      ],
      selectedTab: null,

      //OTP Handling
      isOTPActive: false,
    };
  },
  actions: {
    setActiveTab(tab) {
      this.selectedTab = null;
      this.tabs.forEach((item) => {
        item.isActive = false;
      });

      this.tabs.find((item) => item.name === tab).isActive = true;
      this.selectedTab = tab;
    },

    setActiveState(state) {
      if (state === null) {
        this.isServerAnimationActive = false;
        this.isServerLoginActive = false;
        this.isServerDetailsActive = false;
        this.isServerSSHActive = false;
        this.isServerUpdateActive = false;
        this.isServerSettingsActive = false;
        this.isTwoFactorAuthActive = false;
      }
      this.isServerAnimationActive = false;
      this.isServerLoginActive = false;
      this.isServerDetailsActive = false;
      this.isServerSSHActive = false;
      this.isServerUpdateActive = false;
      this.isServerSettingsActive = false;
      this.isTwoFactorAuthActive = false;

      this[state] = true;
    },

    killTerminal() {
      this.killTerminalActive = true;
    },
    newTerminal() {
      this.newTerminalActive = true;
    },
    clearTerminal() {
      this.terminalForceClear = true;
    },
  },
});
