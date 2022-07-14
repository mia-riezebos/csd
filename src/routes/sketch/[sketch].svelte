<script context="module" lang="ts">
  export const prerender = true;

  /** @type {import('./__types/[sketch]').Load} */
  export async function load({ params }) {
    return {
      props: {
        name: params.sketch
      }
    };
  }
</script>

<script lang="ts">
  import { browser } from '$app/env';

  import p5 from 'p5';
  import { onMount, onDestroy } from 'svelte';

  const modules = import.meta.glob("../../../sketches/**/*.ts");

  export let name: string;
  export let sketch: p5;

  console.log(modules);

  if (browser) {
    onMount(() => {
      
      loadSketch();

      document.getElementById('sketch')!.ontouchmove = (e) => {
        e.preventDefault();
      };
    });
    onDestroy(() => {
      console.log('the component is being destroyed');
    });
  }
  async function loadSketch() {
    sketch?.remove();
    console.log(`../../sketches/${name}/sketch.ts`);
    // let response = await modules[`../../../sketches/${name}/p.ts`]();
    // sketch = response.createSketch(document.getElementById("sketch"));
  }
</script>

<main>
  <div id="sketch" />
</main>

<style>
</style>
