import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import { useRouter } from "vue-router";

export const useServerLogin = () => {
  const serverStore = useServers();
  const router = useRouter();

  const getStorableConnections = () => {
    const storableConnections = [];
    serverStore.connections.forEach((e) => {
      storableConnections.push({
        name: e.name,
        host: e.host,
        user: e.user,
        port: e.port,
        keylocation: e.keylocation,
        useAuthKey: e.useAuthKey,
      });
    });
    return storableConnections;
  };

  const setSelectedConnection = (connection) => {
    serverStore.selectedServerConnection = serverStore.connections.find((obj) => obj.name === connection.name);
    serverStore.loginState.hostName = serverStore.selectedServerConnection.name;
    serverStore.loginState.ip = serverStore.selectedServerConnection.host;
    serverStore.loginState.username = serverStore.selectedServerConnection.user;
    serverStore.loginState.port = serverStore.selectedServerConnection.port;
    serverStore.loginState.keyPath = serverStore.selectedServerConnection.keylocation;
    serverStore.loginState.useAuth = serverStore.selectedServerConnection.useAuthKey;
    serverStore.loginState.password = "";
    serverStore.loginState.passphrase = "";
  };

  const resetServerStoreLoginState = () => {
    serverStore.loginState.hostName = "";
    serverStore.loginState.ip = "";
    serverStore.loginState.username = "";
    serverStore.loginState.port = "";
    serverStore.loginState.password = "";
    serverStore.loginState.keyPath = "";
    serverStore.loginState.useAuth = false;
    serverStore.loginState.passphrase = "";
  };

  const createConnection = () => {
    return {
      name: serverStore.loginState.hostName,
      host: serverStore.loginState.ip,
      user: serverStore.loginState.username,
      port: serverStore.loginState.port,
      keylocation: serverStore.loginState.keyPath,
      useAuthKey: serverStore.loginState.useAuth,
    };
  };

  const loadStoredConnections = async () => {
    const storageSavedConnections = await ControlService.readConfig();
    let savedConnections = [];
    if (storageSavedConnections !== undefined && storageSavedConnections.savedConnections !== undefined) {
      savedConnections = savedConnections.concat(storageSavedConnections.savedConnections);
    }
    serverStore.connections = savedConnections;
  };

  const writeSettings = async () => {
    const config = await ControlService.readConfig();
    ControlService.writeConfig({
      ...config,
      savedConnections: getStorableConnections(),
    });
  };

  const login = async (signal) => {
    console.log("Composables", signal);
    serverStore.isServerAnimationActive = true;
    serverStore.errorMsgExists = false;

    try {
      await ControlService.connect({
        host: serverStore.loginState.ip.trim(),
        port: serverStore.loginState.port,
        user: serverStore.loginState.username.trim(),
        password: serverStore.loginState.password,
        sshKeyAuth: serverStore.loginState.useAuth,
        keyfileLocation: serverStore.loginState.keyPath,
        passphrase: serverStore.loginState.passphrase,
        signal: signal,
      });

      if (signal.aborted) {
        serverStore.isServerAnimationActive = false;
        serverStore.connectingProcess = false;
        return;
      }

      const res = await ControlService.checkStereumInstallation();
      const routePath = res ? "/node" : "/welcome";

      if (serverStore.connectingProcess) {
        router.push(routePath).then(() => location.reload());
      } else {
        router.push(routePath);
      }
    } catch (error) {
      console.error("Login failed:", error);
      serverStore.isServerAnimationActive = false;
      serverStore.errorMsgExists = true;
      serverStore.error = "Failed to connect. Please try again.";

      // Customize the error message based on the error type
      if (error.name === "AbortError") {
        serverStore.error = "Login operation was cancelled.";
        serverStore.isServerAnimationActive = false;
        serverStore.connectingProcess = false;
        return;
      } else if (typeof error === "string" && error.toLowerCase().includes("password")) {
        serverStore.error = "You need to change your password first";
      }

      router.push("/login");
    }
  };

  const add = () => {
    const newConnection = createConnection();
    if (newConnection.name !== "" && newConnection.host !== "" && newConnection.user !== "") {
      const existingConnectionIndex = serverStore.connections.findIndex(
        (connection) => connection.name == serverStore.loginState.hostName
      );

      if (existingConnectionIndex === -1) {
        serverStore.connections.push(newConnection);
      } else {
        serverStore.connections[existingConnectionIndex] = newConnection;
      }

      serverStore.selectedServerConnection = newConnection;
      serverStore.selectedName = newConnection.name;
      writeSettings();
      serverStore.refreshServers = true;
    } else {
      serverStore.alertBox = true;
      setTimeout(() => {
        serverStore.alertBox = false;
      }, 1500);
    }
  };

  const remove = async () => {
    const storageSavedConnections = await ControlService.readConfig();
    let savedConnections = storageSavedConnections.savedConnections || [];
    const server = serverStore.selectedServerToConnect;

    serverStore.connections = serverStore.connections.filter((conn) => conn?.host !== server?.host);
    savedConnections = savedConnections.filter((conn) => conn?.host !== server?.host);

    const updatedConfig = {
      ...storageSavedConnections,
      savedConnections: savedConnections,
    };
    await ControlService.writeConfig(updatedConfig);

    await loadStoredConnections();

    resetServerStoreLoginState();
  };

  return {
    login,
    add,
    remove,
    loadStoredConnections,
    writeSettings,
    createConnection,
    resetServerStoreLoginState,
    setSelectedConnection,
  };
};
