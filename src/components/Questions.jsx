import React from "react"
import { Link } from "react-router-dom"

export default function Questions() {

    const [theData, setTheData] = React.useState([])

    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=10")
            .then(res => res.json())
            .then(data => {
                console.log(data.results)
                setTheData([...data.results])
            })
        }, [])

    console.log("I AM theData... " + theData)

    const questions = theData.length > 0
    ? theData.map(item => {
        return (
            <div>
                <h3>{item.question}</h3>
                <p>{item.correct_answer}</p>
            </div>
        )
    })
    : null

    return (
        <>
            <h1>QUESTIONS</h1>
            {questions}
            <Link to="/answers">TAKE ME TO: ANSWERS</Link>
        </>
    )
}