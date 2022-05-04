<template>
  <div class="container-fluid">
    <div class="row justify-content-center mt-0">
        <div class="col-11 col-sm-9 col-md-7 col-lg-6 text-center p-0 mt-3 mb-2">
            <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                <h2><strong>Go Stereum!</strong></h2>
                <p>Please enter the required parameters</p>
                <div class="row">
                    <div class="col-md-12 mx-0">
                        <div id="msform">
                            <fieldset>
                                <div class="form-card">
                                    <h2 class="fs-title">Connection Information</h2>
                                    <input type="text" name="host" v-model="model.host" placeholder="IP or Hostname" />
                                    <input type="text" name="user" v-model="model.user" placeholder="Username" />
                                    <b-form-checkbox v-model="model.sshKeyAuth" name="check-button" switch>
                                        Use SSH key authentication
                                    </b-form-checkbox>
                                    <input type="password" name="user" v-model="model.password" placeholder="Password" v-if="model.sshKeyAuth == false" />
                                    <input type="text" name="sshKeyAuthFile" v-model="model.keyfileLocation" placeholder="Keyfile Location" v-if="model.sshKeyAuth" />
                                    <input type="text" name="stereum-release" v-model="model.stereumRelease"  placeholder="Stereum Release" />
                                </div>
                                <div class="col-md-6">
                                  <button @click="connect" class="btn btn-xl btn-primary">Start Setup</button>
                                </div>
                                <ul class="list-unstyled">
                                    <li v-for="tunnel in tunnels" :key="tunnel.name">
                                            <a :href="`http://localhost:${tunnel.localPort}/`">{{ tunnel.name }}</a>
                                    </li>
                                </ul>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import ControlService from '@/store/ControlService'

export default {
  name: 'InstallationParameters',
  data () {
    return {
      stereumVersions: {},
      tunnels: []
    }
  },
  props: {
    model: Object
  },
  methods: {
    async connect (e) {
      this.tunnels = [{ name: 'web-cc', localPort: 9081, dstPort: 8000 }]
      try {
        await ControlService.connect(this.model)
      } catch (ex) {
        console.log(ex)
        this.$toasted.show('Error connecting to server! Level: ' + ex.level + ' Message: ' + ex.message)
        return
      }

      const stereumStatus = await ControlService.inquire(this.model)

      if (!stereumStatus.exists) { await ControlService.setup(stereumStatus.latestRelease) } else {
        this.$toasted.show('Multiple Stereum Versions found!')
        this.stereumVersions = stereumStatus
      }

      await ControlService.openTunnels(this.tunnels)
      await ControlService.disconnect()
      e.preventDefault()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#msform {
    text-align: center;
    position: relative;
    margin-top: 20px
}

#msform fieldset .form-card {
    background: white;
    border: 0 none;
    border-radius: 0px;
    padding: 20px 40px 30px 40px;
    box-sizing: border-box;
    width: 94%;
    margin: 0 3% 20px 3%;
    position: relative
}

#msform fieldset {
    background: white;
    border: 0 none;
    border-radius: 0.5rem;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding-bottom: 20px;
    position: relative
}

#msform fieldset:not(:first-of-type) {
    display: none
}

#msform fieldset .form-card {
    text-align: left;
    color: #9E9E9E
}

#msform input,
#msform textarea {
    padding: 0px 8px 4px 8px;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0px;
    margin-bottom: 25px;
    margin-top: 2px;
    width: 100%;
    box-sizing: border-box;
    color: #2C3E50;
    font-size: 16px;
    letter-spacing: 1px
}

#msform input:focus,
#msform textarea:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: none;
    font-weight: bold;
    border-bottom: 2px solid skyblue;
    outline-width: 0
}

#msform .action-button {
    width: 100px;
    background: skyblue;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px
}

#msform .action-button:hover,
#msform .action-button:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 3px skyblue
}

#msform .action-button-previous {
    width: 100px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px
}

#msform .action-button-previous:hover,
#msform .action-button-previous:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #616161
}

select.list-dt {
    border: none;
    outline: 0;
    border-bottom: 1px solid #ccc;
    padding: 2px 5px 3px 5px;
    margin: 2px
}

select.list-dt:focus {
    border-bottom: 2px solid skyblue
}

.card {
    z-index: 0;
    border: none;
    border-radius: 0.5rem;
    position: relative
}

.fs-title {
    font-size: 25px;
    color: #2C3E50;
    margin-bottom: 10px;
    font-weight: bold;
    text-align: left
}

#progressbar {
    margin-bottom: 30px;
    overflow: hidden;
    color: lightgrey
}

#progressbar .active {
    color: #000000
}

#progressbar li {
    list-style-type: none;
    font-size: 12px;
    width: 25%;
    float: left;
    position: relative
}

#progressbar #account:before {
    content: "\f023"
}

#progressbar #personal:before {
    content: "\f007"
}

#progressbar #payment:before {
    content: "\f09d"
}

#progressbar #confirm:before {
    content: "\f00c"
}

#progressbar li:before {
    width: 50px;
    height: 50px;
    line-height: 45px;
    display: block;
    font-size: 18px;
    color: #ffffff;
    background: lightgray;
    border-radius: 50%;
    margin: 0 auto 10px auto;
    padding: 2px
}

#progressbar li:after {
    content: '';
    width: 100%;
    height: 2px;
    background: lightgray;
    position: absolute;
    left: 0;
    top: 25px;
    z-index: -1
}

#progressbar li.active:before,
#progressbar li.active:after {
    background: skyblue
}

.radio-group {
    position: relative;
    margin-bottom: 25px
}

.radio {
    display: inline-block;
    width: 204;
    height: 104;
    border-radius: 0;
    background: lightblue;
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    cursor: pointer;
    margin: 8px 2px
}

.radio:hover {
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3)
}

.radio.selected {
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1)
}

.fit-image {
    width: 100%;
    object-fit: cover
}
</style>
