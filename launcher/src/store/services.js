import { defineStore } from "pinia";
export const useServices = defineStore("services", {
  state: () => {
    return {
      network: "",
      installedServices: [],
      runningServices: [],
      allServices: [
        {
          id: 1,
          name: "Lighthouse",
          service: "LighthouseBeaconService",
          category: "consensus",
          displayCategory: "csc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/lighthouse",
          icon: require("../../public/img/icon/plugin-icons/consensus/LightHouse.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Lighthouse-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: "1656923564922971207",
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 2,
          name: "Lighthouse",
          service: "LighthouseValidatorService",
          category: "validator",
          displayCategory: "vlc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/lighthouse",
          icon: require("../../public/img/icon/plugin-icons/validator/lighthouse-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Lighthouse-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 3,
          name: "Prysm",
          service: "PrysmBeaconService",
          category: "consensus",
          displayCategory: "csc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/prysm",
          icon: require("../../public/img/icon/plugin-icons/consensus/Prysm.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Prysm-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 4,
          name: "Prysm",
          service: "PrysmValidatorService",
          category: "validator",
          displayCategory: "vlc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/prysm",
          icon: require("../../public/img/icon/plugin-icons/validator/prysm-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Prysm-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 5,
          name: "Nimbus",
          service: "NimbusBeaconService",
          category: "consensus",
          displayCategory: "csc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/nimbus",
          icon: require("../../public/img/icon/plugin-icons/consensus/Nimbus.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Nimbus-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 6,
          name: "Nimbus",
          service: "NimbusValidatorService",
          category: "validator",
          displayCategory: "vlc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/nimbus",
          icon: require("../../public/img/icon/plugin-icons/validator/nimbus-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Nimbus-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 7,
          name: "Teku",
          service: "TekuBeaconService",
          category: "consensus",
          displayCategory: "csc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/teku",
          icon: require("../../public/img/icon/plugin-icons/consensus/Teku.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Teku-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "ram",
              value: [2, 4, 8, 16, 24],
            },
            {
              name: "expert mode",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 8,
          name: "Teku",
          service: "TekuValidatorService",
          category: "validator",
          displayCategory: "vlc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/teku",
          icon: require("../../public/img/icon/plugin-icons/validator/Teku.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Teku-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "ram",
              value: [2, 4, 8, 16, 24],
            },
            {
              name: "expert mode",
              type:"select",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 9,
          name: "Blox-SSV",
          service: "BloxSSVService",
          category: "validator",
          displayCategory: "vlc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/blox-ssv",
          icon: require("../../public/img/icon/plugin-icons/Other/blox-ssv.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Blox-ssv-s.png"),
          hIcon: "/img/icon/service-icons/ssv.png",
          linkUrl: "https://stereum.net",
          headerOption: true,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 10,
          name: "Prometheus",
          service: "PrometheusService",
          category: "service",
          displayPluginMenu: false,
          path: "/prometheus",
          icon: require("../../public/img/icon/plugin-icons/Other/prometheus.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Prometheus-s.png"),
          hIcon: "/img/icon/service-icons/prometheus.png",
          linkUrl: "https://stereum.net",
          headerOption: true,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          tunnelLink: true,
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 11,
          name: "Grafana",
          service: "GrafanaService",
          displayPluginMenu: false,
          category: "service",
          path: "/grafana",
          icon: require("../../public/img/icon/plugin-icons/Other/grafana-service.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Grafana-s.png"),
          hIcon: "/img/icon/service-icons/grafana.png",
          linkUrl: "https://stereum.net",
          headerOption: true,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          tunnelLink: true,
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 12,
          name: "Geth",
          service: "GethService",
          category: "execution",
          displayCategory: "exc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/geth",
          icon: require("../..//public/img/icon/plugin-icons/execution/Geth.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Geth-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 13,
          name: "Besu",
          service: "BesuService",
          category: "execution",
          displayCategory: "exc",
          displayTooltip: false,
          displayPluginMenu: false,
          path: "/besu",
          icon: require("../..//public/img/icon/plugin-icons/execution/hyperLedger-besu.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/HyperLedger-besu-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
        {
          id: 14,
          name: "Nethermind",
          service: "NethermindService",
          category: "execution",
          displayTooltip: false,
          displayPluginMenu: false,
          displayCategory: "exc",
          path: "/nethermind",
          icon: require("../..//public/img/icon/plugin-icons/execution/Nethermind.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Nethermind-s.png"),
          headerOption: false,
          expertOptionsModal: false,
          expertOptions: [
            {
              name: "ram",
              value: [2, 4, 8, 16, 24],
            },
            {
              name: "expert",
              value: {
                TIME: 1656923564922971207,
                PLAYBOOK:
                  "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
                TASK: " List validator using API",
                ACTION: " community.docker.docker_container",
                CATEGORY: "OK",
                DATA: {
                  changed: true,
                  status: 0,
                  container: {
                    Id: "15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3",
                    Created: "2022-07-04T08:32:44.072115929Z",
                    Path: "/entrypoint.sh",
                  },
                  GraphDriver: {
                    Data: {
                      LowerDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958-init/diff:/var/lib/docker/overlay2/44a92caffc804df2a90433b4a4a47b8dbd81f0aa50944f6640b5153584657641/diff:/var/lib/docker/overlay2/24bf29ac3db22581bd152b78c4930078c16897a91dd45de22b61ff0d5865cf2f/diff:/var/lib/docker/overlay2/4b295a9e38d0b10770847bd18a89f6ad1ad111d787c474e6dface2f3590fa838/diff:/var/lib/docker/overlay2/a994dbb0b8a4ec860cb59722a532dd37837c567aca8aca69c2cc3c5bba6c3755/diff:/var/lib/docker/overlay2/514422f31891892381e54a0681591e539ef7ab9ea0287f843be19cfd553d36dd/diff:/var/lib/docker/overlay2/1641daaa31e8b0a18fe6f911087949357f02b0a9e2f30f380e77a6fe40edc9bd/diff:/var/lib/docker/overlay2/60af7ea3f7d608205d242b9ad609213d945fe7cbc7008f0f1f511ceb93cec529/diff:/var/lib/docker/overlay2/e6463ce7caa8baeba60a4f02ca04495de350d6136a2bc88a855e33e68658efac/diff:/var/lib/docker/overlay2/7ede53fc5b724dee75099ad4e83fb1daf97c1ebc6c13b0e5ea5098aad9589e7f/diff:/var/lib/docker/overlay2/255291aa43a72ac2b3fd1ff61c640bfb973c280f3f10e32053d8a29d6ed6d1c2/diff:/var/lib/docker/overlay2/ea2e9985236fa421d4dff475a1db7aae5275592f0e879c7ced9ff0a4868745da/diff:/var/lib/docker/overlay2/4e39cb2a1d6a992103cb66db8e02514d4334fc5963646e309a8eb867bc11ceb9/diff",
                      MergedDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/merged",
                      UpperDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/diff",
                      WorkDir:
                        "/var/lib/docker/overlay2/e6f52837cbb03af15c2a9ecc8c5afacbcb020a861af9ee95bf4cebfa84b79958/work",
                    },
                    Name: "overlay2",
                  },
                  Mounts: [],
                  Output: '{"data":[]}',
                },
              },
            },
          ],
          drag: true,
          state: "exited",
          config: {
            serviceID: "",
            configVersion: "",
            image: "",
            imageVersion: "",
            ports: [],
            volumes: [],
            network: "",
          },
        },
      ],
      versions: {},
      stereumVersion: {},
      newUpdates: [
        { name: "teku", version: "2.2.0" },
        { name: "geth", version: "1.2.0" },
        { name: "grafana", version: "3.2.1" },
      ],
    };
  },
  getters: {},
  actions: {},
});
