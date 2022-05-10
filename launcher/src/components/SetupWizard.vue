<template>
  <div>
    <!-- <b-card
      img-src="setup-banner.png"
      img-top
      tag="article"
      style="max-width: 20rem"
      class="mb-2 main-card"
    >
      <b-card-body>
        <div>
          <form-wizard
            shape="square"
            color="#336666"
            title="Stereum Ethereum Node Setup Launcher"
            subtitle="Connect to your node"
            finishButtonText="Go!"
            @on-complete="onComplete"
            :hide-buttons="installationRunning || installationSuccess"
          >
            <tab-content title="Connection" icon="faw fas fa-network-wired" :before-change="() => fetchReleases()">
              <connection-tab :model="model"></connection-tab>
            </tab-content>
            <tab-content title="Release" icon="faw fas fa-cogs">
              <release-tab
                :releases="releases"
                :model="model"
                :logs="logs.tasks"
                :progress="installationProgress"
                :running="installationRunning"
                :success="installationSuccess"
                :done="installationDone"></release-tab>
            </tab-content>
          </form-wizard>
        </div>
      </b-card-body>
    </b-card> -->
  </div>
</template>

<script>
// local registration
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import ConnectionTab from '@/components/wizard/ConnectionTab.vue'
import ReleaseTab from '@/components/wizard/ReleaseTab.vue'
import ControlService from '@/store/ControlService'

export default {
  name: 'SetupWizard',
  components: {
    FormWizard,
    TabContent,
    ConnectionTab,
    ReleaseTab
  },
  data () {
    return {
      response: '',
      logs: {
        tasks: []
      },
      installationRunning: false,
      installationDone: false,
      installationProgress: 0,
      installationSuccess: undefined,
      releases: [],
      stereumStatus: []
    }
  },
  props: {
    model: Object
  },
  methods: {
    onComplete: async function () {
      this.installationRunning = true
      this.installationProgress = 0

      // write variables for the ansible call
      const extraVars = {
        stereum_version_tag: window.STEREUM_VERSION_TAG
      }
      this.installationDone = false

      if (this.model.stereumRelease != this.stereumStatus.ccwebRelease) {
        // launch setup
        try {
          await ControlService.setup({ stereumRelease: this.model.stereumRelease })
        } catch (ex) {
          console.log(ex)
          this.$toasted.show('Error setting up stereum launcher! Level: ' + ex.level + ' Message: ' + ex.message)
          return
        }
      }

      await ControlService.openTunnels([{ dstPort: 8000, localPort: 8081 }, { dstPort: 3000, localPort: 8082 }, { dstPort: 7500, localPort: 8083 }])

      setTimeout(function () {
        console.log('waited for ssh tunnels to connect')
      }, 1000)

      const apikey = this.genApikey(64)
      await ControlService.setApikey(apikey)

      // wait a bit to get the ssh tunnels fully up
      setTimeout(function () {
        window.location.replace('http://localhost:8081/?apikey=' + apikey)
      }, 1500)
    },
    genApikey: function (length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    fetchReleases: async function () {
      try {
        await ControlService.connect(this.model)
      } catch (ex) {
        console.log(ex)
        this.$toasted.error('Error connecting to server! Level: ' + ex.level + ' Message: ' + ex.message, { duration: 5000 })
        return
      }
      try {
        this.stereumStatus = await ControlService.inquire(this.model)
        this.releases = []
        this.model.stereumRelease = undefined

        // always display latest release
        if (this.stereumStatus.latestRelease) {
          this.releases.push({ text: `${this.stereumStatus.latestRelease} (latest)`, value: this.stereumStatus.latestRelease })
          this.model.stereumRelease = this.stereumStatus.latestRelease
        }

        // always display latest rc release
        if (this.stereumStatus.latestRcRelease) { this.releases.push({ text: `${this.stereumStatus.latestRcRelease} (latest unstable - not recommended!)`, value: this.stereumStatus.latestRcRelease }) }

        // display existing stereum versions when installed/running
        if (this.stereumStatus.exists) {
          if (this.stereumStatus.existingRelease) {
            this.releases.push({ text: `${this.stereumStatus.existingRelease} (installed node)`, value: this.stereumStatus.existingRelease })
            this.model.stereumRelease = this.stereumStatus.existingRelease
          }

          if (this.stereumStatus.ccRelease) {
            this.releases.push({ text: `${this.stereumStatus.ccRelease} (installed control-center)`, value: this.stereumStatus.ccRelease })
            if (this.model.stereumRelease === undefined) {
              this.model.stereumRelease = this.stereumStatus.ccRelease
            }
          }

          if (this.stereumStatus.ccwebRelease) {
            this.releases.push({ text: `${this.stereumStatus.ccwebRelease} (running control-center)`, value: this.stereumStatus.ccwebRelease })
            if (this.model.stereumRelease === undefined) {
              this.model.stereumRelease = this.stereumStatus.ccwebRelease
            }
          }
        }
        return Promise.resolve(true)
      } catch (ex) {
        console.log(ex)
        this.$toasted.error('Error fetching Stereum Versions! Level: ' + ex.level + ' Message: ' + ex.message, { duration: 5000 })
      }
    }
  }
}
</script>

<style scoped>
.main-card {
  margin-top: 10px;
  margin-left: 5%;
  margin-right: 5%;
  min-width: 90%;
}

.main-card img {
  max-height: 50px;
}

.card-body {
  padding: 0.5rem;
}

.vue-form-wizard {
  padding-bottom: 0px;
}

</style>
