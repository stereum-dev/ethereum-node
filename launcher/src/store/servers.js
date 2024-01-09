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
        {
          name: "Centos",
          img: "/avatar/centos.png",
        },
        {
          name: "Debian",
          img: "/avatar/debian.png",
        },
        {
          name: "Ubuntu",
          img: "/avatar/ubuntu.png",
        },
        {
          name: "Linux",
          img: "/avatar/linux.png",
        },
        {
          name: "Fedora",
          img: "/avatar/fedora.png",
        },
        {
          name: "Lion",
          img: "/avatar/lion.png",
        },
        {
          name: "Panda",
          img: "/avatar/panda.png",
        },
        {
          name: "Dog",
          img: "/avatar/dog.png",
        },
        {
          name: "Dog-1",
          img: "/avatar/dog-1.png",
        },
        {
          name: "Dog-2",
          img: "/avatar/dog-2.png",
        },
        {
          name: "Footprint",
          img: "/avatar/footprint.png",
        },
        {
          name: "Dog-2",
          img: "/avatar/dog-2.png",
        },
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
