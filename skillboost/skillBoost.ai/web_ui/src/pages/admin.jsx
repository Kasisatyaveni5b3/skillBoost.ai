export default function Admin({setMessage}) {
    return (
        <input placeholder="enter your name" onChange={(e) => setMessage(e.target.value)}/>
    )
}