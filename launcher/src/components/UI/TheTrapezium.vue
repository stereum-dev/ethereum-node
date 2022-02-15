<template>
    <section id="main">
        <section id="contTra">
            <div id="trapezoid">
                <slot></slot>
    
            </div>
        </section>
    </section>
</template>

<script></script>

<style scoped>
#trapezoid {
    height: 0;
    width: auto;
    margin: 5px;
    border-bottom: 7rem solid #828282;
    border-left: 5rem solid transparent;
    border-right: 5rem solid transparent;
}

#contTra {
    border: 3px solid #828282;
    margin: 0 auto;
    height:100%;
    width: 98%;
    background: #336666;
    overflow: hidden;
}
</style>
