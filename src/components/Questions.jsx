import React from "react"
import { Link } from "react-router-dom"
import { decode } from "html-entities"

export default function Questions() {

    const [theData, setTheData] = React.useState([])
    const [correctAnswers, setTheCorrectAnswers] = React.useState([])
    const [correctCount, setCorrectCount] = React.useState(0)
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
                        return {...item, isRight: false, isUserChoice: false, allAnswers : shuffleArray([decode(item.correct_answer), ...item.incorrect_answers.map(item => decode(item))])}
                    }))
                })
            }, [])

    const questions = theData.length > 0
    ? theData.map((item, qIdx) => {
        return (
            <div className="question">
                <p>{decode(item.question)}</p>
                <div className={`answers${item.isRight ? "-correct" : "-wrong"}`}>
                    {item.allAnswers.map(answer => {
                        return (
                            <label>
                                <input
                                    // className={`${item.isRight ? "correct" : "-wrong"}`} this doesnt even work becase the allAnswers array DOES NOT contain objects...
                                    type="radio"
                                    name={`answer-${qIdx + 1}`}
                                    value={answer}
                                    required
                                />
                                {answer}
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
        // const answer1 = formData.get("answer-1")
        // const answer2 = formData.get("answer-2")
        // const answer3 = formData.get("answer-3")
        // const answer4 = formData.get("answer-4")
        // const answer5 = formData.get("answer-5")
        const userAnswers = Array.from(formData.values())
        console.log("USER ANSWERS: " + userAnswers)

        correctAnswers.find(answer => {
            userAnswers.find(userAnswer => {
                if(answer === userAnswer)
                {
                    console.log("Answer is correct!!")
                    theData.find(item => {
                        if(item.correct_answer === userAnswer)
                        {
                            console.log("I HAVE ACCESS TO THE OBJECT HERE IT IS..." + item)
                            setTheData(prevArray =>
                                prevArray.map(q =>
                                    q.correct_answer === userAnswer
                                        ? { ...q, isRight: true }
                                        : q
                                )
                            )
                        }
                    })
                }
            })
        })
        
        //set the correct answers to show up regardless of if the user chose them
        correctAnswers.find(correctAnswer => {
            theData.find(item => {
                if(item.correct_answer === correctAnswer)
                {
                    setTheData(prevArray => (
                        prevArray.map(question => (
                            q.correct_answer === correctAnswer ? {...question, isRight: true} : q
                        ))
                    ))
                }
            })
        })

        //this is kinda working but I need to be more granular. I need the specific item in allAnswers to have a boolean value changed so ONLY that option is colored RED.
        //my current method would change a boolean for the whole question object so applying the boolean to an input option would make them all colored...

        //i might ask Copilot for tips but not the whole solution




        // correctAnswers.find(correctAnswer => {
        //     userAnswers.find(userAnswer => {
        //         if(correctAnswer === userAnswer)
        //         {
        //             theData.find(item => {
        //                 if(item.allAnswers.includes(userAnswer))
        //                 {
        //                     setTheData(prevArray => (
        //                         prevArray.map(question => (

        //                         ))
        //                     ))
        //                 }
        //             })
        //             setCorrectCount(prevCount => prevCount + 1)
        //         }
        //     })
        // })

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