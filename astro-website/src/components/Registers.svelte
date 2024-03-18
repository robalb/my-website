<script>
</script>

<div class="container">
<div class="registers">
    <div>rax: <span>0xcafebabecafebabe</span> (return value)</div>
    <div> <span class="trp">----------</span>eax: <span>cafebabe</span> </div>
    <div> <span class="trp">--------------</span> ax: <span>babe</span> </div>
    <div> <span class="trp">----------------</span> al: <span>be</span> </div>

    <div>rbx: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> </div>
    <div>rcx: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (4th argument)</div>
    <div>rdx: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (3rd argument)</div>
    <div>rsi: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (2nd argument)</div>
    <div>rdi: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (1st argument)</div>
    <div>rbp: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (base pointer)</div>
    <div>rsp: <span>0a 0a 0a 0a 0a 0a 0a 0a </span> (stack pointer)</div>
</div>

</div>

<style>
    .registers{
        --default-bg-color: #1c1e24;
    }

    .container{
        display: flex;
    }
    .trp{
        opacity:0;
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
    div.label{
        border: 1px solid gray;
    }
    span{
        background-color: rgba(255,255,255,0.1);
        padding: 0.1em;
    }
</style>
