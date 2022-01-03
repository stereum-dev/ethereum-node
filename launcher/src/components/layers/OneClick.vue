<template>
  <section class="main">
    <section class="header">
      ONE CLICK INSTALLATION
    </section>
    <div class="container">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat ratione
        veritatis ducimus voluptate ea, voluptatum ullam voluptas accusamus
        dicta obcaecati iste. Similique repellat dolor reiciendis quasi ducimus,
        repellendus incidunt nostrum!
      </p>
      <hr />
      <div class="icon">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.header {
  text-align: center;
  margin: 2rem auto;
  max-width: 35rem;
  border-radius: 40px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.5rem;
  background-color: #567891;
  color: #fff;
  border: 2px solid grey;
}
.container {
  max-width: 60%;
  border: 2px solid grey;
  border-radius: 40px;
}
.container hr {
  width: 80%;
  color: #494949;
}
</style>
