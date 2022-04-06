import { StringUtils } from "./StringUtils";
export function getServiceConfigs(service, id, others) {
  id = id || {};
  others = others || {};
  let ids = {
    beacon_service: id.beacon_service || "",
    validator_service: id.validator_service || "",
    execution_service: id.execution_service || "",
    prometheus_service: id.prometheus_service || "",
    prometheus_node_exporter_service: id.prometheus_node_exporter_service || "",
    grafana_service: id.grafana_service || "",
    blox_ssv_service: id.blox_ssv_service || ""
  };
  Object.keys(ids).forEach(key => ids[key] = ids[key] || StringUtils.createRandomString())
  return ([
    {
      service: "LighthouseBeaconService",
      id: `${ids.beacon_service}`,
      image: "stereum/lighthouse:v2.1.2-50",
      env: {
        DEBUG_LEVEL: "debug",
        NETWORK: "prater",
        ETH1_NODES: "http://10.10.0.3:8545",
        DATADIR: "/opt/app/beacon",
        SLASHERDIR: "/opt/app/slasher",
        SLASHER_DB_SIZE: "16"
      },
      ports: [
        "0.0.0.0:9000:9000/tcp",
        "0.0.0.0:9000:9000/udp",
        "127.0.0.1:5052:5052/tcp"
      ],
      command: [],
      entrypoint: [
        "/opt/app/start/beacon.sh"
      ],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.beacon_service}/beacon/lighthouse:/opt/app/beacon`,
        `/opt/app/services/${ids.beacon_service}/slasher:/opt/app/slasher`
      ]
    },
    {
      service: "LighthouseValidatorService",
      id: `${ids.validator_service}`,
      image: "stereum/lighthouse:v2.0.1-48",
      env: {
        DEBUG_LEVEL: "info",
        NETWORK: "prater",
        DATADIR: "/opt/app/validator",
        LAUNCHPADDIR: "/opt/app/launchpad",
        GRAFFITI: "stereum.net",
        BEACON_NODES: `http://stereum-${ids.beacon_service}:5052`
      },
      ports: [],
      command: [],
      entrypoint: [
        "/opt/app/start/validator-stereum2.sh"
      ],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.validator_service}/validator:/opt/app/validator`,
        `/opt/app/services/${ids.validator_service}/launchpad:/opt/app/launchpad`,
        "/opt/app/import:/opt/app/import"
      ]
    },

    {
      service: "PrysmBeaconService",
      id: `${ids.beacon_service}`,
      image: "gcr.io/prysmaticlabs/prysm/beacon-chain:v2.0.6",
      ports: [
        "127.0.0.1:4000:4000/tcp",
        "0.0.0.0:12001:12001/udp",
        "0.0.0.0:13001:13001/tcp"
      ],
      env: {},
      entrypoint: [],
      command: `/app/cmd/beacon-chain/beacon-chain\
          --accept-terms-of-use=true\
          --datadir=/opt/app/beacon\
          --p2p-host-ip=""\
          --p2p-host-dns=""\
          --rpc-host=0.0.0.0\
          --rpc-port=4000\
          --monitoring-host=0.0.0.0\
          --grpc-gateway-host=0.0.0.0\
          --grpc-gateway-port=3500\
          --p2p-max-peers=100\
          --http-web3provider=http://10.10.0.3:8545\
          --prater=true\
          --fallback-web3provider=[]\
          --block-batch-limit=512\
          --p2p-udp-port=12001\
          --p2p-tcp-port=13001\
          --genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz`,
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.beacon_service}/prysm/beacon:/opt/app/beacon`,
        `/opt/app/services/${ids.beacon_service}/genesis:/opt/app/genesis`
      ]
    },
    {
      service: "PrysmValidatorService",
      id: `${ids.validator_service}`,
      image: "gcr.io/prysmaticlabs/prysm/validator:v2.0.4",
      ports: [
        "127.0.0.1:7500:7500/tcp"
      ],
      env: {},
      entrypoint: [
        "/app/cmd/validator/validator"
      ],
      command: [
        "--accept-terms-of-use=true",
        "--beacon-rpc-provider=beacon:4000",
        "--monitoring-host=0.0.0.0",
        "--grpc-gateway-host=0.0.0.0",
        "--web=true",
        "--datadir=/opt/app/data/db",
        "--wallet-dir=/opt/app/data/wallets",
        "--wallet-password-file=/opt/app/data/passwords/wallet-password",
        "--prater=true"
      ],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.validator_service}/data/db:/opt/app/data/db`,
        `/opt/app/services/${ids.validator_service}/data/wallets:/opt/app/data/wallets`,
        `/opt/app/services/${ids.validator_service}/data/passwords:/opt/app/data/passwords`,
        `/opt/app/services/${ids.validator_service}/launchpad:/opt/app/launchpad`,
        "/opt/app/import:/opt/app/import"
      ]

    },
    {
      service: "NimbusBeaconService",
      id: `${ids.beacon_service}`,
      image: "stereum/nimbus:v1.6.0-55",
      ports: [
        "0.0.0.0:9000:9000/tcp",
        "0.0.0.0:9000:9000/udp",
        "127.0.0.1:9190:9190/tcp"
      ],
      env: {},
      entrypoint: [
        "/opt/app/build/nimbus_beacon_node"
      ],
      command: [
        "--network=prater",
        "--data-dir=/opt/app/beacon",
        "--validators-dir=/opt/app/validators",
        "--secrets-dir=/opt/app/secrets",
        "--web3-url=ws://10.10.0.6:8545",
        "--tcp-port=9000",
        "--udp-port=9000",
        "--rpc",
        "--rpc-port=9190",
        "--metrics",
        "--metrics-port=8008",
        "--metrics-address=0.0.0.0",
        "--rest",
        "--rest-address=0.0.0.0",
        "--graffiti=\"stereum.net\""
      ],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.beacon_service}/beacon:/opt/app/beacon`,
        `/opt/app/services/${ids.beacon_service}/validator/validators:/opt/app/validators`,
        `/opt/app/services/${ids.beacon_service}/validator/secrets:/opt/app/secrets`,
        `/opt/app/services/${ids.beacon_service}/launchpad:/opt/app/launchpad`,
        "/opt/app/import:/opt/app/import"
      ]
    },
    {
      service: "TekuBeaconService",
      id: `${ids.beacon_service}`,
      image: "consensys/teku:21.12.2",
      ports: [
        "0.0.0.0:9001:9001/tcp",
        "0.0.0.0:9001:9001/udp",
        "127.0.0.1:5051:5051/tcp"
      ],
      env: {
        JAVA_OPTS: "-Xmx3g"
      },
      entrypoint: [
        "/opt/teku/bin/teku"
      ],
      command: [
        "--network=prater",
        "--p2p-enabled=true",
        "--p2p-port=9001",
        "--validator-keys=/opt/app/launchpad:/opt/app/launchpad",
        "--validators-keystore-locking-enabled=false",
        "--validators-graffiti=\"stereum.net\"",
        "--eth1-endpoint=MyEth1EndPoint",
        "--metrics-enabled=true",
        "--metrics-categories=BEACON,LIBP2P,NETWORK,PROCESS",
        "--metrics-port=8008",
        "--metrics-interface=0.0.0.0",
        "--metrics-host-allowlist=\"*\"",
        "--data-path=/opt/app/data",
        "--data-storage-mode=archive",
        "--rest-api-port=5051",
        "--rest-api-host-allowlist=\"*\"",
        "--rest-api-interface=0.0.0.0",
        "--rest-api-docs-enabled=true",
        "--rest-api-enabled=true",
        "--log-destination=CONSOLE"
      ],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.beacon_service}/launchpad:/opt/app/launchpad`,
        `/opt/app/services/${ids.beacon_service}/data:/opt/app/data`
      ]
    },
    {
      service: "GethService",
      name: "geth",
      id: `${ids.execution_service}`,
      image: "ethereum/client-go:v1.10.11",
      ports: [
        "0.0.0.0:30303:30303/tcp",
        "0.0.0.0:30303:30303/udp"
      ],
      env: {
        STEREUM_DUMMY: "foobar"
      },
      entrypoint: [],
      command: "geth --goerli --http --http.port=8545 --http.addr=0.0.0.0 --http.vhosts='*' --allow-insecure-unlock --http.api='db,eth,net,web3,personal'",
      user: "root",
      volumes: [
        `/opt/app/services/${ids.execution_service}:/root/.ethereum`
      ],
    },
    {
      service: "PrometheusService",
      id: `${ids.prometheus_service}`,
      image: "prom/prometheus:v2.33.1",
      ports: [
        "127.0.0.1:9090:9090/tcp"
      ],
      env: {
        CONFIG: `global:\n  scrape_interval:     15s\n  evaluation_interval: 15s\n\nalerting:\n  alertmanagers:\n  - static_configs:\n    - targets:\n      # - alertmanager:9093\n\nrule_files:\n  # - \"first_rules.yml\"\n  # - \"second_rules.yml\"\n\nscrape_configs:\n  - job_name: 'stereum-${ids.beacon_service}'\n    static_configs:\n      - targets: ['stereum-${ids.beacon_service}:5054']\n  - job_name: 'stereum-${ids.prometheus_node_exporter_service}'\n    static_configs:\n      - targets: ['stereum-${ids.prometheus_node_exporter_service}:9100']\n`
      },
      command: "sh -c \"touch /etc/prometheus/prometheus.yml && echo \\\"$CONFIG\\\" > /etc/prometheus/prometheus.yml && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml\"",
      entrypoint: [],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.prometheus_service}/data/prometheus:/prometheus`,
        `/opt/app/services/${ids.prometheus_service}/config:/etc/prometheus`
      ]
    },
    {
      service: "PrometheusNodeExporterService",
      id: `${ids.prometheus_node_exporter_service}`,
      image: "prom/node-exporter:v1.3.1",
      ports: [],
      env: {},
      command: [],
      entrypoint: [
        "/bin/node_exporter"
      ],
      user: "2000",
      volumes: []
    },
    {
      service: "GrafanaService",
      id: `${ids.grafana_service}`,
      image: "grafana/grafana:8.4.0",
      ports: [
        "127.0.0.1:3000:3000/tcp"
      ],
      env: {
        "GRAFANA_INI": "[auth.anonymous]\nenabled = true\norg_role = Admin\n",
        "GRAFANA_PROVISIONING": `${others.grafana_provisioning}`
      },
      command: "bash -c \"touch /etc/grafana/grafana.ini && echo \\\"$GRAFANA_INI\\\" > /etc/grafana/grafana.ini && /run.sh\"",
      entrypoint: [],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.grafana_service}/grafana/provisioning:/etc/grafana/provisioning`,
        `/opt/app/services/${ids.grafana_service}/grafana/data:/var/lib/grafana`,
        `/opt/app/services/${ids.grafana_service}/grafana:/etc/grafana`
      ]
    },
    {
      service: "BloxSSVService",
      id: `${ids.blox_ssv_service}`,
      image: "bloxstaking/ssv-node:latest-ubuntu",
      ports: [
        "0.0.0.0:12000:12000/udp",
        "0.0.0.0:13000:13000/tcp"
      ],
      env: {
        "CONFIG_PATH": "/data/config.yaml",
        "CONFIG": `eth2:\n  Network: \"prater\"\n  BeaconNodeAddr: \"http://stereum-${ids.beacon_service}:5051\"\neth1:\n  ETH1Addr: \"ws://10.10.0.2:8545\"\n  RegistryContractAddr: \"0x687fb596F3892904F879118e2113e1EEe8746C2E\"\nOperatorPrivateKey: \"\"\nglobal:\n  LogLevel: \"debug\"\nMetricsAPIPort: 15000\n`
      },
      command: "bash -c \"touch /data/config.yaml && echo \\\"$CONFIG\\\" > /data/config.yaml && make BUILD_PATH=/go/bin/ssvnode start-node && docker logs ssv_node\"",
      entrypoint: [],
      user: "2000",
      volumes: [
        `/opt/app/services/${ids.blox_ssv_service}/data/blox/ssv:/data`
      ]
    },
  ].find(element => element.service === service))
}

