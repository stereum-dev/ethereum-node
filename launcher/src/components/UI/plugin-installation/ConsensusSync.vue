<template>
  <div class="syncRow">
    <div class="plugin-name">
      <div class="serviceIcon">
        <img :src="client.icon" alt="icon" />
      </div>
      <div class="serviceBox">
        <span>{{ client.name }}</span>
        <span>{{ client.displayCategory }}</span>
      </div>
    </div>
    <carousel ref="carousel" v-model="currentSlide" :items-to-show="1" :wrap-around="true" :transition="500">
      <slide v-for="(item, index) in syncType" :key="index">
        <div class="syncBox">
          <div v-if="item.name === 'genesis'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'recommended'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="inputBox">
              <input
                v-model="checkPointSync"
                type="text"
                placeholder="https://example.cc/"
                class="placeholder:text-gray-500"
              />
            </div>
          </div>
          <div v-else-if="item.type === 'custom source'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="inputBox_select">
              <div class="select">
                {{ selectedItem }}
                <!-- <div v-if="!dropdown && currentNetwork.id == 1" class="dropParent">
                  <div class="dropRow">https://mainnet-checkpoint-sync.attestant.io/</div>
                  <div class="dropRow">https://beaconstate-mainnet.chainsafe.io/</div>
                  <div class="dropRow">https://beaconstate.ethstaker.cc/</div>
                  <div class="dropRow">https://sync-mainnet.beaconcha.in/</div>
                  <div class="dropRow">https://mainnet.checkpoint.sigp.io/</div>
                  <div class="dropRow">https://beaconstate.info/</div>
                  <div class="dropRow">https://checkpointz.pietjepuk.net/</div>
                  <div class="dropRow">https://sync.invis.tools/</div>
                  <div class="dropRow">https://mainnet-checkpoint-sync.stakely.io/</div>
                </div>
                <div v-if="dropdown && currentNetwork.id == 2" class="dropParent">
                  <div class="dropRow">https://prater.checkpoint.sigp.io/</div>
                  <div class="dropRow">https://goerli-sync.invis.tools/</div>
                  <div class="dropRow">https://checkpoint-sync.goerli.ethpandaops.io/</div>
                  <div class="dropRow">https://goerli.beaconstate.info/</div>
                  <div class="dropRow">https://sync-goerli.beaconcha.in/</div>
                  <div class="dropRow">https://prater-checkpoint-sync.stakely.io/</div>
                  <div class="dropRow">https://goerli.beaconstate.ethstaker.cc/</div>
                  <div class="dropRow">https://beaconstate-goerli.chainsafe.io/</div>
                </div>
                <div v-if="dropdown && currentNetwork.id == 3" class="dropParent">
                  <div class="dropRow">https://checkpoint.gnosischain.com/</div>
                </div>
                <div v-if="dropdown && currentNetwork.id == 4" class="dropParent">
                  <div class="dropRow">https://sepolia.beaconstate.info/</div>
                  <div class="dropRow">https://beaconstate-sepolia.chainsafe.io/</div>
                  <div class="dropRow">https://checkpoint-sync.sepolia.ethpandaops.io/</div>
                </div> -->
              </div>
              <img v-if="!dropdown" src="/img/icon/arrows/left-arrow.png" alt="icon" @click="toggleDropDown" />
              <img v-else src="/img/icon/arrows/left-arrow.png" alt="icon" class="drop-on" @click="toggleDropDown" />
            </div>
          </div>
        </div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
    <div v-if="dropdown" class="selection-column">
      <ul class="link-wapper">
        <li v-for="link in selectedLinks" :key="link" class="option-row" @click="linkPicker(link)">
          <span>{{ link }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    client: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      dropdown: false,
      selectedItem: " - SELECT A SOURCE -",
      currentSlide: 0,
      selectedLinks: [],
      mainnet: [
        "https://mainnet-checkpoint-sync.attestant.io/",
        "https://beaconstate-mainnet.chainsafe.io/",
        "https://beaconstate.ethstaker.cc/",
        "https://sync-mainnet.beaconcha.in/",
        "https://mainnet.checkpoint.sigp.io/",
        "https://beaconstate.info/",
        "https://checkpointz.pietjepuk.net/",
        "https://sync.invis.tools/",
        "https://mainnet-checkpoint-sync.stakely.io/",
      ],
      georli: [
        "https://prater.checkpoint.sigp.io/",
        "https://goerli-sync.invis.tools/",
        "https://checkpoint-sync.goerli.ethpandaops.io/",
        "https://goerli.beaconstate.info/",
        "https://sync-goerli.beaconcha.in/",
        "https://prater-checkpoint-sync.stakely.io/",
        "https://goerli.beaconstate.ethstaker.cc/",
        "https://beaconstate-goerli.chainsafe.io/",
      ],
      sepolia: ["https://checkpoint.gnosischain.com/"],
      gnosis: [
        "https://sepolia.beaconstate.info/",
        "https://beaconstate-sepolia.chainsafe.io/",
        "https://checkpoint-sync.sepolia.ethpandaops.io/",
      ],
    };
  },

  computed: {
    ...mapWritableState(useClickInstall, {
      syncType: "syncType",
      checkPointSync: "checkPointSync",
      btnActive: "btnActive",
    }),
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
  },
  watch: {
    currentSlide: function (val) {
      if (this.$route.path === "sync")
        if (val === 1 && this.checkPointSync === "") {
          this.btnActive = false;
        } else {
          this.btnActive = true;
        }
    },
  },
  mounted() {
    this.setSelectedLinks();
  },
  methods: {
    toggleDropDown() {
      this.dropdown = !this.dropdown;
    },
    linkPicker(item) {
      this.selectedItem = item;
      this.dropdown = false;
    },
    setSelectedLinks() {
      switch (this.currentNetwork.id) {
        case 1:
          this.selectedLinks = this.mainnet;
          console.log(this.selectedLinks);
          break;
        case 2:
          this.selectedLinks = this.georli;
          console.log(this.selectedLinks);
          break;
        case 3:
          this.selectedLinks = this.sepolia;
          console.log(this.selectedLinks);
          break;
        case 4:
          this.selectedLinks = this.gnosis;
          console.log(this.selectedLinks);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scope>
.syncRow {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.plugin-name {
  width: 25%;
  height: 80%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name .serviceIcon {
  width: 40%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.plugin-name .serviceIcon img {
  width: 80%;
}
.carousel {
  width: 72%;
  height: 100%;
}

.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel__slide {
  padding: 5px 0;
}

.carousel__prev {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel__next {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel button {
  width: 20px;
}
.carousel button .carousel__icon {
  width: 30px;
  height: 30px;
  color: #fff;
}

.plugin-name .serviceBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.plugin-name .serviceBox span:first-child {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}
.plugin-name .serviceBox span:last-child {
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}
.carouselBox {
  width: 90%;
  height: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.syncBox {
  width: 85%;
  height: 100%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncBox .syncContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncBox .syncContent .commingSoon {
  width: 100%;
  height: 30px;
  background-color: black;
  opacity: 0.5;
  color: gray;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: 600;
}
.syncContent .syncText {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 5px;
}

.syncContent .syncText span:first-child {
  width: 100%;
  height: max-content;
  color: #acaeae;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  padding: 2px;
}
.syncContent .syncText span:last-child {
  height: max-content;
  width: 100%;
  color: #4d8384;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: left;
  padding: 2px;
}

.syncContent .inputBox {
  width: 75%;
  height: 100%;
  border-radius: 10px;
  background-color: #1e2226;
  display: flex;
  justify-content: center;
  align-items: center;
}
.syncContent .inputBox_select {
  width: 60%;
  height: 100%;
  border-radius: 5px;
  background-color: #1e2226;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
}

.inputBox_select img {
  width: 20px;
  transform: rotate(-90deg);
  margin-right: 10px;
}

.syncContent .inputBox_select .select {
  width: 86%;
  height: 100%;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 80%;
  font-weight: 400;
  padding: 5px;
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
}

.selection-column {
  width: 34%;
  height: 200%;
  display: flex;
  background: #c12f2f;
  color: #d5d5d5;
  font-weight: 400;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 90%;
  left: 58%;
}
.link-wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: flex-start;
}
.option-row {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 60%;
  font-weight: 600;
  padding: 1%;
  margin-bottom: 1%;
  border-bottom: 1px solid #d5d5d5;
  flex-shrink: 0;
  flex-grow: 0;
  overflow-x: auto;
  cursor: pointer;
}
.option-row:hover {
  background-color: #151a1e;
  color: #d5d5d5;
}
.option-row span {
  white-space: nowrap;
}
::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: none;
}

.syncContent .inputBox_select .select .dropParent {
  background-color: #192128;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 207px;
  height: 130px;
  z-index: 1000;
}
.dropParent .dropRow {
  width: 100%;
  height: 40px;
  margin-top: 5px;
  color: #d5d5d5;
  background-color: #c12f2f;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
}

.inputBox input {
  width: 100%;
  height: 100%;
  border: 3px solid #23272c;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 0.6rem;
  font-weight: 400;
  text-align: left;
  padding: 5px;
  padding-left: 5px;
}
.sync-header {
  width: 100%;
  height: 34%;
  border: 1px solid #707070;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #1a5443;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.sync-header .syncContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
  background-color: #33393e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncContent span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.syncContent img {
  width: 5%;
  height: 50%;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content span {
  font-size: 0.5rem;
  font-weight: 400;
  color: #aaaaaa;
}
.content .inputBox {
  width: 96%;
  height: 74%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  padding-bottom: 3px;
}
</style>
