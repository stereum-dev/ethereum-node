<template>
  <background-page>
    <div class="plugin-modal-parent">
      <div class="plugin-modal space-y-2">
        <div class="titleBox">
          <span>CONFIG IMPORT</span>
        </div>
        <div class="content-box shadow-md shadow-gray-700">
          <div class="description">
            <p>
              With this installation option you are able to import a used Stereum config file to replicate your node
              setup.
            </p>
          </div>
          <div class="uploadBox">
            <div class="uploadBox__title">
              <span>SELECT A STEREUM CONFIG FILE TO UPLOAD IT</span>
            </div>
            <div class="uploadBox__content">
              <div class="uploadBox__content__file">
                <label class="w-full block mb-2 text-xs text-left font-medium text-slate-100" for="file_input">
                  <span class="ml-2">Config file</span>
                  <div class="input">
                    <input class="hidden" id="file_input" type="file" @change="uploadFile" accept="application/json" />
                    <img src="../../../../public/img/icon/PLUS_ICON.png" alt="icon" />
                    <span class="ml-5 text-gray-600 overflow-hidden"> {{ file ? file.name : "Select a file" }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="confirmBox">
            <p v-show="uploadConfirmed" class="text-sm text-green-400 font-semibold mt-0">
              Stereum config recognized.Press install to continue.
            </p>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <router-link :to="{ path: '/welcome' }">
          <button class="back-btn">{{ $t("pluginName.back") }}</button>
        </router-link>
        <router-link :to="{ path: '/welcome' }">
          <button @click="runInstalltion" class="next-btn">INSTALL</button>
        </router-link>
      </div>
    </div>
  </background-page>
</template>

<script>
export default {
  name: "UploadConfig",
  data() {
    return {
      file: null,
      fileType: ["config.json", "config.json.bak", "config.json.bak2", "config.json.bak3"],
      uploadConfirmed: false,
    };
  },
  methods: {
    // uploadFile(event) {
    //   this.file = event.target.files[0];
    //   if (!this.keyFiles.includes(this.file["name"]) && this.file["type"] === "application/json") {
    //   }
    // },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.plugin-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

.plugin-modal-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  z-index: 2;
}
.plugin-modal {
  width: 60%;
  height: 75%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.titleBox {
  width: 95%;
  height: 18%;
  margin-top: 5px;
  background-color: #2d3134;
  border: 4px solid #dcdcdc;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}

.titleBox span {
  font-size: 2rem;
  font-weight: 800;
  color: #d7d7d7;
  text-transform: uppercase;
}

.content-box {
  width: 95%;
  height: 70%;
  background-color: #2d3134;
  border: 4px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  padding-bottom: 5px;
  border-radius: 20px;
}

.description {
  width: 100%;
  height: 30%;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.description p {
  font-size: 1rem;
  font-weight: 600;
  color: #d7d7d7;
  text-align: left;
}

.uploadBox {
  width: 100%;
  height: 65%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.uploadBox__title {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: start;
  align-items: center;
}

.uploadBox__title span {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  color: #d7d7d7;
  text-align: left;
}

.uploadBox__content {
  width: 100%;
  height: 60%;
  background-color: #191919;
  border: 3px solid gray;
  border-radius: 20px;
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.uploadBox__content__file {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #336666;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uploadBox__content__file label {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

.uploadBox__content__file label .input {
  width: 100%;
  height: 50%;
  border-radius: 50px 10px 10px 50px;
  background-color: #cacaca;
  padding: 5px;
  padding-left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.uploadBox__content__file label .input img {
  width: 28px;
  margin-left: 1px;
}

.confirmBox {
  width: 100%;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box {
  width: 98%;
  height: 12%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.btn-box a {
  width: 25%;
  height: 60%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #eaeaea;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px #353e39;
  outline-style: none;
  cursor: pointer;
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}
.next-btn:active,
.back-btn:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}
</style>
