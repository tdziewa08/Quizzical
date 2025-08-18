import React from "react"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Welcome from "./Welcome.jsx"
import Questions from "./Questions.jsx"
import Answers from "./Answers.jsx"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/answers" element={<Answers />} />
      </Routes>
    </Router>
  )
}

export default App
