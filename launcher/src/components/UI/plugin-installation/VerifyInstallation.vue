<template>
  <div class="verify-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="verify-modal-parent">
        <div class="verify-modal">
          <div class="verify-box">
            <div class="verify-title-box">
              <div class="verify-title">
                <span>VERIFY & INSTALL</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="table-box">
              <div class="table">
                <div class="table-header">
                  <span>TO INSTALL</span>
                  <span>SELECTION</span>
                  <span>REQUIREMENTS</span>
                </div>
                <div class="table-content">
                  <div
                    class="table-row"
                    v-for="(plugin, index) in selectedPreset.includedPlugins"
                    :key="index"
                  >
                    <div class="plugin-name">
                      <span>NAME:</span>
                      <span>{{ plugin.name }}</span>
                    </div>
                    <div class="selection">
                      <div class="category">
                        <span>CATEGORY:</span>
                        <span>{{ plugin.category }}</span>
                      </div>
                      <div class="path">
                        <span>PATH:</span>
                        <span>{{ plugin.path }}</span>
                      </div>
                    </div>
                    <div class="requirements">
                      <div class="cpu">
                        <span>CPU CORES:</span>
                        <span>{{
                          this.selectedPreset.requirements?.core
                        }}</span>
                      </div>
                      <div class="memory">
                        <span>MEMORY:</span>
                        <span>{{
                          this.selectedPreset.requirements?.memory
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/install' }">
              <button class="back-btn">BACK</button>
            </router-link>
            <router-link :to="{ path: '/configuration' }">
              <button class="next-btn">INSTALL</button>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedPreset: "getSelectedPreset",
    }),
  },
  mounted() {
    if (Object.keys(this.selectedPreset).length === 0) {
      this.$router.push("/clickinstall");
    }
  },
};
</script>
<style scoped>
.verify-parent {
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
.verify-modal-parent {
  width: 80%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 11.2%;
  left: 10%;
  z-index: 2;
}
.verify-modal {
  width: 70%;
  height: 95%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.verify-box {
  width: 95%;
  height: 20%;
  margin-top: 5px;
  background-color: #8e8e8e;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.verify-title-box {
  width: 96%;
  height: 80%;
  border-radius: 15px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.verify-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
}

.content-box {
  width: 95%;
  height: 63%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.table-box {
  width: 100%;
  height: 99%;
  background-color: #5b5b5b;
  border-radius: 15px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-box .table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.table .table-header {
  width: 93%;
  height: 8%;
  /* background-color: #334b3e; */
  background-color: #336666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table .table-header span:first-child {
  width: 23% !important;
  text-align: left !important;
  padding-left: 30px !important;
}
.table .table-header span {
  width: 32%;
  color: rgb(213, 213, 213);
  font-size: 0.7rem;
  font-weight: 600;
}
.table .table-content {
  width: 95%;
  height: 70%;
  border-top: 1px solid gray;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.table-content::-webkit-scrollbar {
  width: 1px;
}

.table-content .table-row {
  width: 100%;
  height: 30%;
  margin-top: 5px;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 0 3px 0;
}

.table-row .plugin-name {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.plugin-name span:first-child {
  color: #a7a7a7;
  font-size: 0.8rem;
  font-weight: 600;
}
.plugin-name span:last-child {
  color: #4ca434;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}
.table-row .selection {
  width: 33%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.category {
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.path {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row .selection .category span:first-child {
  color: #a7a7a7;
  font-size: 0.8rem;
  font-weight: 600;
}
.table-row .selection .category span:last-child {
  color: #4ca434;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
}
.table-row .selection .path span:first-child {
  color: #a7a7a7;
  font-size: 0.8rem;
  font-weight: 600;
}
.table-row .selection .path span:last-child {
  color: #c6ac2a;
  font-size: 0.9rem;
  font-weight: 600;
}
.table-row .requirements {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.requirements .cpu,
.requirements .memory {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row .requirements .cpu span:first-child {
  color: #a7a7a7;
  font-size: 0.8rem;
  font-weight: 600;
}
.table-row .requirements .cpu span:last-child {
  color: #4ca434;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 10px;
}
.table-row .requirements .memory span:first-child {
  color: #a7a7a7;
  font-size: 0.8rem;
  font-weight: 600;
}
.table-row .requirements .memory span:last-child {
  color: #4ca434;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 10px;
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
</style>
