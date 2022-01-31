<template>

    <img :src="flag" />

</template>

<script>
export default {

    name: "LangButton",
    props: ["flag"],

};
</script>

<style scoped>

img {
    width: 10%;
    position: absolute;
    top: 80%;
    right: 10%;
}
</style>
