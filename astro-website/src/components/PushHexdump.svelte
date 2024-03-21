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
startAddress = 0x7fffff00

let options = [
	{move: -8, name: "push"},
	{bytes: 8, name: "pop"},
]

let registers = [
	{color: "blue", name: "rsp", bytes: [0x50, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00], preview: "hex_int"},
	{color: "none", name: "rax", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
]

function hex_intPreview(bytes){
    let hexBytes = bytes.map(byte => byte.toString(16).padStart(2, '0'));
    hexBytes.reverse();
    while (hexBytes[0] === '00' && hexBytes.length > 1) {
        hexBytes.shift();
    }
    let hexString = '0x' + hexBytes.join('');
    return hexString;
}

function preview(r){
	if(r.preview == "hex_int")
		return "("+ hex_intPreview(r.bytes) +")"
	else
		return ""
}

function hexString(arr){
	return arr.map(i => ("0" + i.toString(16)).slice(-2)).join(" ")
}



/* element interaction specific code.
 This is the code that powers the current snippet logic. it's not related to
 the more generic register view */
let selected = options[0];
let color_regions = {}
let rsp_ptr_size = 8;

function bytesToInt(bytes){
	let hexStr = hex_intPreview(bytes)
	return parseInt(hexStr, 16)
}

function bytesLEToInt(bytes) {
    let result = 0;
    for (let i = bytes.length - 1; i >= 0; i--) {
        result = (result << 8) + bytes[i];
    }
    return result;
}

function intToBytesLE(number, byteCount=8) {
    let bytes = [];
    for (let i = 0; i < byteCount; i++) {
        bytes.push(number & 0xff);
        number = number >> 8;
    }
    return bytes;
}


function updateRegions(){
	let rsp_bytes = registers.find(r => r.name == "rsp").bytes
	color_regions["blue"] = [];
	for(let i=0; i< rsp_ptr_size; i++)
		color_regions["blue"].push(bytesLEToInt(rsp_bytes) + i - startAddress)
	console.log(color_regions)
}
updateRegions()

function run(){
	let rsp = registers.find(r => r.name == "rsp")
	let rax = registers.find(r => r.name == "rax")

	if(selected.name == "push"){
		//decrease rsp_ptr
		let rsp_val = bytesLEToInt(rsp.bytes)
		rsp_val -= rsp_ptr_size
		rsp.bytes = intToBytesLE(rsp_val);
		//set rax to hardcoded code value
		rax.bytes = [0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42 ]
		//put rax into pointed bytes
		for(let i=0; i< rsp_ptr_size; i++){
			data[rsp_val + i - startAddress] = rax.bytes[i]
		}
	}else{
		let rsp_val = bytesLEToInt(rsp.bytes)
		//put pointed bytes into rax
		for(let i=0; i< rsp_ptr_size; i++){
			rax.bytes[i] = data[rsp_val + i - startAddress]
		}
		//increase rsp_ptr
		rsp.bytes = intToBytesLE(rsp_val+rsp_ptr_size);

	}
	registers = registers; //force svelte reactivity update
	updateRegions()
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
		{#each registers as r}
		<div class="regdump__entry">
			<span class={"color " + r.color} >&nbsp</span>
			<span class="name">{r.name}</span>
			<span class="hex">{hexString(r.bytes)}</span>
			<span class="int">{preview(r)}</span>
		</div>
		{/each}
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
