<template>
  <installation-box :title="title" :back="back" :next="next">
    <div class="upload-parent space-y-2">
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
        <div class="messageBox">
          <p v-if="message" class="h-5 text-sm text-red-400 font-semibold mt-0">{{ message }}</p>
        </div>
      </div>
    </div>
  </installation-box>
</template>

<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import JSZip from "jszip";
// import ControlService from "@/store/ControlService";

export default {
  name: "UploadConfig",
  data() {
    return {
      back: "welcome",
      title: "IMPORTING CONFIG",
      next: "importingList",
      fileName: "",
      isMessageActive: false,
      message: "",
      file: null,
      uploadConfirmed: false,
    };
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      unzippedData: "unzippedData",
    }),
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
            this.message = "Invalid file type. Please try again with a valid .zip file.";
            this.$refs.fileInput.value = "";
            return;
          }
          let newYamlFiles = yamlFiles.filter((file) => !file.name.includes("_MACOSX"));

          newYamlFiles.forEach((relativePath) => {
            const pathParts = relativePath.name.split("/");
            const fileName = pathParts.pop();
            // const extractedName = fileName.pop();
            this.unzippedData.push({
              name: fileName.split(".")[0],
              content: relativePath._data.compressedContent,
            });
          });
          console.log(this.unzippedData);

          this.fileName = file.name;
          // Upload the file to the server
          // ...
        });
      };
      reader.readAsArrayBuffer(file);
    },

    runImportingConfig: async function () {
      console.log(JSON.stringify(this.configZipData));
      this.$router.push({ path: "/importingList" });
      // try {
      //   console.log(JSON.stringify(this.configZipData));
      //   this.$router.push({ path: "/importingList" });
      //   // await ControlService.importConfig(JSON.stringify(this.compressedContentArray));
      // } catch (error) {
      //   console.log(error);
      // }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.upload-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  z-index: 2;
}

.content-box {
  width: 100%;
  height: 100%;
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
  margin-left: 5px;
}

.messageBox {
  width: 100%;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
