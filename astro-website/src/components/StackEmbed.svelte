<script>
/**
 * This is an interactive element specifically created
 * for the moving-data-x64 article.
 * It showcases how the stack works when "push" or "pop" is executed
 * in the x86-64 architecture
 * 
*/
import GdbEmbed from './GdbEmbed.svelte'

let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
let startAddress = 0x7fffff00;

let options = [
	{move: -8, name: "push"},
	{bytes: 8, name: "pop"},
]

let registers = [
	{color: "blue", name: "rsp", bytes: [0x50, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00], preview: "hex_int"},
	{color: "blue", name: "rax", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
]

let selected = options[0];
let color_regions = {}
let rsp_ptr_size = 8;

function init(){
  data = [
    80, 97, 103, 101, 32, 110, 111, 116, 32, 102, 111, 117, 110, 100, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 64, 220, 255, 255, 1, 0, 0, 0, 88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
    232, 4, 52, 40, 253, 6, 144, 31, 0, 0, 0, 0, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 158, 135, 93, 202, 47, 126, 0, 0, 0, 0, 0, 0, 0, 0, 64, 158, 194, 247, 255, 127, 0, 0, 104, 220, 255, 255, 255, 127, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 224, 226, 255, 247, 255, 127, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 85, 85, 85, 85, 0, 0 
    ]
  registers = [
    {color: "blue", name: "rsp", bytes: [0x50, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00], preview: "hex_int"},
    {color: "blue", name: "rax", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
  ]
  updateRegions()
}
init();

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
	for(let i=0; i< data.length; i++)
		color_regions["blue"].push(bytesLEToInt(rsp_bytes) + i - startAddress)
}

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



<GdbEmbed
    on:runClick={run}
    on:resetClick={init}
    {data}
    {registers}
    showAscii={true}
    {startAddress}
    colorRegions={color_regions}
>
mov rax, 0x4242424242424242
<select bind:value={selected} on:change={updateRegions}>
  {#each options as option}
    <option value={option}>
      {option.name}
    </option>
  {/each}
  </select> rax
</GdbEmbed>

<style>
</style>
