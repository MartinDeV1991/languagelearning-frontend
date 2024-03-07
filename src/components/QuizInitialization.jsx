import React from "react";

import "./quiz.css";

const QuizInitialization = (
    { language1, language2, handleLanguage1Change, handleLanguage2Change,
        quizType, handleQuizTypeChange, startGame, handleMultipleChoiceChange,
    }) => {

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "15%",
            }}
        >
            <label htmlFor="lang1">Choose language 1:</label>
            <select
                id="lang1"
                value={language1}
                onChange={handleLanguage1Change}
                style={{ width: "50%" }}
            >
                <option value="NL">NL</option>
                <option value="EN">EN</option>
                <option value="EN-GB">EN-GB</option>
                <option value="ES">ES</option>
            </select>

            <label htmlFor="lang2">Choose language 2:</label>
            <select
                id="lang2"
                value={language2}
                onChange={handleLanguage2Change}
                style={{ width: "50%" }}
            >
                <option value="NL">NL</option>
                <option value="EN">EN</option>
                <option value="EN-GB">EN-GB</option>
                <option value="ES">ES</option>
            </select>

            <label htmlFor="quiztype">Choose a quiz type:</label>
            <select
                id="quiztype"
                value={quizType}
                onChange={handleQuizTypeChange}
                style={{ width: "100%" }}
            >
                <option>Select quiz type</option>
                <option value="all">All words</option>
                <option value="wrong">Top 10 wrong answers</option>
                <option value="least_attempts">Least practiced words</option>
                <option value="flagged">Flagged</option>
            </select>

            <label className="mt-2 mb-2" htmlFor="multiple-choice">
            <input id="multiple-choice" type="checkbox" onClick={handleMultipleChoiceChange}></input>
              Multiple choice</label>
            <button onClick={startGame}>Start</button>
        </div>
    )
};


export default QuizInitialization;