import React from "react"
import { decode } from "html-entities"

export default function Questions() {

    const [theData, setTheData] = React.useState([])
    const [correctAnswers, setTheCorrectAnswers] = React.useState([])
    const [correctCount, setCorrectCount] = React.useState(0)
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [newGame, setNewGame] = React.useState(false)

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--)
            {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        return array;
    }

    function checkAnswers(e) {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const userAnswers = Array.from(formData.values())

        setTheData(prevArray => (
            prevArray.map((question, qIdx) => {
                const correctAnswer = correctAnswers[qIdx]
                const userAnswer = userAnswers[qIdx]

                return {
                    ...question,
                    allAnswers: question.allAnswers.map(answer => (
                        {
                            ...answer,
                            isCorrect: answer.text === correctAnswer,
                            isChosen: answer.text === userAnswer
                        }
                    ))
                }
            })
        ))
        
        let newCorrectCount = 0
        userAnswers.forEach((ans, idx) => {
            if(ans === correctAnswers[idx])
            {
                newCorrectCount +=1
            }
        })
        setCorrectCount(newCorrectCount)
        setIsSubmitted(true)
    }

    function handleSelect(qIdx, answerText) {
        if(!isSubmitted)
        {
            setTheData(prevArray =>
                prevArray.map((question, idx) =>
                    idx === qIdx
                    ?
                    {
                        ...question,
                        allAnswers: question.allAnswers.map(a => ({
                            ...a,
                            isChosen: a.text === answerText
                        }))
                    }
                    :
                    question
                )
            );
        }
    }

    function resetGame() {
        setTheData([])
        setTheCorrectAnswers([])
        setCorrectCount(0)
        setNewGame(prevValue => !prevValue)
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
                            <label
                                className=
                                {
                                    "label-button" +
                                    (answer.isChosen && !isSubmitted ? " -selected" : "") +
                                    (answer.isChosen && isSubmitted && !answer.isCorrect ? " -chosen" : "") +
                                    (answer.isCorrect && isSubmitted ? " -correct" : "")
                                }
                            >
                                <input 
                                    type="radio"
                                    name={`answer-${qIdx + 1}`}
                                    value={answer.text}
                                    checked={answer.isChosen}
                                    disabled={isSubmitted}
                                    onChange={() => handleSelect(qIdx, answer.text)}
                                    required
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

    return (
        <>
            {theData.length === 0 && <div className="loading-screen">Loading Questions...</div>}
            <form className="questions-container" onSubmit={checkAnswers}>
                {questions}
                <div className="results">
                    {(isSubmitted && theData.length > 0) &&
                        <>
                            <p>You scored {correctCount}/5 correct answers</p>
                            <button type="button" className="game-btn" onClick={resetGame}>Play Again</button>
                        </>
                    }
                    {(!isSubmitted && theData.length > 0) &&
                        <button type="submit" className="game-btn">Check Your Answers</button>
                    }
                </div>
            </form>
        </>
    )
}