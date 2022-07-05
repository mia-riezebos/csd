<script lang="ts">
export default {
  data() {
    return {
      sketches: null,
      branch: null,
    };
  },
  async created() {
    await fetch(`/HEAD`).then((res) => res.text()).then((text) => {
      this.branch = text.trim().split('/')[2];
    });
    console.log(`this.branch: ${this.branch}`);
    await fetch(`https://api.github.com/repos/mia-cx/csd/contents/sketches?ref=${this.branch}`)
      .then((res) => res.json())
      .then((files) => {
        let dirs = files.filter((file) => {
          return file.type === "dir";
        });
        this.sketches = dirs;
      })
      .catch((err) => {});
  },
};
</script>

<template>
  <ul class="nav-list">
    <li><router-link to="/">Home</router-link></li>
    <li v-if="sketches">
      Sketches
      <ul class="sketches">
        <li v-for="sketch in sketches" v-bind:key="sketch.name">
          <router-link :to="`/sketch/${sketch.name}`">{{
            sketch.name
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
