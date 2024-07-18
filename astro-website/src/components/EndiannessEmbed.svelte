<script>
/**
 * This is an interactive element specifically created
 * for the moving-data-x64 article.
 * It showcases how the "mov ptr [src] dest" x86-64
 * assembly syntax works, wiht a live example
 * 
*/
import GdbEmbed from './GdbEmbed.svelte'

let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
let startAddress = 0;

let imm = ""
let error = ""
let immBytes = []

$: {
  let [r, err] = convertImmediateValue(imm);
  immBytes = r
  error = err
}

function bigintToBytesLE(bigIntNumber) {
    let bytes = [];
    for (let i = 0; i < 8; i++) {
        bytes.push(Number(bigIntNumber & BigInt(0xff)));
        bigIntNumber = bigIntNumber >> BigInt(8);
    }
    return bytes;
}

function convertImmediateValue(input) {
  // Define the maximum value for a 64-bit unsigned integer
  const MAX_64BIT = BigInt("0xFFFFFFFFFFFFFFFF");
  let result = [0, ""];
  if(input.length == 0){
    result[1] =  " ● missing number"
  }
  try {
    let value = BigInt(input);
    if (value <= MAX_64BIT) {
      result[0] = bigintToBytesLE(value);
    } else {
      result[1] = " ● The provided number is too large";
    }
  } catch (e) {
    result[1] = " ● Invalid input format, not a number";
  }
  return result;
}

let start_addr = 0x20

function init(){
  data = Array(14*8).fill(0)
  let text = "Example text"
  text.split("").forEach((c,i) => data[i] = c.charCodeAt(0))
  imm = "0xcafebabe11"
  error = ""
}
init();


function run(){
  console.log({imm, immBytes})
	for(let i=0; i< immBytes.length; i++)
		data[start_addr+i] = immBytes[i];
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
>
mov rbx, <span class="token number">
    <input type="text" bind:value={imm} />
  </span> <span class:error={error.length}> {error}</span>
mov rax, <span class="token number">0x20</span>
mov qword ptr [rax], rbx
</GdbEmbed>

<style>
  .error {
    background-color: rgb(105,51,61);
    color: #ffbcbc;
  }
</style>

