import { defineStore } from "pinia";

export const useServers = defineStore("servers", {
  state: () => {
    return {
      isServerAccessManagementActive: false,
      isServerLoginActive: false,
      isServerManagementActive: true,
      selectedServerToConnect: null,

      servers: [
        {
          name: "Stereum Server",
          ip: "115.35.01.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Hetzner Server",
          ip: "115.35.01.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Google Server",
          ip: "115.35.01.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "AWS Server",
          ip: "101.1.321.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Digital Ocean Server",
          ip: "201.1.321.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Linode Server",
          ip: "301.1.321.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Vultr Server",
          ip: "401.1.321.65",
          port: "25565",
          isConnected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      ],
    };
  },
  actions: {
    setServerConnection() {
      this.servers.forEach((server) => {
        if (server.name !== this.selectedServerToConnect.name) {
          server.isConnected = false;
        }
        server.isConnected = true;
      });
    },

    setServerDisconnection() {
      this.servers.forEach((server) => {
        if (server.name === this.selectedServerToConnect.name) {
          server.isConnected = false;
        }
      });
    },
  },
});
