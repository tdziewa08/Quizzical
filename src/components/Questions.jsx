import React from "react"
import { Link } from "react-router-dom"
import { decode } from "html-entities"

export default function Questions() {

    const [theData, setTheData] = React.useState([])

    function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    return array;
}

    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                setTheData(
                    [...data.results].map(item => {
                        return {...item, allAnswers : shuffleArray([item.correct_answer, ...item.incorrect_answers])}
                    }))
                })
            }, [])

    const questions = theData.length > 0
    ? theData.map(item => {
        return (
            <div className="question">
                <p>{decode(item.question)}</p>
                <div className="answers">
                    {item.allAnswers.map(answer => {
                        return <span>{decode(answer)}</span>
                    })}
                </div>
            </div>
        )
    })
    : null

    return (
        <>
            <div className="questions-container">
                {questions}
            </div>
            <Link to="/answers">TAKE ME TO: ANSWERS</Link>
        </>
    )
}