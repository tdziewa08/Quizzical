import React from "react"
import { Link } from "react-router-dom"

export default function Questions() {
    return (
        <>
            <h1>QUESTIONS</h1>
            <Link to="/answers">TAKE ME TO: ANSWERS</Link>
        </>
    )
}