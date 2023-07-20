<template>
  <div class="epockSlot_parent">
    <div class="epoch-box">{{ selectedValidator.stats ? selectedValidator.stats.currentEpoch : "Loading..." }}</div>
    <div class="slot-box">{{ selectedValidator.stats ? selectedValidator.stats.currentSlot : "Loading..." }}</div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStakingStore } from "@/store/theStaking";
import ControlService from "@/store/ControlService";

export default {
  data() {
    return {
      continuousUpdateInterval: null,
      selectedValidator: null,
      intervalId: null,
      countDown: null,
      timer: 5,
    };
  },
  computed: {
    ...mapState(useStakingStore, {
      keys: "keys",
    }),
  },
  created() {
    this.fetchStatsForAllValidators().then(() => {
      this.logAllStates();
    });

    this.continuousUpdateInterval = setInterval(async () => {
      await this.updateValidatorStats();
    }, 6000);
  },
  destroyed() {
    clearInterval(this.intervalId);
    clearInterval(this.countDown);
    clearInterval(this.continuousUpdateInterval);
  },
  methods: {
    async fetchStatsForAllValidators() {
      for (const validator of this.keys) {
        await this.getValidatorStats(validator);
      }
    },
    async getValidatorStats(item) {
      clearInterval(this.intervalId);
      if (item) {
        this.intervalId = setInterval(async () => {
          await this.updateValidatorStats();
          this.countDown = setInterval(() => {
            this.timer--;
            if (this.timer === -1) {
              clearInterval(this.countDown);
              this.timer = 5;
            }
          }, 1000);
        }, 6000);

        this.selectedValidator = item;
        await this.updateValidatorStats();
      }
    },
    async updateValidatorStats() {
      if (this.selectedValidator?.key) {
        const output = await ControlService.getValidatorStats(this.selectedValidator.key);
        this.selectedValidator.stats = output;
      }
    },
    logAllStates() {
      this.keys.map((validator) => {
        return {
          key: validator.key,
          currentEpoch: validator.stats ? validator.stats.currentEpoch : "N/A",
          currentSlot: validator.stats ? validator.stats.currentSlot : "N/A",
        };
      });
    },
  },
};
</script>
<style scoped>
.epockSlot_parent {
  display: flex;
  width: 99%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  color: #c1c1c1;
  position: relative;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  background: #2a2a2a;
}
.epockSlot_parent:hover {
  background: #313131;
}
.epoch-box,
.slot-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 90%;
  font-size: 70%;
  font-weight: 600;
}
.epoch-box {
  border-right: 2px solid #eee;
}
.slot-box {
  border-left: 2px solid #eee;
}
</style>
