<template>
  <div class="financial-box_parent">
    <div class="round-selector">
      <select name="round" id="round" v-model="choosedRound">
        <option value="allAddresses">GITCOIN COMPLETE LIST</option>
        <option value="round_15">Round 15</option>
        <option value="round_14">Round 14</option>
        <option value="round_13">Round 13</option>
        <option value="round_12">Round 12</option>
        <option value="round_11">Round 11</option>
        <option value="round_10">Round 10</option>
      </select>
    </div>
    <div class="search">
      <input
        type="search"
        placeholder="Search Contributor"
        v-model="searchPayload"
      />
    </div>
    <div class="itemWrapper">
      <!-- <div
        class="financial-contributor"
        v-for="item in roundAdresses"
        :key="item.name"
      >
         <div class="id">
        <span>#{{ index + 1 }}</span>
      </div> 
        <div class="avatar">
          <img :src="item.avatar" />
        </div>
        <div class="name">
          <span>{{ item.name }}</span>
        </div>
      </div> -->
      <div
        class="ethAddresses"
        v-for="(item, index) in filteredItem"
        :key="index"
      >
        <span>{{ item }}</span>
      </div>
    </div>

    <!-- <div class="itemWrapper" v-else>
      <div class="ethAddresses" v-for="item in filteredItem" :key="item">
        <span>{{ item }}</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useFinancialStore } from "../../../store/financialCredit";
import { useRoundsETHAddresses } from "../../../store/roundsETHAddresses";
export default {
  data() {
    return {
      socialEth_toggle: false,
      filteredItem: [],
      searchPayload: "",
      roundAdresses: [],
      choosedRound: "allAddresses",
    };
  },
  computed: {
    // filterItemHandler() {
    //   this.filteredItem = this.sortedAddresses;
    //  return this.filteredItem;
    // },
    ...mapState(useFinancialStore, {
      socialAddresses: "socialAddresses",
      ethAddresses: "ethAddresses",
    }),
    ...mapState(useRoundsETHAddresses, {
      round_15: "round_15",
      round_14: "round_14",
      round_13: "round_13",
      round_12: "round_12",
      round_11: "round_11",
      round_10: "round_10",
    }),

    sortedAddresses() {
      return this.roundAdresses.sort((a, b) => {
        let fa = a.toLowerCase(),
          fb = b.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    },
  },
  updated() {
    this.roundPicker();
    this.sortedAddresses;
  },
  created() {
    this.roundPicker();
    this.filteredItem = this.sortedAddresses;
  },
  watch: {
    choosedRound: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.filteredItem = this.sortedAddresses;
        }
      },
    },
    searchPayload: function () {
      this.filteredItem = this.sortedAddresses.filter((item) =>
        item.toLowerCase().includes(this.searchPayload.toLowerCase())
      );
    },
  },
  methods: {
    roundPicker() {
      let pickedRound;
      switch (this.choosedRound) {
        case "round_15":
          pickedRound = this.round_15;
          break;
        case "round_14":
          pickedRound = this.round_14;
          break;
        case "round_13":
          pickedRound = this.round_13;
          break;
        case "round_12":
          pickedRound = this.round_12;
          break;
        case "round_11":
          pickedRound = this.round_11;
          break;
        case "round_10":
          pickedRound = this.round_10;
          break;
        case "allAddresses":
          pickedRound = this.ethAddresses;
          break;
      }
      this.roundAdresses = pickedRound;
    },
  },
};
</script>
<style scoped>
.type-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 20%;
  left: 78%;
}
.round-selector select {
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  text-align-last: center;
  line-height: inherit;
  border-radius: 10px;
  font-weight: 500;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
}
.round-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 20%;
  left: 78%;
}
.round-selector select:hover,
.round-selector select:focus,
.round-selector select:active {
  outline: none;
  border: none;
}
.itemWrapper {
  width: 100%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}
.search input {
  position: fixed;
  height: 4.3%;
  width: 15%;
  left: 62%;
  top: 20%;
  font-size: 80%;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  padding: 5px;
}
.search input:focus {
  outline: none;
}
.financial-box_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99%;
  height: 80%;
}
.financial-contributor {
  display: flex;
  width: 95%;
  height: 15%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  margin: 1%;
  border-radius: 10px;
}
.ethAddresses {
  display: flex;
  width: 95%;
  height: 2.2rem;
  justify-content: center;
  align-items: center;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  margin: 1%;
  border-radius: 10px;
}
.ethAddresses span {
  display: flex;
  width: 95%;
  height: 100%;
  color: #c1c1c1;
  font-size: 100%;
  font-weight: 600;
  justify-content: flex-start;
  align-items: center;
}
.id {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  height: 100%;
  font-size: 150%;
  font-weight: 600;
  color: #c1c1c1;
}
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  height: 95%;
}
.avatar img {
  width: 50%;
}
.name {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  height: 100%;
  font-size: 150%;
  font-weight: 400;
  color: #eee;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
