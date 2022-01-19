<template>
  <div class="container text-left">
    <h3>Connecting to your server</h3>

    <div class="row">
      <div class="col-9 pt-2 pb-2">
        <b-form-select id="saved-connections" v-model="selectedConnection" :options="savedConnections"></b-form-select>
        <b-tooltip target="saved-connections" triggers="hover">Saved connections</b-tooltip>
      </div>
      <div class="col-3 pt-2 pb-2">
        <b-button
          id="remove-connection"
          size="sm"
          @click="removeItem"
          variant="danger"
          class="mb-2 mr-sm-2 mb-sm-0 mt-1"
        >
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-button>
        <b-tooltip target="remove-connection" triggers="hover">Delete selected connection</b-tooltip>
        <b-button
          id="add-connection"
          size="sm"
          @click="addItem"
          variant="primary"
          class="mb-2 mr-sm-2 mb-sm-0 mt-1"
        >
          <b-icon icon="plus" aria-hidden="true" title=""></b-icon>
        </b-button>
        <b-tooltip target="add-connection" triggers="hover">Add currenct connection as new connection (password won't get stored)</b-tooltip>
      </div>
    </div>

    <div class="row">
      <div class="col-10 pt-2 pb-2">
        <b-form-input id="host" v-model="model.host" placeholder="IP or Hostname"></b-form-input>
        <b-tooltip target="host" triggers="hover">IP or Hostname</b-tooltip>
      </div>
      <div class="col-2 pt-2 pb-2">
        <b-form-input id="port" v-model="model.port" placeholder="Port (default 22)"></b-form-input>
        <b-tooltip target="port" triggers="hover">SSH Port (default 22)</b-tooltip>
      </div>
    </div>
    <div class="row">
      <div class="col-12 pt-2 pb-2">
        <b-form-input id="user" v-model="model.user" placeholder="Username"></b-form-input>
        <b-tooltip target="user" triggers="hover">Username</b-tooltip>
      </div>
    </div>
    <div class="row">
        <div class="col-12 pt-2 pb-2">
          <b-form-checkbox v-model="model.sshKeyAuth" name="check-button" switch>
                Use SSH key authentication
          </b-form-checkbox>
        </div>
    </div>
    <div class="row" v-if="model.sshKeyAuth == false">
        <div class="col-12 pt-2 pb-2">
          <b-form-input type="password" name="user" v-model="model.password" placeholder="Password" />
        </div>
    </div>
    <div class="row" v-if="model.sshKeyAuth">
        <div class="col-12 pt-2 pb-2">
          <b-form-input type="text" name="sshKeyAuthFile" v-model="model.keyfileLocation" placeholder="Keyfile Location" />
        </div>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";

export default {
  name: "ConnectionTab",
  components: {

  },
  data() {
    const unselectedConnection = {
          value: null,
          text: "-- none --",
        };

    return {
      selectedConnection: unselectedConnection.value,
      unselectedConnection: unselectedConnection,
      savedConnections: [unselectedConnection],
      selectionInProgress: false,
    };
  },
  props: {
    model: Object,
  },
  watch: {
    "selectedConnection": function() {
      if (!this.selectionInProgress && this.selectedConnection !== this.unselectedConnection.value) {
        this.selectionInProgress = true;

        this.model.host = this.selectedConnection.host;
        this.model.user = this.selectedConnection.user;
        this.model.keyfileLocation = this.selectedConnection.keyfileLocation;
        this.model.sshKeyAuth = this.selectedConnection.sshKeyAuth;
        this.model.port = this.selectedConnection.port;

        this.selectionInProgress = false;
      }
    },
  },
  created() {
    this.loadStoredConnections();
  },
  methods: {
    removeItem() {
      console.log("selected: ");
      console.log(this.selectedConnection);

      if (this.selectedConnection !== this.unselectedConnection.value) {
        this.selectionInProgress = true;

        const selectedConn = this.selectedConnection;

        this.savedConnections = this.savedConnections.filter(function(conn) {
          console.log("conn: ");
          console.log(conn);
          return selectedConn != conn.value;
        });

        this.selectedConnection = this.unselectedConnection.value;

        this.selectionInProgress = false;

        ControlService.writeConfig({ savedConnections: this.storableConnections() });
      }

      this.model.host = "";
      this.model.user = "";
      this.model.keyfileLocation = "";
      this.model.sshKeyAuth = false;
      this.model.port = 22;
    },
    addItem() {
      this.selectionInProgress = true;

      const newConn = this.createConnectionModel(this.model.host, this.model.port, this.model.user, this.model.sshKeyAuth, this.model.keyfileLocation);

      this.savedConnections.push({
        value: newConn,
        text: newConn.host + " (" + newConn.user + ")",
      });

      this.selectedConnection = newConn;

      this.selectionInProgress = false;

      ControlService.writeConfig({ savedConnections: this.storableConnections() });
    },

    createConnectionModel(host, port, user, sshKeyAuth, keyfileLocation) {
      return {
        host: host,
        port: port,
        user: user,
        sshKeyAuth: sshKeyAuth,
        keyfileLocation: keyfileLocation,
      };
    },

    storableConnections() {
      return this.savedConnections.filter(function(conn) {
          return conn.value != null;
      });
    },

    loadStoredConnections: async function() {
      const storageSavedConnections = await ControlService.readConfig();

      console.log(storageSavedConnections);

      let savedConnections = [this.unselectedConnection];

      if (storageSavedConnections !== undefined && storageSavedConnections.savedConnections !== undefined) {
        savedConnections = savedConnections.concat(storageSavedConnections.savedConnections);
      }

      console.log(savedConnections);

      this.savedConnections = savedConnections;
    },
  }
};
</script>

<style scoped></style>
