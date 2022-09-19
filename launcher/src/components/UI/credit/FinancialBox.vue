<template>
  <div class="financial-box_parent">
    <div class="type-selector">
      <select
        name="financial-type-info"
        id="typeInfo"
        v-model="contributorsRefferer"
      >
        <option value="allAddresses">GITCOIN COMPLETE LIST</option>
        <option value="runds">GRANT ROUNDS</option>
      </select>
    </div>
    <div class="search" v-if="socialEth_toggle">
      <input
        type="search"
        placeholder="Search Contributor"
        v-model="searchPayload"
      />
    </div>
    <div class="itemWrapper" v-if="socialEth_toggle">
      <div
        class="financial-contributor"
        v-for="item in filteredItem"
        :key="item.name"
      >
        <!-- <div class="id">
        <span>#{{ index + 1 }}</span>
      </div> -->
        <div class="avatar">
          <img :src="item.avatar" />
        </div>
        <div class="name">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="itemWrapper" v-else>
      <div class="ethAddresses" v-for="item in ethAddresses" :key="item">
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useFinancialStore } from "../../../store/financialCredit";
export default {
  data() {
    return {
      contributorsRefferer: "allAddresses",
      socialEth_toggle: false,
      filteredItem: [],
      searchPayload: "",
    };
  },
  computed: {
    ...mapState(useFinancialStore, {
      socialAddresses: "socialAddresses",
      ethAddresses: "ethAddresses",
    }),
    sortedAddresses() {
      return this.socialAddresses.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();
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
    this.toggleItems();
  },
  created() {
    this.filteredItem = this.sortedAddresses;
  },
  watch: {
    searchPayload: function () {
      this.filteredItem = this.sortedAddresses.filter((item) =>
        item.name.toLowerCase().includes(this.searchPayload.toLowerCase())
      );
    },
  },
  methods: {
    filterStering(item) {
      item.substr(substr(2, item.length - 1));
    },
    toggleItems() {
      if (this.contributorsRefferer === "allAddresses") {
        return (this.socialEth_toggle = false);
        alert(this.contributorsRefferer);
      } else if (this.contributorsRefferer === "runds") {
        return (this.socialEth_toggle = true);
        alert(this.contributorsRefferer);
      }
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
.type-selector select {
  max-height: 1.8rem;
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
  height: 5%;
  width: 15%;
  left: 62%;
  top: 20%;
  font-size: 80%;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
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
