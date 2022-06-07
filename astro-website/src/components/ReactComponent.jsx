import React from "react"

export default function reactComponent(props){
    let [counter, setCounter] = React.useState(0)

    function updateCounter(){
        setCounter(c => c + 1)
    }

    React.useEffect(()=>{
        setInterval(updateCounter, 1000)
    },[])

    let variable = "YOO, react!"
    return <>
        <p>This is a live react component. The only js in the page.</p>
        <p>this variable was received at build time: </p>
        <p>{props.name}</p>
        <h1>{variable} {counter}</h1>
        <button onClick={updateCounter}>++</button>
    </>

}
