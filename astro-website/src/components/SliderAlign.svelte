<script>
	/**
	 * This is an interactive element specifically created
	 * for the moving-data-x64 article
	 * 
	*/
import Hexdump from './Hexdump.svelte'

export let centered = true;
export let data = [
  0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x20,
  0x61, 0x73, 0x63, 0x69, 0x69, 0x20, 0x74, 0x65,
  0x78, 0x74, 0, 0, 0, 0, 0, 0,
  233, 81, 85, 85, 85, 85, 0, 0,
  0xbe, 0xba, 0xfe, 0xca, 0, 0, 0, 0,
    88, 220, 255, 255, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 4, 190, 18, 120, 233, 111, 224, 88, 220, 255, 255, 255, 127, 0, 0, 233, 81, 85, 85, 85, 85, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 64, 208, 255, 247, 255, 127, 0, 0, 232, 4, 28, 164, 135, 22, 144, 31,
  232, 4, 52, 40, 253, 6, 144, 31, 0, 0, 0, 0, 255, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 158, 135, 93, 202, 47, 126, 0, 0, 0, 0, 0, 0, 0, 0, 64, 158, 194, 247, 255, 127, 0, 0, 104, 220, 255, 255, 255, 127, 0, 0, 152, 125, 85, 85, 85, 85, 0, 0, 224, 226, 255, 247, 255, 127, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 85, 85, 85, 85, 0, 0,
  ]
export let strData = "";
export let showAscii = true;
export let startAddress = 0;
export let colorRegions = {
  };

export let sliderStart = 0;

let range_val = sliderStart;
let data_aligned = data

$: data_aligned = data.slice(range_val)

let stack_ptr = 19*8
let cafebabe_ptr = 4*8


$: {
    let a = stack_ptr-range_val
    let b = cafebabe_ptr-range_val
    colorRegions= {
      red: [a,
        a+1,
        a+2,
        a+3,
        a+4,
        a+5,
        a+6,
        a+7,
      ],
      blue: [
        b,
        b+1,
        b+2,
        b+3,
      ]
    }
    colorRegions = colorRegions//trigger reactivity

  }


</script>

<div class="controls">
<input type="range" min=0 max=20 bind:value={range_val} />
<p>
  showing memory from address <code>0x{(startAddress+range_val).toString(16)}</code>
</div>

<div class="hexcontainer">
  <Hexdump client:load 
    bytesPerRow={16}
    {centered}
    data={data_aligned}
    {strData}
    {showAscii}
    startAddress={startAddress+range_val}
    {colorRegions}
  />
</div>

<style>
.controls{
  display:flex;
  flex-direction: column;
  align-items: center;
}
.hexcontainer {
  max-height: 350px;
  overflow: scroll;
}



/* === range theme and appearance === */
/* https://codepen.io/ShadowShahriar/pen/zYPPYrQ */
input[type="range"] {
	font-size: 1.2rem;
	width: 10.5em;
}

input[type="range"] {
	color: var(--primary);
	--thumb-height: 1.125em;
	--track-height: 0.125em;
	--track-color: rgba(0, 0, 0, 0.4);
	--brightness-hover: 180%;
	--brightness-down: 80%;
	--clip-edges: 0.125em;
}

@media (prefers-color-scheme: dark) {
	html {
		background-color: #000;
	}

	html::before {
		background: radial-gradient(circle at center, #101112, #000);
	}

	input[type="range"] {
    color: var(--primary);
		--track-color: rgba(255, 255, 255, 0.1);
	}
}

/* === range commons === */
input[type="range"] {
	position: relative;
	background: #fff0;
	overflow: hidden;
}

input[type="range"]:active {
	cursor: grabbing;
}

input[type="range"]:disabled {
	filter: grayscale(1);
	opacity: 0.3;
	cursor: not-allowed;
}

/* === WebKit specific styles === */
input[type="range"],
input[type="range"]::-webkit-slider-runnable-track,
input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	transition: all ease 100ms;
	height: var(--thumb-height);
}

input[type="range"]::-webkit-slider-runnable-track,
input[type="range"]::-webkit-slider-thumb {
	position: relative;
}

input[type="range"]::-webkit-slider-thumb {
	--thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
	--clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
	--clip-bottom: calc(var(--thumb-height) - var(--clip-top));
	--clip-further: calc(100% + 1px);
	--box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
		100vmax currentColor;

	width: var(--thumb-width, var(--thumb-height));
	background: linear-gradient(currentColor 0 0) scroll no-repeat left center /
		50% calc(var(--track-height) + 1px);
	background-color: currentColor;
	box-shadow: var(--box-fill);
	border-radius: var(--thumb-width, var(--thumb-height));

	filter: brightness(100%);
	clip-path: polygon(
		100% -1px,
		var(--clip-edges) -1px,
		0 var(--clip-top),
		-100vmax var(--clip-top),
		-100vmax var(--clip-bottom),
		0 var(--clip-bottom),
		var(--clip-edges) 100%,
		var(--clip-further) var(--clip-further)
	);
}

input[type="range"]:hover::-webkit-slider-thumb {
	filter: brightness(var(--brightness-hover));
	cursor: grab;
}

input[type="range"]:active::-webkit-slider-thumb {
	filter: brightness(var(--brightness-down));
	cursor: grabbing;
}

input[type="range"]::-webkit-slider-runnable-track {
	background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
		100% calc(var(--track-height) + 1px);
}

input[type="range"]:disabled::-webkit-slider-thumb {
	cursor: not-allowed;
}

/* === Firefox specific styles === */
input[type="range"],
input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-thumb {
	appearance: none;
	transition: all ease 100ms;
	height: var(--thumb-height);
}

input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-thumb,
input[type="range"]::-moz-range-progress {
	background: #fff0;
}

input[type="range"]::-moz-range-thumb {
	background: currentColor;
	border: 0;
	width: var(--thumb-width, var(--thumb-height));
	border-radius: var(--thumb-width, var(--thumb-height));
	cursor: grab;
}

input[type="range"]:active::-moz-range-thumb {
	cursor: grabbing;
}

input[type="range"]::-moz-range-track {
	width: 100%;
	background: var(--track-color);
}

input[type="range"]::-moz-range-progress {
	appearance: none;
	background: currentColor;
	transition-delay: 30ms;
}

input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-progress {
	height: calc(var(--track-height) + 1px);
	border-radius: var(--track-height);
}

input[type="range"]::-moz-range-thumb,
input[type="range"]::-moz-range-progress {
	filter: brightness(100%);
}

input[type="range"]:hover::-moz-range-thumb,
input[type="range"]:hover::-moz-range-progress {
	filter: brightness(var(--brightness-hover));
}

input[type="range"]:active::-moz-range-thumb,
input[type="range"]:active::-moz-range-progress {
	filter: brightness(var(--brightness-down));
}

input[type="range"]:disabled::-moz-range-thumb {
	cursor: not-allowed;
}

</style>

