<script>
import Hexdump from './Hexdump.svelte';

const start_address = 0xffffdb90;
let data =[
  80, 97, 103, 101, 32, 110, 111, 116, 32, 102, 111, 117, 110, 100, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 64, 220, 255, 255, 1, 0, 0, 0, 88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
  232, 4, 52, 40, 253, 6, 144, 31, 0, 0, 0, 0, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 158, 135, 93, 202, 47, 126, 0, 0, 0, 0, 0, 0, 0, 0, 64, 158, 194, 247, 255, 127, 0, 0, 104, 220, 255, 255, 255, 127, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 224, 226, 255, 247, 255, 127, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 85, 85, 85, 85, 0, 0
]

  let index = 0;
  function update(){
  console.log("update" + index)
    data[index] = 0x61
    if(index < data.length){
      index++
      setTimeout(update, 100)
    }
  }

let input_text = "Page not found";

let hexConfig = {}
$: hexConfig = {
  centered: true,
  bytesPerRow: 16,
  startAddress: start_address,
  data: data
}

function handleChange(e){
    let value = e.target.value
    for(let i=0; i< value.length; i++){
      let c = (value.charCodeAt(i))
      data[i] = c;
    }
}

</script>

<div>
<input class="description" type="text" value={"Page not found"} on:keydown={handleChange} />
</div>
<br />

<Hexdump {...hexConfig} />

<style>
  div{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content:center;
  }
  input{
  background-color: transparent;
  border: 0;
  }
</style>

