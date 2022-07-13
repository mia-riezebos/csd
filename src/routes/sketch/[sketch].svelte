<script context="module" lang="ts">
  // export const prerender = true;

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
  import { onMount } from 'svelte';

  const modules = import.meta.glob('#/**/*.ts');

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
  }
  async function loadSketch() {
    sketch?.remove();
    console.log(`../../sketches/${name}/sketch.ts`);
    let response = await modules[`../../../sketches/${name}/sketch.ts`]();
    sketch = new p5(response.default, document.getElementById('sketch') as HTMLElement | undefined);
  }
</script>

<main>
  <div id="sketch" />
</main>

<style>
</style>
