import React from "react"
import { Link } from "react-router-dom"
import { decode } from "html-entities"

export default function Questions() {

    const [theData, setTheData] = React.useState([])
    const [correctAnswers, setTheCorrectAnswers] = React.useState([])
    const [correctCount, setCorrectCount] = React.useState(0)
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [newGame, setNewGame] = React.useState(false)

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
                        return {
                            ...item,
                            allAnswers: shuffleArray(
                                [
                                    {text: decode(item.correct_answer), isChosen: false, isCorrect: false},
                                    ...item.incorrect_answers.map(item => ({text: decode(item), isChosen: false, isCorrect: false}))
                                ]
                            )
                        }
                    }))
                })
                setIsSubmitted(false)
            }, [newGame])

    const questions = theData.length > 0
    ? theData.map((item, qIdx) => {
        return (
            <div className="question">
                <p>{decode(item.question)}</p>
                <div className="answers">
                    {item.allAnswers.map(answer => {
                        return (
                            <label className={`label-button ${answer.isChosen ? "-chosen" : ""} ${answer.isCorrect ? "-correct" : ""}`}>
                                <input 
                                    type="radio"
                                    name={`answer-${qIdx + 1}`}
                                    value={answer.text}
                                    required
                                    disabled={isSubmitted}
                                />
                                {answer.text}
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
        const userAnswers = Array.from(formData.values())
        console.log("USER ANSWERS: " + userAnswers)

        //set isCorrect to update UI with the correct answers
         correctAnswers.find(correctAnswer => {
             theData.find(item => {
                 if(item.correct_answer === correctAnswer)
                 {
                     setTheData(prevArray => (
                         prevArray.map(question => ({
                            ...question,
                            allAnswers: question.allAnswers.map(answer => (
                                answer.text === correctAnswer ? {...answer, isCorrect: true} : answer
                            ))
                         }   
                         ))
                     ))
                 }
             })
         })

        //set isChosen to update UI with user choices
        userAnswers.find(userAnswer => {
            theData.map(question => {
                question.allAnswers.find(answer => {
                    if(userAnswer === answer.text)
                    {
                        setTheData(prevArray =>
                            prevArray.map(question => ({
                                ...question,
                                allAnswers: question.allAnswers.map(answer =>
                                    userAnswers.includes(answer.text)
                                        ? { ...answer, isChosen: true }
                                        : answer
                                )
                            }))
                        )
                    }
                })
            })
        })

        userAnswers.find((userAnswer, uIdx) => {
            correctAnswers.find((correctAnswer, cIdx) => {
                if(userAnswer === correctAnswer && uIdx === cIdx)
                {
                    setCorrectCount(prevCount => prevCount + 1)
                }
            })
        })

        setIsSubmitted(true)
        e.target.reset();
    }

    function resetGame() {
        setTheData([])
        setTheCorrectAnswers([])
        setCorrectCount(0)
        setNewGame(prevValue => !prevValue)
    }

    return (
        <>
            <form className="questions-container" onSubmit={checkAnswers}>
                {questions}
                {!isSubmitted ? <button type="submit">Check Your Answers</button> : <button type="button" onClick={() => resetGame()}>Play Again</button>}
                <p>Correct Answers {correctCount} / 5</p>
            </form>
            <Link to="/answers">TAKE ME TO: ANSWERS</Link>
        </>
    )
}