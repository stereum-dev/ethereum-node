<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <EditBody />
  </div>
</template>
<script>
import EditHeader from "../components/edit/EditHeader.vue";
import EditBody from "../components/edit/EditBody.vue";
export default {
  name: "EditSection",
  components: {
    EditHeader,
    EditBody,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
