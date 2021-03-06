import { defineStore } from "pinia";
export const useTaskManager = defineStore("taskManager", {
  state: () => {
    return {
      playbookTasks: [],
      dataTasks: [
        // {
        //   id: 1,
        //   playbook: "Geth",
        //   status: null,
        //   showDropDown: false,
        //   tasks: [
        //     {
        //       name: "Preparing node",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "failed",
        //     },
        //     {
        //       name: "Writing service configs",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //     {
        //       name: "Set firewall rules",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //     {
        //       name: "Enable service docker",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //   ],
        // },
        {
          id: 2,
          playbook: "Nimbus",
          status: null,
          showDropDown: false,
          tasks: [
            {
              name: "Removing conflicts",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Writing service configs",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Set firewall rules",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Install docker",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
          ],
        },
      ],
      taskManagerIcons: {
        progressIcon: require("../../public/img/icon/task-manager-icons/task-manager-icon.png"),
        activeIcon: require("../../public/img/icon/task-manager-icons/task-blue-icon.png"),
        successIcon: require("../../public/img/icon/task-manager-icons/task-green-icon.png"),
        failedIcon: require("../../public/img/icon/task-manager-icons/task-red-icon.png"),
      },
      installIconSrc: {
        activeInstallIcon: require("../../public/img/icon/task-manager-icons/turning_circle.gif"),
        successInstallIcon: require("../../public/img/icon/task-manager-icons/check5.png"),
        failedInstallIcon: require("../../public/img/icon/task-manager-icons/cancel.png"),
      },
      pluginsInstalling: [
        {
          name: "Geth",
          status: "active",
          statusLabel: "TASK ACTIVE",
          subTasks: [
            {
              status: "active",
              statusLabel: "TASK ACTIVE",
              displayTooltip: false,
              showErrorterminal:false,
            },
            {
              status: "success",
              statusLabel: "TASK SUCCEEDED",
              displayTooltip: false,
              showErrorterminal:false,
            },
            {
              status: "failed",
              statusLabel: "TASK FAILED",
              displayTooltip: false,
              showErrorterminal:false,
            },
          ],
        },
        {
          name: "Nimbus",
          status: "success",
          statusLabel: "TASK SUCCEEDED",
          subTasks: [
            {
              status: "success",
              statusLabel: "TASK SUCCEEDED",
              displayTooltip: false,
              showErrorterminal:false,
            },
          ],
        },
        {
          name: "Lighthouse",
          status: "failed",
          statusLabel: "TASK FAILED",
          subTasks: [
            {
              status: "failed",
              statusLabel: "TASK FAILED",
              showTooltip: false,
              showErrorterminal:false,
            },
          ],
        },
      ],
      fakeError: {
        TIME: 1656923564922971207,
        PLAYBOOK: "/opt/stereum/ansible/controls/genericPlaybook.yaml,docker",
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
            Args: [
              "curl",
              "--insecure",
              "https://stereum-ROJsDAys-Awmm-9Ut1-Hn1i-tsLDLT4wybfZ:5052/eth/v1/keystores",
              "-H",
              "Content-Type: application/json",
              "-H",
              "Authorization: Bearer 76b68c1cae9fa5a73555f52878eb0136",
              "-s",
            ],
            State: {
              Status: "exited",
              Running: false,
              Paused: false,
              Restarting: false,
              OOMKilled: false,
              Dead: false,
              Pid: 0,
              ExitCode: 0,
              Error: "",
              StartedAt: "2022-07-04T08:32:44.596033426Z",
              FinishedAt: "2022-07-04T08:32:44.638548667Z",
            },
            Image:
              "sha256:0e88798890db40bbf98a855d740869178056b769690c2d59e0bc42b8fd23e49e",
            ResolvConfPath:
              "/var/lib/docker/containers/15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3/resolv.conf",
            HostnamePath:
              "/var/lib/docker/containers/15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3/hostname",
            HostsPath:
              "/var/lib/docker/containers/15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3/hosts",
            LogPath:
              "/var/lib/docker/containers/15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3/15dbf7ef039d093a802b97269cece5a0365b15da235bb85f710806f32266dbc3-json.log",
            Name: "/validator-list-api-curl",
            RestartCount: 0,
            Driver: "overlay2",
            Platform: "linux",
            MountLabel: "",
            ProcessLabel: "",
            AppArmorProfile: "docker-default",
            ExecIDs: null,
            HostConfig: {
              Binds: [],
              ContainerIDFile: "",
              LogConfig: { Type: "json-file", Config: {} },
              NetworkMode: "stereum",
              PortBindings: null,
              RestartPolicy: { Name: "", MaximumRetryCount: 0 },
              AutoRemove: false,
              VolumeDriver: "",
              VolumesFrom: null,
              CapAdd: null,
              CapDrop: null,
              CgroupnsMode: "private",
              Dns: null,
              DnsOptions: null,
              DnsSearch: null,
              ExtraHosts: null,
              GroupAdd: null,
              IpcMode: "private",
              Cgroup: "",
              Links: null,
              OomScoreAdj: 0,
              PidMode: "",
              Privileged: false,
              PublishAllPorts: false,
              ReadonlyRootfs: false,
              SecurityOpt: null,
              UTSMode: "",
              UsernsMode: "",
              ShmSize: 67108864,
              Runtime: "runc",
              ConsoleSize: [0, 0],
              Isolation: "",
              CpuShares: 0,
              Memory: 0,
              NanoCpus: 0,
              CgroupParent: "",
              BlkioWeight: 0,
              BlkioWeightDevice: null,
              BlkioDeviceReadBps: null,
              BlkioDeviceWriteBps: null,
              BlkioDeviceReadIOps: null,
              BlkioDeviceWriteIOps: null,
              CpuPeriod: 0,
              CpuQuota: 0,
              CpuRealtimePeriod: 0,
              CpuRealtimeRuntime: 0,
              CpusetCpus: "",
              CpusetMems: "",
              Devices: null,
              DeviceCgroupRules: null,
              DeviceRequests: null,
              KernelMemory: 0,
              KernelMemoryTCP: 0,
              MemoryReservation: 0,
              MemorySwap: 0,
              MemorySwappiness: null,
              OomKillDisable: null,
              PidsLimit: null,
              Ulimits: null,
              CpuCount: 0,
              CpuPercent: 0,
              IOMaximumIOps: 0,
              IOMaximumBandwidth: 0,
              MaskedPaths: [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware",
              ],
              ReadonlyPaths: [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger",
              ],
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
            Config: {
              Hostname: "15dbf7ef039d",
              Domainname: "",
              User: "2000",
              AttachStdin: false,
              AttachStdout: true,
              AttachStderr: true,
              Tty: false,
              OpenStdin: false,
              StdinOnce: false,
              Env: [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "CURL_VERSION=7_83_1",
                "CURL_RELEASE_TAG=curl-7_83_1",
                "CURL_GIT_REPO=https://github.com/curl/curl.git",
                "CURL_CA_BUNDLE=/cacert.pem",
              ],
              Cmd: [
                "curl",
                "--insecure",
                "https://stereum-ROJsDAys-Awmm-9Ut1-Hn1i-tsLDLT4wybfZ:5052/eth/v1/keystores",
                "-H",
                "Content-Type: application/json",
                "-H",
                "Authorization: Bearer 76b68c1cae9fa5a73555f52878eb0136",
                "-s",
              ],
              Image: "curlimages/curl:7.83.1",
              Volumes: null,
              WorkingDir: "",
              Entrypoint: ["/entrypoint.sh"],
              OnBuild: null,
              Labels: {
                Maintainer: "James Fuller <jim.fuller@webcomposite.com>",
                Name: "curl",
                Version: "1.0.0",
                "docker.cmd":
                  "docker run -it curl/curl:7.83.1 -s -L http://curl.se",
                "se.haxx.curl": "curl",
                "se.haxx.curl.description": "network utility",
                "se.haxx.curl.release_tag": "curl-7_83_1",
                "se.haxx.curl.version": "7_83_1",
              },
            },
            NetworkSettings: {
              Bridge: "",
              SandboxID:
                "a3e30a39541aa4196c5e097405699c968408d94eadbef7882ca8a6b9b422d009",
              HairpinMode: false,
              LinkLocalIPv6Address: "",
              LinkLocalIPv6PrefixLen: 0,
              Ports: {},
              SandboxKey: "/var/run/docker/netns/a3e30a39541a",
              SecondaryIPAddresses: null,
              SecondaryIPv6Addresses: null,
              EndpointID: "",
              Gateway: "",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAddress: "",
              IPPrefixLen: 0,
              IPv6Gateway: "",
              MacAddress: "",
              Networks: {
                stereum: {
                  IPAMConfig: null,
                  Links: null,
                  Aliases: ["15dbf7ef039d"],
                  NetworkID:
                    "8ff1ef2f7ffe836d0c460dfd080100030a3f7c1082b5a067ae759993f3284be7",
                  EndpointID: "",
                  Gateway: "",
                  IPAddress: "",
                  IPPrefixLen: 0,
                  IPv6Gateway: "",
                  GlobalIPv6Address: "",
                  GlobalIPv6PrefixLen: 0,
                  MacAddress: "",
                  DriverOpts: null,
                },
              },
            },
            Output: '{"data":[]}',
          },
          _ansible_no_log: false,
        },
      },
    };
  },
  getters: {},
  actions: {},
});
