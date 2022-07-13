<script lang="ts">
  export let sketches: string[] = [];
</script>

<section id="navigation">
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/sketches">Sketches</a>
      <ul>
        {#each sketches as sketch}
          <li><a href={`/sketch/${sketch}`}>{sketch}</a></li>
        {/each}
      </ul>
    </li>
  </ul>
</section>

<style>
  #navigation {
    border-style: dotted;
    padding: 16px 16px;
  }
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

  li > a:hover {
    color: #e4a0cf;
    transform: translateY(-1px);
  }

  li > a:active {
    transform: translateY(2px);
  }
</style>
