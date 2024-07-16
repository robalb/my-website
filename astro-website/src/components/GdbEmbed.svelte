<script>
  import Hexdump from './Hexdump.svelte'
  import { createEventDispatcher } from 'svelte';

  export let codePanel = true;
  export let registersPanel = true;
  export let memoryPanel = true;

  export let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
  export let strData = "";
  export let showAscii = true;
  export let startAddress = 0;
  export let colorRegions = {};

	const dispatch = createEventDispatcher();
	function onRun() {
		dispatch('runClick', 'button1')
	}
	function onReset() {
		dispatch('resetClick', 'button2');
	}



</script>


<div class="embed">

  {#if codePanel}
  <section
      class="embed__panel --round_top"
      class:--round_bottom={!registersPanel && !memoryPanel}
      aria-labelledby="">
    <!-- <div class="embed__dragline"></div> -->
    <div
        class="embed__panel_bar --round_top"
        class:--round_bottom={!registersPanel && !memoryPanel}
      >
      <p>code</p>
    </div>
    <div class="embed__content">
      <pre><code class="language-assembly"><slot/></code></pre>
    </div>
    <div class="embed__code_controls_box">
      <div class="embed__code_controls">
        <button on:click={onReset}>reset</button>
        <button on:click={onRun}>run</button>
      </div>
    </div>
  </section>
  {/if}

  {#if registersPanel}
  <section
      class="embed__panel"
      class:--round_top={!codePanel}
      class:--round_bottom={!memoryPanel}
      aria-labelledby="">
    <div 
        class="embed__panel_bar"
        class:--round_top={!codePanel}
        class:--round_bottom={!memoryPanel} >
      <p>registers</p>
    </div>
    <div class="embed__content">
      <pre>
        <code>
$rax   : 0x0
$rdx   : 0x0
$rsp   : 0x007fffffffdba0  →  0x0000000000000001
        </code>
      </pre>
    </div>
  </section>
  {/if}

  {#if memoryPanel}
  <section
      class="embed__panel --round_bottom"
      class:--round_top={!codePanel && !memoryPanel}
      aria-labelledby="">
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
        {colorRegions}
      />
    </div>
  </section>
  {/if}

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
  margin-bottom: 100px;
}

.embed__panel {
  display: flex;
  flex-direction:column;
  background-color: var(--panel-bg-color);
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
  padding-bottom: 1rem;

  & pre{
    overflow: auto;
    color: white;
    padding: 1rem;
    padding-bottom: .5rem;
    margin: 0;
  }

  & code {
    margin: 0;
    padding: 0;
  }
}

.embed__code_controls_box {
		height:0;
    width: 100%;
    display: flex;
    justify-content:flex-end;
}

.embed__code_controls {
      position: relative;
      top: -50px;
      margin-right: 1rem;

    & button{
      background-color: #f0f0f0;
      padding: 0.5rem;
      border: 2px solid #f0f0f0;
      border-radius:8px;
      color: black;
    }
    & button:hover{
      /* opacity: .4; */
    }
    & button:active{
      border-top: 0px;
      border-bottom: 0px;
      border-color: transparent;
    }
}

/* global modifiers, not following BEM rules */
.--round_top{
  border-radius: 8px 8px 0 0;
}
.--round_bottom{
  border-radius: 0 0 8px 8px;
}


</style>
