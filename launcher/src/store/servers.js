import { defineStore } from "pinia";

export const useServers = defineStore("servers", {
  state: () => {
    return {
      isServerAccessManagementActive: false,
      isServerLoginActive: false,
      isServerManagementActive: true,
      selectedServerToConnect: null,
      selectedAvatar: null,
      newPassword: "",
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
      servers: [
        {
          name: "Stereum Server",
          ip: "115.35.01.65",
          port: "25565",
          isConnected: false,
          isSelected: false,
          icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          name: "Hetzner Server",
          ip: "115.35.01.65",
          port: "25565",
          isConnected: false,
          isSelected: false,
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

    setNewPassword(server) {
      this.servers.forEach((s) => {
        if (s.name === server.name) {
          s.password = this.newPassword;
        }
      });
    },
  },
});
