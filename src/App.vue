<script setup lang="ts">
import TheSketchList from "@/components/TheSketchList.vue";
</script>

<template>
  <div class="container">
    <router-view></router-view>
    <TheSketchList id="index" />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap");

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e1e1e1;
  margin-top: 32px;
}

#index {
  border-style: dotted;
  padding: 16px 16px;
}

.container {
  position: relative;
  border: dashed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 16px;
  padding: 8px 24px;
  max-width: 960px;
}
</style>
