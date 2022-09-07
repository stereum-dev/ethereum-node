<template>
  <div class="financial-box_parent">
    <!-- <div class="search">
      <input
        type="search"
        placeholder="Search Contributor"
        v-model="searchPayload"
      />
    </div> -->
    <div class="financial-contributor" v-for="item in addresses" :key="item.id">
      <div class="id">
        <span>#{{ item.id }}</span>
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
      // searchPayload: "",
      addresses: [
        {
          id: "1",
          name: "dracgnar",
          avatar: "https://gitcoin.co/dynamic/avatar/dracgnar",
        },
        {
          id: "2",
          name: "neozaru",
          avatar: "https://gitcoin.co/dynamic/avatar/neozaru",
        },
        {
          id: "3",
          name: "andymeows",
          avatar: "https://gitcoin.co/dynamic/avatar/andymeows",
        },
        {
          id: "4",
          name: "benjaminion",
          avatar: "https://gitcoin.co/dynamic/avatar/benjaminion",
        },

        {
          id: "5",
          name: "jettchur",
          avatar: "https://gitcoin.co/dynamic/avatar/jettchur",
        },
        {
          id: "6",
          name: "ibrahimmoo",
          avatar: "https://gitcoin.co/dynamic/avatar/ibrahimmoo",
        },
        {
          id: "7",
          name: "andersonzane",
          avatar: "https://gitcoin.co/dynamic/avatar/andersonzane",
        },
        {
          id: "8",
          name: "montgeoo",
          avatar: "https://gitcoin.co/dynamic/avatar/montgeoo",
        },
        {
          id: "9",
          name: "liuyuanfa00",
          avatar: "https://gitcoin.co/dynamic/avatar/liuyuanfa00",
        },
        {
          id: "10",
          name: "nsibacos",
          avatar: "https://gitcoin.co/dynamic/avatar/nsibacos",
        },
        {
          id: "11",
          name: "krishna911",
          avatar: "https://gitcoin.co/dynamic/avatar/krishna911",
        },

        {
          id: "12",
          name: "kudhoos",
          avatar: "https://gitcoin.co/dynamic/avatar/kudhoos",
        },

        {
          id: "13",
          name: "tylerng1990",
          avatar: "https://gitcoin.co/dynamic/avatar/tylerng1990",
        },
        {
          id: "14",
          name: "duduhunters",
          avatar: "https://gitcoin.co/dynamic/avatar/duduhunters",
        },
        {
          id: "15",
          name: "july-jio",
          avatar: "https://gitcoin.co/dynamic/avatar/july-jio",
        },
        {
          id: "16",
          name: "weijianwei401",
          avatar: "https://gitcoin.co/dynamic/avatar/weijianwei401",
        },

        {
          id: "17",
          name: "crowley365",
          avatar: "https://gitcoin.co/dynamic/avatar/crowley365",
        },
        {
          id: "18",
          name: "jnousis",
          avatar: "https://gitcoin.co/dynamic/avatar/jnousis",
        },
        {
          id: "19",
          name: "criptocu",
          avatar: "./img/icon/credit/criptocu.png",
        },
        {
          id: "20",
          name: "sushanth9909",
          avatar: "https://gitcoin.co/dynamic/avatar/sushanth9909",
        },
        {
          id: "21",
          name: "flysky101",
          avatar: "https://gitcoin.co/dynamic/avatar/flysky101",
        },
        {
          id: "22",
          name: "ff8997249",
          avatar: "https://gitcoin.co/dynamic/avatar/ff8997249",
        },
        {
          id: "23",
          name: "imyoko0926",
          avatar: "https://gitcoin.co/dynamic/avatar/imyoko0926",
        },
        {
          id: "24",
          name: "wy1750",
          avatar: "https://gitcoin.co/dynamic/avatar/wy1750",
        },
        {
          id: "25",
          name: "yusuen0823",
          avatar: "https://gitcoin.co/dynamic/avatar/yusuen0823",
        },

        {
          id: "26",
          name: "ratking2020",
          avatar: "https://gitcoin.co/dynamic/avatar/ratking2020",
        },
        {
          id: "27",
          name: "superphiz",
          avatar: "https://gitcoin.co/dynamic/avatar/superphiz",
        },
        {
          id: "28",
          name: "anthonyehizogie",
          avatar: "https://gitcoin.co/dynamic/avatar/anthonyehizogie",
        },
        {
          id: "29",
          name: "pituraibagi",
          avatar: "https://gitcoin.co/dynamic/avatar/pituraibagi",
        },
        {
          id: "30",
          name: "yangjime4",
          avatar: "https://gitcoin.co/dynamic/avatar/yangjime4",
        },
        {
          id: "31",
          name: "a295315827",
          avatar: "https://gitcoin.co/dynamic/avatar/a295315827",
        },
        {
          id: "32",
          name: "almaroof",
          avatar: "https://gitcoin.co/dynamic/avatar/almaroof",
        },
        {
          id: "33",
          name: "ivomarinovic",
          avatar: "https://gitcoin.co/dynamic/avatar/ivomarinovic",
        },
        {
          id: "34",
          name: "free999enigma",
          avatar: "https://gitcoin.co/dynamic/avatar/free999enigma",
        },
        {
          id: "35",
          name: "doppelbock42",
          avatar: "https://gitcoin.co/dynamic/avatar/doppelbock42",
        },

        {
          id: "36",
          name: "owocki",
          avatar: "https://gitcoin.co/dynamic/avatar/owocki",
        },
        {
          id: "37",
          name: "mfinestone",
          avatar: "https://gitcoin.co/dynamic/avatar/mfinestone",
        },
        {
          id: "38",
          name: "dreamtoking",
          avatar: "https://gitcoin.co/dynamic/avatar/dreamtoking",
        },
        {
          id: "39",
          name: "vshvsh",
          avatar: "https://gitcoin.co/dynamic/avatar/vshvsh",
        },
        {
          id: "40",
          name: "jiaoxing1688",
          avatar: "https://gitcoin.co/dynamic/avatar/jiaoxing1688",
        },
      ],
    };
  },
  watch: {
    searchPayload: function () {
      this.addresses.name.filter((name) =>
        name.toLowerCase().includes(this.searchPayload.toLowerCase())
      );
    },
  },
};
</script>
<style scoped>
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
