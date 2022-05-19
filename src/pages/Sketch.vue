<script lang="ts">
import p5 from "p5";
import $ from "jquery";

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

  async mounted() {
    this.loadSketch();
    this.$watch(() => this.$route.params, this.loadSketch);
    $("#sketch").on("touchmove", (e) => {
      e.preventDefault();
    });
  },
};
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
