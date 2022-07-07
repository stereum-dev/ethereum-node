<template>
  <manage-trapezoid>
    <template #default>
      <span class="title">{{ title }}</span>
      <div class="item-box" @drag.prevent.stop>
        <div
          class="items"
          v-for="(item, index) in filteredList"
          :key="index"
          ref="itemsList"
          @mouseover="pluginMenuHandler(item)"
          @mouseleave="hidePluginMenu(item)"
        >
          <img :src="item.sIcon" alt="icon" @click="selectedItem(item)" />
          <plugin-menu></plugin-menu>
        </div>
      </div>
    </template>
    <template #plusIcon>
      <div class="plus-icon-box" @click="$emit('modalView', list)">
        <img src="/img/icon/manage-node-icons/fullscreen1.png" alt="icon" />
      </div>
    </template>
  </manage-trapezoid>
</template>
<script>
import ManageTrapezoid from "../node-manage/ManageTrapezoid.vue";
import PluginMenu from "./PluginMenu.vue";
export default {
  components: {
    ManageTrapezoid,
    PluginMenu,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "Title",
    },
    list: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      itemsList: [],
      isPluginMenuActive: true,
      filteredList: [],
    };
  },
  created() {
    this.filteredList = this.list;
  },
  mounted() {
    this.filteredList = this.filteredList.map((item) => {
      return {
        displayPluginMenu: false,
        ...item,
      };
    });
  },
  computed: {},
  methods: {
    selectedItem(item) {
      item.active = !item.active;
      this.$emit("itemSelect", item);
    },
    pluginMenuHandler(el) {
      this.filteredList.map((item) => {
        if (item.id === el.id && item.name === el.name)
          el.displayPluginMenu = true;
      });
    },
    hidePluginMenu(el) {
      el.displayPluginMenu = false;
    },
  },
};
</script>
<style scoped>
.showModal {
  display: none;
}
.title {
  width: auto;
  min-width: 70px;
  height: 20px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 5px;
  background-color: #285940;
  border-radius: 20px;
  position: absolute;
  left: 0;
  top: -13px;
  box-shadow: 0 1px 3px rgb(47, 47, 47);
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-box {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, 63px);
  justify-content: space-between;
  align-self: center;
  align-items: center;
  row-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 21%;
  left: 21.6%;
  height: 63px;
  width: 56%;
  background-color: transparent;
}
.item-box::-webkit-scrollbar {
  width: 1px;
}
.item-box .items {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 50px;
  height: 50px;
  border-radius: 7px;
  margin: 0 auto;
  cursor: pointer;
  z-index: 0;
}
.item-box .items img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.plus-icon-box {
  width: 30px;
  height: 20px;
  border-radius: 50px;
  position: absolute;
  top: 2px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.plus-icon-box img {
  width: 17px;
  border-radius: 3px;
}

.plus-icon-box img:hover {
  transform: scale(1.1);
  box-shadow: 0 1px 3px 1px rgb(27, 27, 27);
  transition-duration: 100ms;
}
.plus-icon-box img:active {
  transform: scale(1);
  box-shadow: none;
  transition-duration: 100ms;
}

.items img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(64, 168, 243);
  border-radius: 10px;
}
</style>
