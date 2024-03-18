<script>
  import { onMount } from 'svelte';
  import './konva.js'
  import {Game, games} from './script.js'

  export let prevBt = true;
  export let nextBt = true;
  export let restartBt = true;
  export let showLevel = true;
  export let level = 0;

  let level_txt = ""
  let game;

  onMount(() => {
    game = new Game("container");
    setGame(level);
  });

  function setGame(selected){
    let g = games[selected]
    game.initGame(
      g.frogs, g.foxes, g.rocks
    )
    level_txt = " "+g.name
  }

  function getHandleClick(type){
    return function(e){
        if(type == "next"){
          level += 1;
          if(level == games.length)
          level = 0;
        }
        else if(type == "prev"){
          level -= 1;
          if(level < 0)
            level = games.length -1;
        }
        setGame(level)
    }
  }

</script>

{#if showLevel}
  <h3 id="level-txt" class="level">{level_txt}</h3>
{/if}

<div id="container" aria-label="Froggle game canvas. This is a mouse only drag-and-drop game">
  <svg viewBox='0 0 1 1'></svg>
</div>

<div class="controls" aria-controls="container">
  {#if prevBt}
    <button id="previous-bt" on:click={getHandleClick("prev")}>&lt; Prev</button>
  {/if}
  {#if restartBt}
    <button id="restart-bt" on:click={getHandleClick("restart")}>Restart</button>
  {/if}
  {#if nextBt}
    <button id="next-bt" on:click={getHandleClick("next")}>Next &gt;</button>
  {/if}
</div>

<style>
  @import './style.css';
</style>
