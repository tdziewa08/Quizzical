import React from "react"
import { Link } from "react-router-dom"

export default function Welcome() {
    return (
        <>
            <h1>WELCOME</h1>
            <Link to="/questions">TAKE ME TO: QUESTIONS</Link>
        </>
    )
}