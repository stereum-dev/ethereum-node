<template>
  <div class="plugin-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="plugin-modal-parent">
        <div class="plugin-modal">
          <div class="name-box">
            <div class="name-title-box">
              <div class="name-title">
                <span>PLUG IN NAME</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="options-box">
              <div class="option-title">
                <span>OPTION</span>
              </div>
            </div>
            <div class="system-box">
              <div class="system-title">
                <span>SYSTEM</span>
              </div>
              <div class="info-box">
                <div class="system-info">
                  <div class="info-header">
                    <span class="current-title">CURRENT</span>
                    <span class="min-title">MIN</span>
                  </div>
                  <div class="info-titles">
                    <span class="cpu-info">CPU CORES:</span>
                    <span class="memory-info">MEMORY:</span>
                  </div>
                  <div class="info-parent">
                    <div class="info-content">
                      <div class="cpu-cores" v-if="requirementPassed">
                        <span
                          class="cpu-current"
                          :class="{ passedreq: requirementPassed }"
                          >{{ this.systemInfos.cpuCores }}</span
                        >
                        <span class="cpu-needed">{{
                          this.plugins.requirements.cpuCores
                        }}</span>
                      </div>
                      <div class="cpu-cores" v-if="requirementFailed">
                        <span
                          class="cpu-current"
                          :class="{
                            faildreq: requirementFailed,
                          }"
                          >{{ this.systemInfos.cpuCores }}</span
                        >
                        <span class="cpu-needed">{{
                          this.plugins.requirements.cpuCores
                        }}</span>
                      </div>
                      <div class="memory" v-if="requirementFailed">
                        <span
                          class="memory-current"
                          :class="{
                            faildreq: requirementFailed,
                          }"
                          >{{ this.systemInfos.memory }}</span
                        >
                        <span class="memory-needed">{{
                          this.plugins.requirements.memory
                        }}</span>
                      </div>
                      <div class="memory" v-if="requirementPassed">
                        <span
                          class="memory-current"
                          :class="{
                            passedreq: requirementPassed,
                          }"
                          >{{ this.systemInfos.memory }}</span
                        >
                        <span class="memory-needed">{{
                          this.plugins.requirements.memory
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/clickinstall' }">
              <button class="back-btn">BACK</button>
            </router-link>
            <router-link :to="{ path: '/verify' }">
              <button class="next-btn">NEXT</button>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      requirementPassed: false,
      requirementFailed: false,
      systemInfos: {
        name: "Macbook",
        cpuCores: 1,
        memory: 128,
      },
      plugins: {
        name: "Blox",
        category: "execution",
        requirements: {
          cpuCores: 4,
          memory: 64,
        },
      },
    };
  },
  mounted() {
    this.checkRequirement();
  },
  methods: {
    checkRequirement() {
      if (
        this.plugins.requirements.cpuCores <= this.systemInfos.cpuCores &&
        this.plugins.requirements.memory <= this.systemInfos.memory
      ) {
        this.requirementPassed = true;
      } else {
        this.requirementFailed = true;
      }
    },
  },
};
</script>
<style scoped>
.plugin-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-bg {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
}
.plugin-modal-parent {
  width: 75%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 14%;
  left: 13%;
  z-index: 2;
}
.plugin-modal {
  width: 70%;
  height: 90%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.name-box {
  width: 95%;
  height: 25%;
  background-color: #c2bebe;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.name-title-box {
  width: 95%;
  height: 80%;
  border-radius: 20px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.name-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
}
.option-title,
.system-title {
  width: 60%;
  height: 10%;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 10px;
  display: flex;
  background-color: #30483b;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  box-shadow: 0 1px 3px 1px rgb(67, 67, 67);
}
.option-title span,
.system-title span {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}
.content-box {
  width: 95%;
  height: 53%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.options-box {
  width: 48%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.system-box {
  width: 48%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.info-box {
  width: 90%;
  height: 45%;
  margin-top: 10px;
  background-color: transparent;
  border: 2px solid rgb(74, 73, 73);
  border-radius: 16px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42), inset 0 1px 3px 1px rgb(43, 43, 43);
  display: flex;
  justify-content: center;
  align-items: center;
}
.system-info {
  width: 93%;
  height: 89%;
  border-radius: 12px;
  background-color: rgb(60, 60, 60);
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-template-rows: 20% 40% 40%;
  padding: 2px 5px;
}
.info-parent {
  width: 100%;
  grid-column: 3/5;
  grid-row: 2/4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-parent .info-content {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.info-content .cpu-cores,
.info-content .memory {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-content .cpu-cores span,
.info-content .memory span {
  width: 10%;
  text-align: left;
}
.info-parent .cpu-current,
.info-parent .memory-current {
  font-size: 0.9rem;
  font-weight: 700;
}
.info-parent .cpu-needed,
.info-parent .memory-needed {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(215, 195, 42);
}

.info-header {
  width: 70%;
  margin-left: 10px;
  grid-column: 3/5;
  grid-row: 1/2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-header span {
  font-size: 0.5rem;
  font-weight: 600;
  color: #fff;
}
.info-header .min-title {
  margin-left: 20px;
}
.info-titles {
  width: 70%;
  grid-column: 1/3;
  grid-row: 2/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.info-titles span {
  width: 100%;
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #fff;
}

.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 95%;
  height: 90%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 55%;
  height: 60%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px rgb(53, 62, 57),
    inset 1px 1px 3px 1px rgb(92, 114, 92);
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60),
    inset 1px 1px 5px 1px rgb(67, 86, 67);
}
.next-btn:active,
.back-btn:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}

.passedreq {
  color: #16d26e !important;
}
.faildreq {
  color: rgb(225, 54, 54);
}
</style>
