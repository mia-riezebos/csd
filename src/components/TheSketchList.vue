<script lang="ts">
export default {
  data() {
    return {
      sketches: null,
      branch: null,
    };
  },
  async created() {
    const sketchList = await fetch(`/sketches.json`);
    this.sketches = await sketchList.json();
  },
};
</script>

<template>
  <ul class="nav-list">
    <li>
      <router-link to="/">Home</router-link>
    </li>
    <li v-if="sketches">
      Sketches
      <ul class="sketches">
        <li v-for="sketch in sketches" v-bind:key="sketch">
          <router-link :to="`/sketch/${sketch}`">{{
            sketch
            }}</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style>
ul {
  list-style: none;
  text-align: left;
}

li > ul {
  padding: 0px 8px;
}

li > a {
  transition: transform 50ms ease-in-out;
  display: inline-block;
  /* transform: translateY(12px); */
  color: #9fa6ff;
  text-decoration: none;
}

li:hover > a {
  color: #e4a0cf;
  transform: translateY(-1px);
}

li:active > a {
  transform: translateY(2px);
}
</style>
