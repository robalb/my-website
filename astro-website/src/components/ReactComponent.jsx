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
        <h1>{props.name}</h1>
        <h1>{variable} {counter}</h1>
        <button onClick={updateCounter}>++</button>
    </>

}
