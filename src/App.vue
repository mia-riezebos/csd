<script setup lang="ts">
import TheSketchList from "@/components/TheSketchList.vue";

await fetch("https://api.github.com/repos/mia-cx/csd/contents/sketches")
  .then((res) => console.log(res.json()))
  .catch((err) => {});
</script>

<template>
  <div class="container">
    <router-view></router-view>
    <TheSketchList />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap");

#app {
  display: flex;
  flex-direction: column;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e1e1e1;
  margin-top: 32px;
}

.container {
  position: relative;
  border: dashed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  padding: 8px 24px;
}
</style>
