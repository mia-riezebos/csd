<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Sketches from '$lib/Navigation.svelte';

  import sketchlist from '@/sketches.json';
  export let sketches: string[] = sketchlist;
</script>

<svelte:head>
  <style>
    html,
    body {
      background-color: #212121;
      margin: 0;
      padding: 0;
    }
  </style>
</svelte:head>

<main id="app">
  <div class="container">
    <slot />
    <Sketches sketches={sketches} />
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap');

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
