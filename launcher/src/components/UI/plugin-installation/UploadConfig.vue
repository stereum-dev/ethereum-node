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
                  <div class="input cursor-pointer">
                    <input
                      id="file_input"
                      ref="fileInput"
                      class="hidden"
                      type="file"
                      accept=".zip"
                      @change="handleFileUpload"
                    />
                    <img src="../../../../public/img/icon/PLUS_ICON.png" alt="icon" />
                    <span class="ml-2 text-xl text-gray-700 overflow-hidden"> {{ fileName }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="confirmBox">
            <p v-if="message" class="h-5 text-sm text-red-400 font-semibold mt-0">{{ message }}</p>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <router-link :to="{ path: '/welcome' }">
          <button class="back-btn">{{ $t("pluginName.back") }}</button> </router-link
        >s
        <router-link :to="{ path: '/welcome' }">
          <button class="next-btn" @click="runImportingConfig">INSTALL</button>
        </router-link>
      </div>
    </div>
  </background-page>
</template>

<script>
import JSZip from "jszip";
import ControlService from "@/store/ControlService";

export default {
  name: "UploadConfig",
  data() {
    return {
      fileName: "",
      isMessageActive: false,
      message: "",
      file: null,
      uploadConfirmed: false,
      compressedContentArray: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      this.isMessageActive = false;
      this.message = "";
      const file = event.target.files[0];
      if (!file) return;

      // Check that the file is a zip file
      if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
        this.isMessageActive = true;
        this.message = "Invalid file type. Please select a .zip file.";
        this.$refs.fileInput.value = "";
        return;
      }

      // Read the contents of the zip file
      const reader = new FileReader();
      reader.onload = () => {
        const zip = JSZip.loadAsync(reader.result);
        zip.then((contents) => {
          // Check that the zip file contains a YAML file
          const yamlFiles = contents.filter((relativePath, file) => {
            return !file.dir && /\.yaml$/i.test(file.name);
          });

          if (yamlFiles.length === 0) {
            this.isMessageActive = true;
            this.message = "The zip file does not contain a .yaml file.";
            this.$refs.fileInput.value = "";
            return;
          }

          yamlFiles.forEach((relativePath) => {
            this.compressedContentArray.push({
              name: relativePath.name,
              content: relativePath._data.compressedContent,
            });
          });

          this.fileName = file.name;
          // Upload the file to the server
          // ...
        });
      };
      reader.readAsArrayBuffer(file);
    },

    runImportingConfig: async function () {
      try {
        console.log(this.compressedContentArray);
        await ControlService.importConfig(JSON.stringify(this.compressedContentArray));
      } catch (error) {
        console.log(error);
      }
    },
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
  padding: 10px;
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
  height: 57%;
  margin-top: 5px;
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
