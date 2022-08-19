import { NodeConnection } from "./NodeConnection";
import { ServiceManager } from "./ServiceManager";

export class Monitoring {
  constructor() {
    this.nodeConnection = new NodeConnection();
    this.serviceManager = new ServiceManager(this.nodeConnection);
  }

  async checkStereumInstallation(nodeConnection) {
    if (!nodeConnection) {
      nodeConnection = this.nodeConnection;
    }
    if (nodeConnection.sshService.connected) {
      let services;
      let settings;
      try {
        settings = await nodeConnection.sshService.exec("ls /etc/stereum");
        services = await nodeConnection.listServicesConfigurations();
      } catch {
        services = [];
      }
      if (services.length != 0 && settings.stdout.includes("stereum.yaml"))
        return true;
    }
    return false;
  }

  async refreshServiceInfos() {
    if (await this.checkStereumInstallation()) {
      const serviceConfigs = (
        await this.serviceManager.readServiceConfigurations()
      ).filter((s) => s.service != "PrometheusNodeExporterService");
      const serviceStates = await this.nodeConnection.listServices();
      if (
        serviceConfigs &&
        serviceConfigs.length > 0 &&
        serviceStates &&
        Array.isArray(serviceStates)
      ) {
        let newInfo = serviceConfigs.map((config) => {
          const newState = serviceStates.find(
            (state) => state.Names.replace("stereum-", "") === config.id
          );
          return {
            service: config.service,
            state: newState ? newState.State : "exited",
            config: {
              serviceID: config.id,
              configVersion: config.configVersion,
              image: config.image,
              imageVersion: config.imageVersion,
              ports: config.ports,
              volumes: config.volumes,
              network: config.network,
            },
          };
        });
        return newInfo;
      }
    }
    return [];
  }

  async getServerName() {
    const serverName = await this.nodeConnection.sshService.exec("hostname");
    return serverName;
  }

  //serverNmae
  //totalRam, usedRam
  //Total, usedDisk, used%
  //CPUusage
  //rx tx
  //readSpeed writeSpeed
  async getServerVitals() {
    const serverVitals = await this.nodeConnection.sshService.exec(`
        hostname &&
        free --mega | sed -n '2p' | awk '{print $2" "$3}' &&
        df --total -h --exclude-type=overlay | grep ^total | awk '{print $2" "$4" "$5}'
        sar -u 1 1 | awk '{if ($7 != "%idle") print 100.000-$NF}' | tail -1 &&
        INTERFACE=\`ip route get 8.8.8.8 | head -n1 | awk '{print $5}'\` &&
sar -n DEV 1 1 | awk -v var="$INTERFACE" '{ if($2 == var) print $5" "$6}' | sed -n '1p' &&
        rm -rf disks &&
rm -rf diskspeeds &&
rm -rf diskoutput &&
lsblk -d -o NAME | grep -v '[$!loop|NAME|]' | sed '/sr0/d' > disks &&
input="disks" &&
while IFS= read -r line
do
iostat -x | grep "$line" | awk '{print $3" "$9}' >> diskspeeds
done < "$input" &&
linecount=\`wc -l disks | awk '{print $1}'\` &&
counter=1 &&
while [[ $linecount -ge $counter ]]
do
linea=$( head -n $counter disks | tail -1)
lineb=$( head -n $counter diskspeeds | tail -1)
echo "$linea $lineb"
counter=$(($counter + 1))
done &&
rm -rf disks &&
rm -rf diskspeeds &&
rm -rf diskoutput
        `);
    let arr = serverVitals.stdout.split(/\n/);
    const data = {
      ServerName: arr[0],
      totalRam: arr[1].split(" ")[0],
      usedRam: arr[1].split(" ")[1],
      totalDisk: parseInt(arr[2].split(" ")[0]),
      availDisk: parseInt(arr[2].split(" ")[1]),
      usedPerc: arr[2].split(" ")[2],
      cpu: arr[3],
      rx: arr[4].split(" ")[0],
      tx: arr[4].split(" ")[1],
      readValue: arr[5].split(" ")[1],
      writeValue: arr[5].split(" ")[2],
    };
    return data;
  }
}
