<script>
    export let display="common-64";
    export let expand="none";
</script>

<div class="container">
    <div class="registers">
        <div>rax: <span>00 00 00 00 00 00 00 00 </span> (return value)</div>
        {#if expand=="rax"}
            <div> <span class="trp">-----------</span>eax: <span class="tra">00 00 00 00</span> </div>
            <div> <span class="trp">-----------------</span> ax: <span class="tra">00 00</span> </div>
            <div> <span class="trp">--------------------</span> al: <span class="tra">00</span> </div>
            <div></div>
        {/if}
        {#if display=="common-64"}
            <div>rbx: <span>00 00 00 00 00 00 00 00 </span> </div>
            <div>rcx: <span>00 00 00 00 00 00 00 00 </span> (4th argument)</div>
            <div>rdx: <span>00 00 00 00 00 00 00 00 </span> (3rd argument)</div>
            <div>rsi: <span>00 00 00 00 00 00 00 00 </span> (2nd argument)</div>
            <div>rdi: <span>00 00 00 00 00 00 00 00 </span> (1st argument)</div>
            <div>rbp: <span>00 00 00 00 00 00 00 00 </span> (base pointer)</div>
            <div>rsp: <span>00 00 00 00 00 00 00 00 </span> (stack pointer)</div>
        {/if}
    </div>
</div>


<style>
    .registers{
        --default-bg-color: #1c1e24;
    }

    .container{
        display: flex;
        justify-content: center;
    }
    .trp{
        opacity:0;
    }
    .tra{
        border: 1px solid gray;
        border-radius: 4px;
        color: transparent;
        border-radius: 0 0 4px 4px;
        border-top: 0;
    }
    span{
        border: 1px solid gray;
        border-radius: 4px;
        padding: 0.1rem;
        margin: 0.1rem;
        background-color: rgba(255,255,255,0.1);
        padding: 0.1em;
    }

    .registers{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background-color: var(--default-bg-color);
        color: white;

        border-radius: 8px;
        border: 1px solid var(--light-border-color);
        padding: 0.2rem;

        font-family: var(--code-font-family);
        font-size: 0.9rem;
    }
    .registers div{
        margin: 0.1rem;
    }
    /* span{
        background-color: rgba(255,255,255,0.1);
        padding: 0.1em;
    } */
</style>
