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

let options = [
	{bytes: 1, name: "byte", reg: "bl   #note: bl is the first byte of register rbx"},
	{bytes: 2, name: "word", reg: "bx"},
	{bytes: 4, name: "dword", reg: "ebx"},
	{bytes: 8, name: "qword", reg: "rbx"},
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
	<code class="language-plaintext">mov rbx, 0x4242424242424242
	mov rax, 0x20
	mov <select bind:value={selected} on:change={updateRegions}>
		{#each options as option}
			<option value={option}>
				{option.name}
			</option>
		{/each}
		</select> ptr [rax], {selected.reg}</code>
</pre>
<div class="pos">
	<button on:click={run}>run</button>
</div>



<div class="container">
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
