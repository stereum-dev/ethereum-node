<template>
  <div class="financial-box_parent">
    <div class="search">
      <input
        type="search"
        placeholder="Search Contributor"
        v-model="searchPayload"
      />
    </div>
    <div
      class="financial-contributor"
      v-for="(item, index) in filteredItem"
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
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filteredItem: [],
      searchPayload: "",
      addresses: [
        {
          name: "dracgnar",
          avatar: "https://gitcoin.co/dynamic/avatar/dracgnar",
        },
        {
          name: "neozaru",
          avatar: "https://gitcoin.co/dynamic/avatar/neozaru",
        },
        {
          name: "andymeows",
          avatar: "https://gitcoin.co/dynamic/avatar/andymeows",
        },
        {
          name: "benjaminion",
          avatar: "https://gitcoin.co/dynamic/avatar/benjaminion",
        },

        {
          name: "jettchur",
          avatar: "https://gitcoin.co/dynamic/avatar/jettchur",
        },
        {
          name: "ibrahimmoo",
          avatar: "https://gitcoin.co/dynamic/avatar/ibrahimmoo",
        },
        {
          name: "andersonzane",
          avatar: "https://gitcoin.co/dynamic/avatar/andersonzane",
        },
        {
          name: "montgeoo",
          avatar: "https://gitcoin.co/dynamic/avatar/montgeoo",
        },
        {
          name: "liuyuanfa00",
          avatar: "https://gitcoin.co/dynamic/avatar/liuyuanfa00",
        },
        {
          name: "nsibacos",
          avatar: "https://gitcoin.co/dynamic/avatar/nsibacos",
        },
        {
          name: "krishna911",
          avatar: "https://gitcoin.co/dynamic/avatar/krishna911",
        },

        {
          name: "kudhoos",
          avatar: "https://gitcoin.co/dynamic/avatar/kudhoos",
        },

        {
          name: "tylerng1990",
          avatar: "https://gitcoin.co/dynamic/avatar/tylerng1990",
        },
        {
          name: "duduhunters",
          avatar: "https://gitcoin.co/dynamic/avatar/duduhunters",
        },
        {
          name: "july-jio",
          avatar: "https://gitcoin.co/dynamic/avatar/july-jio",
        },
        {
          name: "weijianwei401",
          avatar: "https://gitcoin.co/dynamic/avatar/weijianwei401",
        },

        {
          name: "crowley365",
          avatar: "https://gitcoin.co/dynamic/avatar/crowley365",
        },
        {
          name: "jnousis",
          avatar: "https://gitcoin.co/dynamic/avatar/jnousis",
        },
        {
          name: "criptocu",
          avatar: "./img/icon/credit/criptocu.png",
        },
        {
          name: "sushanth9909",
          avatar: "https://gitcoin.co/dynamic/avatar/sushanth9909",
        },
        {
          name: "flysky101",
          avatar: "https://gitcoin.co/dynamic/avatar/flysky101",
        },
        {
          name: "ff8997249",
          avatar: "https://gitcoin.co/dynamic/avatar/ff8997249",
        },
        {
          name: "imyoko0926",
          avatar: "https://gitcoin.co/dynamic/avatar/imyoko0926",
        },
        {
          name: "wy1750",
          avatar: "https://gitcoin.co/dynamic/avatar/wy1750",
        },
        {
          name: "yusuen0823",
          avatar: "https://gitcoin.co/dynamic/avatar/yusuen0823",
        },

        {
          name: "ratking2020",
          avatar: "https://gitcoin.co/dynamic/avatar/ratking2020",
        },
        {
          name: "superphiz",
          avatar: "https://gitcoin.co/dynamic/avatar/superphiz",
        },
        {
          name: "anthonyehizogie",
          avatar: "https://gitcoin.co/dynamic/avatar/anthonyehizogie",
        },
        {
          name: "pituraibagi",
          avatar: "https://gitcoin.co/dynamic/avatar/pituraibagi",
        },
        {
          name: "yangjime4",
          avatar: "https://gitcoin.co/dynamic/avatar/yangjime4",
        },
        {
          name: "a295315827",
          avatar: "https://gitcoin.co/dynamic/avatar/a295315827",
        },
        {
          name: "almaroof",
          avatar: "https://gitcoin.co/dynamic/avatar/almaroof",
        },
        {
          name: "ivomarinovic",
          avatar: "https://gitcoin.co/dynamic/avatar/ivomarinovic",
        },
        {
          name: "free999enigma",
          avatar: "https://gitcoin.co/dynamic/avatar/free999enigma",
        },
        {
          name: "doppelbock42",
          avatar: "https://gitcoin.co/dynamic/avatar/doppelbock42",
        },

        {
          name: "owocki",
          avatar: "https://gitcoin.co/dynamic/avatar/owocki",
        },
        {
          name: "mfinestone",
          avatar: "https://gitcoin.co/dynamic/avatar/mfinestone",
        },
        {
          name: "dreamtoking",
          avatar: "https://gitcoin.co/dynamic/avatar/dreamtoking",
        },
        {
          name: "vshvsh",
          avatar: "https://gitcoin.co/dynamic/avatar/vshvsh",
        },
        {
          name: "jiaoxing1688",
          avatar: "https://gitcoin.co/dynamic/avatar/jiaoxing1688",
        },
      ],
    };
  },
  computed: {
    sortedAddresses() {
      return this.addresses.sort((a, b) => {
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
  created: function () {
    this.filteredItem = this.sortedAddresses;
  },
  watch: {
    searchPayload: function () {
      this.filteredItem = this.sortedAddresses.filter((item) =>
        item.name.toLowerCase().includes(this.searchPayload.toLowerCase())
      );
    },
  },
};
</script>
<style scoped>
.search input {
  position: fixed;
  height: 5%;
  width: 15%;
  left: 56%;
  top: 20%;
  font-size: 80%;
}
.financial-box_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99%;
  height: 80%;
  overflow-y: auto;
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
.id {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  height: 100%;
  font-size: 150%;
  font-weight: 600;
  color: #eee;
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
</style>
