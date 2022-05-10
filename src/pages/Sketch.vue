<script lang="ts">
import p5 from "p5";

const modules = import.meta.glob("#/**/*.ts");

export default {
  data() {
    return {
      name: null,
      sketch: null,
    };
  },

  methods: {
    async loadSketch() {
      this.name = this.$route.params.sketch;
      this.sketch?.remove();
      if (!this.name) return;
      let response = await modules[`../../sketches/${this.name}/sketch.ts`]();
      this.sketch = new p5(response.default, document.getElementById("sketch"));
    },
  },

  async created() {
    this.loadSketch();
    this.$watch(() => this.$route.params, this.loadSketch);
  },
};
// console.log(this.$route.params.sketch);
</script>

<template>
  <h1>{{ name }}</h1>
  <div id="sketch"></div>
</template>

<style>
#sketch {
  border-style: dotted;
}
</style>
