<script>
</script>

<div class="container">
<div class="registers">
    <div>rax: <span>0a 0a 0a 0a </span> eax: <span>0a 0a 0a 0a</span> (return value)</div>
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
    span{
        background-color: rgba(255,255,255,0.1);
        padding: 0.1em;

    }
</style>
