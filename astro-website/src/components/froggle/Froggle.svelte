<script>
  import { onMount } from 'svelte';
  import './konva.js'
  import {Game, games} from './script.js'

  export let prevBt = true;
  export let nextBt = true;
  export let restartBt = true;
  export let showLevel = true;
  export let level = 0;

  let container_id = `container_${Math.floor(Math.random()*1000)}`

  let level_txt = ""
  let game_container_ref;
  let game;

  onMount(() => {
    game = new Game(game_container_ref);
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
  <h3 class="level">{level_txt}</h3>
{/if}

<div id={container_id} class="froggle-container" bind:this={game_container_ref} aria-label="Froggle game canvas. This is a mouse only drag-and-drop game">
  <svg viewBox='0 0 1 1'></svg>
</div>

<div class="controls" aria-controls={container_id}>
  {#if prevBt}
    <button on:click={getHandleClick("prev")}>&lt; Prev</button>
  {/if}
  {#if restartBt}
    <button on:click={getHandleClick("restart")}>Restart</button>
  {/if}
  {#if nextBt}
    <button on:click={getHandleClick("next")}>Next &gt;</button>
  {/if}
</div>

<style>
  @import './style.css';
</style>
