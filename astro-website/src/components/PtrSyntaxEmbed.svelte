<script>
/**
 * This is an interactive element specifically created
 * for the moving-data-x64 article
 * 
*/
import GdbEmbed from './GdbEmbed.svelte'

let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
let startAddress = 0;

let options = [
	{bytes: 1, name: "byte", reg: "bl"},
	{bytes: 2, name: "word", reg: "bx"},
	{bytes: 4, name: "dword", reg: "ebx"},
	{bytes: 8, name: "qword", reg: "rbx"},
]
let selected = options[0];
let start_addr = 0x20
let color_regions = {}

function init(){
  data = [
    80, 97, 103, 101, 32, 110, 111, 116, 32, 102, 111, 117, 110, 100, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 64, 220, 255, 255, 1, 0, 0, 0, 88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
    0, 0, 0, 0, 0, 0, 0, 0
    ]
selected = options[0];
color_regions = {}

}
init();

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

<GdbEmbed
    on:runClick={run}
    on:resetClick={init}
    registersPanel={false}
    {data}
    showAscii={true}
    {startAddress}
    colorRegions={color_regions}
>
mov rbx, <span class="token number">0x4242424242424242</span>
mov rax, <span class="token number">0x20</span>
mov <select bind:value={selected} on:change={updateRegions}>
  {#each options as option}
    <option value={option}>
      {option.name}
    </option>
  {/each}
  </select> ptr [rax], {selected.reg}
</GdbEmbed>

