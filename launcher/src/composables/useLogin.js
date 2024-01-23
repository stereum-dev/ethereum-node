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

  const login = async () => {
    const abortController = new AbortController();
    serverStore.connectingAnimActive = true;

    try {
      await ControlService.connect({
        host: serverStore.loginState.ip,
        port: serverStore.loginState.port,
        user: serverStore.loginState.username,
        password: serverStore.loginState.password,
        sshKeyAuth: serverStore.loginState.useAuth,
        keyfileLocation: serverStore.loginState.keyPath,
        passphrase: serverStore.loginState.passphrase,
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) {
        return;
      }
    } catch (err) {
      console.log("err: ", err);
      serverStore.connectingAnimActive = false;
      serverStore.errorMsgExists = true;
      serverStore.error = "Connection refused, please try again.";
      if (typeof err === "string" && new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(err.toLowerCase())) {
        serverStore.error = "You need to change your password first";
      }
      return;
    }

    const res = await ControlService.checkStereumInstallation();
    const routePath = res ? "/node" : "/welcome";

    if (serverStore.connectingProcess) {
      router.push(routePath).then(() => location.reload());
    } else {
      router.push(routePath);
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
