<script>
  import Hexdump from './Hexdump.svelte'
</script>


<div class="embed">

  <section class="embed__panel --round_top" aria-labelledby="">
    <!-- <div class="embed__dragline"></div> -->
    <div class="embed__panel_bar --round_top">
      <p>code</p>
    </div>
    <div class="embed__content">

    </div>
  </section>

  <section class="embed__panel" aria-labelledby="">
    <div class="embed__dragline"></div>
    <div class="embed__panel_bar">
      <p>registers</p>
    </div>
    <div class="embed__content">

    </div>
  </section>

  <section class="embed__panel --round_bottom" aria-labelledby="">
    <div class="embed__dragline"></div>
    <div class="embed__panel_bar">
      <p>memory</p>
    </div>
    <div class="embed__content">
    </div>
  </section>

</div>

<style>

.embed {
  --drag-line-color: transparent;
  --controls-bg-color: #1c1e24;
  --controls-fg-color: #d0d5df;
  --panel-bg-color: #20232a;
  --panel-fg-color: white;
}

.embed{
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  /* display: flex; */
  /* flex-direction:row; */

  margin-bottom: 100px;
}

.embed__dragline{
  height: 4px;
  width: 100%;
  background-color:var(--drag-line-color);
}

.embed__panel {
  display: flex;
  flex-direction:column;
  background-color: var(--panel-bg-color);

  &.--round_top {
    border-radius: 8px 8px 0 0;
  }
  &.--round_bottom {
    border-radius: 0 0 8px 8px;
  }
}

.embed__panel_bar {
  background-color: var(--controls-bg-color);
  border-top: 1px solid rgba(255,255,255, .2);
  border-bottom: 1px solid rgba(255,255,255, .2);
  height: 2rem;
  padding-left: 1rem;

  & p{
    color: var(--controls-fg-color);

  }
  & h3 {
    font-size: 1.1rem;
    font-weight:200;
    text-decoration:none;
    border: none;

  }

  &.--round_top{
    border-top: 1px solid transparent;
    border-radius: 8px 8px 0 0;
  }
}

.embed__content {
  padding: 2rem;
}


</style>
