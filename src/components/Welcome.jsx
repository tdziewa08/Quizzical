import React from "react"
import { Link } from "react-router-dom"

export default function Welcome() {
    return (
        <div className="main-page">
            <h1>Quizzical</h1>
            <Link to="/questions">Start Quiz</Link>
        </div>
    )
}