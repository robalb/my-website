<script>
import Hexdump from './Hexdump.svelte'


export let centered = true;
export let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
export let strData = "";
export let showAscii = true;
export let startAddress = 0;
export let colorRegions = {};

data = [
  80, 97, 103, 101, 32, 110, 111, 116, 32, 102, 111, 117, 110, 100, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 64, 220, 255, 255, 1, 0, 0, 0, 88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
  232, 4, 52, 40, 253, 6, 144, 31, 0, 0, 0, 0, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 158, 135, 93, 202, 47, 126, 0, 0, 0, 0, 0, 0, 0, 0, 64, 158, 194, 247, 255, 127, 0, 0, 104, 220, 255, 255, 255, 127, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 224, 226, 255, 247, 255, 127, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 85, 85, 85, 85, 0, 0 
  ]
startAddress = 0xffffff00

let options = [
	{bytes: 1, name: "push", reg: "bl   #note: bl is the first byte of register rbx"},
	{bytes: 2, name: "pop", reg: "bx"},
]
let selected = options[0];
let start_addr = 0x20
let color_regions = {}

function updateRegions(){
	color_regions["blue"] = [];
	for(let i=0; i< selected.bytes; i++)
		color_regions["blue"].push(start_addr + i)
}
updateRegions()

function run(){
	for(let i=0; i< selected.bytes; i++)
		data[start_addr+i] = 0x42;
	data = data;
}

</script>

<pre class="language-plaintext">
	<code class="language-plaintext">mov rax, 0x4242424242424242
	<select bind:value={selected} on:change={updateRegions}>
		{#each options as option}
			<option value={option}>
				{option.name}
			</option>
		{/each}
		</select> rax</code>
</pre>
<div class="pos">
	<button on:click={run}>run</button>
</div>



<div class="regcontainer">
	<div class="regdump">
		<div class="regdump__entry">
			<span class="color blue">+</span>
			<span class="name">rsp</span>
			<span class="hex">00 00 00 00 00 00 00 00</span>
			<span class="int">(0xffffff00)</span>
		</div>
		<div class="regdump__entry">
			<span class="color ">&nbsp;</span>
			<span class="name">rax</span>
			<span class="hex">00 00 00 00 00 00 00 00</span>
			<span class="int">(0x00)</span>
		</div>
	</div>
</div>
<br />

<div class="hexcontainer">
	 {#key color_regions}
  <Hexdump
    bytesPerRow={16}
    {centered}
    {data}
    {strData}
    {showAscii}
    {startAddress}
    colorRegions={color_regions}
  />
  {/key}
</div>

<style>

	/** register preview TODO: move all this to a dedicated component, with proper BEM*/
	.regcontainer{
		display: flex;
	}
	.hexcontainer {
	max-height: 400px;
	overflow: scroll;
	}
	.regdump{
		--default-bg-color: #1c1e24;
		/* these colors must be shared with hexdump when this is a standalone component*/
		--section-blue-color: #3e296c;
		--section-red-color: #640054;
		--section-green-color: green;
		--section-border-radius: 6px;

		--mark-border-color: gray;
	}
	.regdump{
		background-color: var(--code-background-color);
		color: var(--code-font-color);
		font-family: var(--code-font-family);
		font-size: 0.9rem;
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid var(--light-border-color);
	}
	.regdump__entry{
		margin: 0.1rem;
		margin-bottom: 0.2rem;
	}
	.regdump__entry .color{
		border-radius: 100px;
		background-color: transparent;
		color: transparent;
		padding: 0 0.3rem;
		border: 1px solid transparent;
	}
	.regdump__entry .name{
	}
	.regdump__entry .hex{
		border: 1px solid rgba(255,255,255, 0.1);
		background-color: rgba(0,0,0,0.3);
		margin-left: 1rem;
		margin-right: 1rem;
		padding: 0 0.5rem;
	}
	.regdump__entry .int{
	}
	/*custom section colors */
	.regdump__entry .color.blue{
		background-color: var(--section-blue-color);
		color: var(--section-blue-color);
		border-color: var(--mark-border-color);
	}
	.regdump__entry .color.green{
		background-color: var(--section-green-color);
		color: var(--section-blue-color);
		border-color: var(--mark-border-color);
	}
	.regdump__entry .color.red{
		background-color: var(--section-red-color);
		color: var(--section-blue-color);
		border-color: var(--mark-border-color);
	}


	div.pos{
		float:right;
		height:0;
	}
	button{
		position: relative;
		top: -80px;
		right: 10px;
		background-color: #f0f0f0;
		padding: 0.5rem;
		border: 2px solid transparent;
	}
	button:hover{
		opacity: .4;
	}
	button:active{
		border: 0px;
	}
</style>
