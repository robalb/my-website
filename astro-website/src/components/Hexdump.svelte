<script>
  const centered = true;
  let range_bytes = 4;
  let bytes_per_row = 16;

  $: bytes_per_row = Math.pow(2, range_bytes);

  const data = [];
  for(let i=0; i< 200; i++){
    data[i] = i%255;
  }
  const start_address = 0x0;

  function ascii(number){
    if (number >= 32 && number <= 126) {
        return String.fromCharCode(number);
    } else {
        return ".";
    }
  }

  function range(number){
    return "zero"
  }

</script>


<div class="container">
<input type="range" bind:value={range_bytes} min="0" max="4" step="1" />
<p>{bytes_per_row}</p>

<div class="hexdump" 
  class:hexdump--center={centered}
  class:hexdump--bytes-16={bytes_per_row === 16}
  class:hexdump--bytes-8={bytes_per_row === 8}
  class:hexdump--bytes-4={bytes_per_row === 4}
  class:hexdump--bytes-2={bytes_per_row === 2}
  class:hexdump--bytes-1={bytes_per_row === 1}
  >
<div class="hexdump__address">
		{#each data as _, i}
      <div>{("0000000" + i.toString(16)).slice(-8)}</div>
		{/each}
</div>
<div class="hexdump__hex hexdump__responsivecol">
		{#each data as d, i}
      <span
        data-range={range(d)}
      >{("0" + d.toString(16)).slice(-2)}</span>
		{/each}
</div>
<div class="hexdump__ascii hexdump__responsivecol">
		{#each data as d, i}
      <span
        data-ascii={ascii(d) != "."}
      >{ascii(d)}</span>
		{/each}
</div>
</div>
</div>

<style>
      .container{

    }
  .hexdump{
    --columns-padding: 0.5rem;
    --hex-spacing: 0.4rem;
    --ascii-spacing: 0.00rem;

    --addr-text-color: white;
    --addr-bg-color: black;

    --hex-text-color: #b3b9c5;
    --hex-zero-color: #818a9d;
    --hex-bg-color: black;

    --ascii-valid-color: #6ab0f3;
    --ascii-invalid-color: #b3b9c5;
    --ascii-bg-color: black;
    
    --divider-bar-color: gray;
    
  }

  .hexdump{
    /* ========= layout ========= */
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid var(--light-border-color);
    display: flex;
     container-type: inline-size;

    /* ========= style ========= */
    color: var(--code-font-color);
    font-family: var(--code-font-family);
    font-size: .9rem !important;
  }
  .hexdump--center{
    justify-content:center;
    }

  .hexdump>div{
      background-color: var(--code-background-color);
      padding: var(--columns-padding);
  }

  .hexdump__address{
        display: flex;
        flex-direction: column;
  }
  .hexdump__address div{
        display: none;
      }

  .hexdump__hex span{
    color: var(--hex-text-color);
  }
  .hexdump__hex span[data-zero="true"]{
    color: var(--hex-zero-color);
  }

  .hexdump__hex span{
    padding: 0 var(--hex-spacing);
  }
  .hexdump__ascii span{
    padding: 0 var(--ascii-spacing);
    color: var(--ascii-invalid-color);
  }
  .hexdump__ascii span[data-ascii="true"]{
    color: var(--ascii-valid-color);
  }

  .hexdump__responsivecol{
  contain: content;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  }
  .hexdump__responsivecol span{
contain: strict;
  display: inline;
  white-space: pre;
      }



  .hexdump--bytes-1 .hexdump__responsivecol span:nth-child(1n):after{ content: "\a"; }
  .hexdump--bytes-1 .hexdump__address div:nth-child(1n){ display: block;}

  .hexdump--bytes-2 .hexdump__responsivecol span:nth-child(2n):after{ content: "\a"; }
  .hexdump--bytes-2 .hexdump__address div:nth-child(2n+1){ display: block;}

  .hexdump--bytes-4 .hexdump__responsivecol span:nth-child(4n):after{ content: "\a"; }
  .hexdump--bytes-4 .hexdump__address div:nth-child(4n+1){ display: block;}

  .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(8n):after{ content: "\a"; }
  .hexdump--bytes-8 .hexdump__address div:nth-child(8n+1){ display: block;}


  @container (width <= 400px) {
    /* 8 bytes on this size is disabled, behaves exaclty like 4 bytes */
    .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(4n):after{ content: "\a"; }
    .hexdump--bytes-8 .hexdump__address div:nth-child(4n+1){ display: block;}
    /* 16 bytes on this size is disabled, behaves exaclty like 4 bytes */
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(4n):after{ content: "\a"; }
    .hexdump--bytes-16 .hexdump__address div:nth-child(4n+1){ display: block;}
  }

  @container (400px <= width <= 740px) {
    /* enable 8 bytes on this size */
    .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(8n):after{ content: "\a"; }
    .hexdump--bytes-8 .hexdump__address div:nth-child(8n+1){ display: block;}

    /* 16 bytes on this size is disabled, behaves exaclty like 8 bytes */
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(8n):after{ content: "\a"; }
    .hexdump--bytes-16 .hexdump__address div:nth-child(8n+1){ display: block;}
  }


  @container (min-width: 740px) {
    /* enables 16 bytes on this size*/
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(16n):after{ content: "\a"; }
    .hexdump--bytes-16 .hexdump__address div:nth-child(16n+1){ display: block;}

    .hexdump--bytes-16 .hexdump__hex span:nth-child(8n):not(span:nth-child(16n)){
      border-right: 1px solid var(--divider-bar-color);
      }
    .hexdump--bytes-16 .hexdump__ascii span:nth-child(8n):not(span:nth-child(16n)){
      border-right: 1px solid var(--divider-bar-color);
      }
  }
  
</style>
