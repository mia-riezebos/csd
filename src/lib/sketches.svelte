<script context="module" lang="ts">
  export const prerender = true;

  export let sketches: string = '';
</script>

<section id="navigation">
  <ul>
    <li>{sketches}</li>
  </ul>
</section>

<style>
  #navigation {
    border-style: dotted;
    padding: 16px 16px;
  }
</style>
