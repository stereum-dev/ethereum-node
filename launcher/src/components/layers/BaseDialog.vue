<template>
<dialog open>
    <slot name="title"></slot>
    <slot name="des"></slot>
    <button @click="$emit('bDialogDis',true)"><slot name="cancel"></slot></button>
    <button @click="$emit('bDialogOk',true)"><slot name="ok"></slot></button>

    </dialog>
</template>
<script>
export default {
    name:'baseDialog',
    emits:['bDialogDis','bDialogOk']
}
</script>
<style scoped>

</style>