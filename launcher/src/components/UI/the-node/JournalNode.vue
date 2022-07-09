<template>
  <div class="journal-parent">
    <div class="edit-btn">
      <router-link to="/manage">
        <span>to edit node</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/maintenance3.png"
          alt="icon"
        />
      </router-link>
    </div>


  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeStore } from "@/store/theNode";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useNodeStore, {
      newUpdates: "newUpdates",
      statusContents: "statusContents",
    }),
  },
};
</script>
<style scoped>
.journal-parent {
  width: 100%;
  height: 100%;
  background-color: #3b3b3b;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 4% 10% 40% 44%;
}

.edit-btn {
  grid-column: 1/6;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5px;
}
.edit-btn a:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}
.edit-btn a:active {
  box-shadow: none;
  transform: scale(1);
}
.edit-btn a {
  width: 90%;
  height: 32px;
  background-color: #292929;
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(194, 194, 194);
  border: 1px solid #787878;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.edit-btn span {
  color: rgb(249, 187, 73);
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
  text-transform: uppercase;
}
.edit-btn img {
  width: 18px;
  height: 18px;
  background-color: transparent;
  margin-right: 10px;
}


</style>
