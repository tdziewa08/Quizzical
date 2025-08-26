import React from "react"
import { Link } from "react-router-dom"
import { decode } from "html-entities"

export default function Questions() {

    const [theData, setTheData] = React.useState([])
    const [correctAnswers, setTheCorrectAnswers] = React.useState([])
    console.log("CORRECT ANSWERS: " + correctAnswers)

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
                setTheCorrectAnswers(data.results.map(item => decode(item.correct_answer)))
                setTheData(
                    [...data.results].map(item => {
                        return {...item, allAnswers : shuffleArray([item.correct_answer, ...item.incorrect_answers])}
                    }))
                })
            }, [])

    const questions = theData.length > 0
    ? theData.map((item, qIdx) => {
        return (
            <div className="question">
                <p>{decode(item.question)}</p>
                <div className="answers">
                    {item.allAnswers.map(answer => {
                        return (
                            <label>
                                <input
                                    type="radio"
                                    name={`answer-${qIdx + 1}`}
                                    value={decode(answer)}
                                    required
                                />
                                {decode(answer)}
                            </label>
                        )
                    })}
                </div>
            </div>
        )
    })
    : null

    function checkAnswers(e) {
        e.preventDefault()
        console.log("Submitted but not refreshed")
        const form = e.target
        const formData = new FormData(form)
        const answer1 = formData.get("answer-1")
        const answer2 = formData.get("answer-2")
        const answer3 = formData.get("answer-3")
        const answer4 = formData.get("answer-4")
        const answer5 = formData.get("answer-5")
        const userAnswers = Array.from(formData.values())
        console.log("USER ANSWERS: " + userAnswers)

        for(let i = 0; i < correctAnswers.length; i++)
        {
            if(userAnswers[i] === correctAnswers[i])
            {
                console.log("CORRECT DUING DING DING")
            }
        }
    }

    return (
        <>
            <form className="questions-container" onSubmit={checkAnswers}>
                {questions}
                <button>Check Your Answers</button>
            </form>
            <Link to="/answers">TAKE ME TO: ANSWERS</Link>
        </>
    )
}

//I need to find out what properties I need to use in order to signal to the user and JS to switch a value and have the UI change
//Current for loop kind of works but only for checking if every answer is correct