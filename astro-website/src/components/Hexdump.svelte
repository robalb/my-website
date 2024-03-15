<script>
  import { writable } from 'svelte/store';

  const count = writable(0);

	function handleClick() {
    console.log(1)
    count.update((n) => n + 1);
	}

  let countValue;
  const unsubscribe = count.subscribe((value) => {
		countValue = value;
	});

</script>


<button on:click={handleClick}>
	increment
</button>

<h1>The count is {countValue}</h1>

<div class="hexdump bytes-16">
<div class="address">
  <div>0x000aa0</div>
  <div>0x000aa0</div>
  <div>0x000aa0</div>
  <div>0x000aa0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
  <div>0x000aa0</div>
  <div>0x000aa4</div>
  <div>0x000aa8</div>
  <div>0x000ab0</div>
</div>
<div class="hex">
  <span>00</span>
  <span>10</span>
  <span>20</span>
  <span>30</span>
  <span>40</span>
  <span>50</span>
  <span>60</span>
  <span>70</span>
  <span>80</span>
  <span>90</span>
  <span>a0</span>
  <span>b0</span>
  <span>c0</span>
  <span>d0</span>
  <span>e0</span>
  <span>f0</span>
  <span>00</span>
  <span>10</span>
  <span>20</span>
  <span>30</span>
  <span>40</span>
  <span>50</span>
  <span>60</span>
  <span>70</span>
  <span>80</span>
  <span>90</span>
  <span>a0</span>
  <span>b0</span>
  <span>c0</span>
  <span>d0</span>
  <span>e0</span>
  <span>f0</span>
</div>
<div class="ascii">
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>p</span>
  <span>a</span>
  <span>g</span>
  <span>e</span>
  <span>.</span>
  <span>n</span>
  <span>o</span>
  <span>t</span>
  <span>.</span>
  <span>f</span>
  <span>0</span>
  <span>u</span>
  <span>n</span>
  <span>d</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
</div>
</div>

<style>
  .hexdump{
    --columns-padding: 0.5rem;
    --addr-text-color: white;
    --addr-bg-color: black;
    --hex-text-color: white;
    --hex-bg-color: black;
    --ascii-text-color: white;
    --ascii-bg-color: black;
    
    --divider-bar-color: gray;
    
  }

  .hexdump{
    /* ========= layout ========= */
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid var(--light-border-color);
    display: flex;
    /*centering should be configurable */
    justify-content:center;

    /* ========= style ========= */
    color: var(--code-font-color);
    font-family: var(--code-font-family);
    font-size: .9rem !important;
  }
  .hexdump
  .hexdump>div{
      background-color: var(--code-background-color);
      padding: var(--columns-padding);
  }
  .address{
        display: flex;
        flex-direction: column;
  }

        .ascii {
        letter-spacing: -0.2em;
      }

  .hex, .ascii{
    padding: 0.5rem;
contain: content;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  }
  .hex span, .ascii span{
contain: strict;
  display: inline;
  white-space: pre;
      }

  .address div{
        display: none;
      }

  .bytes-1 .hex span:nth-child(1n):after{ content: "\a"; }
  .bytes-1 .ascii span:nth-child(1n):after{ content: "\a"; }
  .bytes-1 .address div:nth-child(1n){ display: block;}
  .bytes-2 .hex span:nth-child(2n):after{ content: "\a"; }
  .bytes-2 .ascii span:nth-child(2n):after{ content: "\a"; }
  .bytes-2 .address div:nth-child(2n){ display: block;}
  .bytes-4 .hex span:nth-child(4n):after{ content: "\a"; }
  .bytes-4 .ascii span:nth-child(4n):after{ content: "\a"; }
  .bytes-4 .address div:nth-child(4n){ display: block;}
  .bytes-8 .hex span:nth-child(8n):after{ content: "\a"; }
  .bytes-8 .ascii span:nth-child(8n):after{ content: "\a"; }
  .bytes-8 .address div:nth-child(8n){ display: block;}
  .bytes-16 .hex span:nth-child(16n):after{ content: "\a"; }
  .bytes-16 .ascii span:nth-child(16n):after{ content: "\a"; }
  .bytes-16 .address div:nth-child(16n){ display: block;}

  .bytes-16 .hex span:nth-child(8n):not(span:nth-child(16n)){
    border-right: 1px solid var(--divider-bar-color);
    padding-right: 0.4em;
      }
  .bytes-16 .ascii span:nth-child(8n):not(span:nth-child(16n)){
    border-right: 1px solid var(--divider-bar-color);
    padding-right: 0.4em;
      }

  
</style>
