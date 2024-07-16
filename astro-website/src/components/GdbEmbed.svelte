<script>
  import Hexdump from './Hexdump.svelte'

  export let centered = true;
  export let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
  export let strData = "";
  export let showAscii = true;
  export let startAddress = 0;

data = [
  80, 97, 103, 101, 32, 110, 111, 116, 32, 102, 111, 117, 110, 100, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 64, 220, 255, 255, 1, 0, 0, 0, 88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
  0, 0, 0, 0, 0, 0, 0, 0
  ]
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
      <Hexdump
        bytesPerRow={16}
        centered={false}
        unstyled={true}
        {data}
        {strData}
        {showAscii}
        {startAddress}
        colorRegions={[]}
      />
    </div>
  </section>

</div>

<style>

.embed {
  --drag-line-color: transparent;
  --controls-bg-color: #1c1e24;
  --controls-fg-color: #d0d5df;
  --controls-border-color: rgba(255, 255, 255, .4); /*light*/
  --controls-border-color: rgba(255, 255, 255, .2); /*dark*/
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
  border-top: 1px solid var(--controls-border-color);
  border-bottom: 1px solid var(--controls-border-color);

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
  /* padding-bottom: 1rem; */
}


</style>
