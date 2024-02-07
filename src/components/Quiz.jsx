import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";

const Quiz = () => {
	let user_id = localStorage.getItem("languagelearning_id");

	const [language1, setLanguage1] = useState('NL');
	const [language2, setLanguage2] = useState('EN-GB');
	const [quizType, setQuizType] = useState('all');

	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [feedback, setFeedback] = useState("");

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [sentenceOriginal, setSentenceOriginal] = useState([]);
	const [sentenceTranslated, setSentenceTranslated] = useState([]);

	const [hint1, setHint1] = useState(false);
	const [hint2, setHint2] = useState(false);
	const [hint3, setHint3] = useState(false);

	const [gameStarted, setGameStarted] = useState(false);

	const [wordIds, setWordIds] = useState([]);

	useEffect(() => {
		setOutput(questions[currentQuestionIndex]);
		setInput("");
		setFeedback("");
		setHint1(false);
		setHint2(false);
		setHint3(false);
	}, [currentQuestionIndex, questions]);

	const handleLanguage1Change = (e) => {
		setLanguage1(e.target.value);
	};

	const handleLanguage2Change = (e) => {
		setLanguage2(e.target.value);
	};

	const restartQuiz = () => {
		setCurrentQuestionIndex(0)
		setGameStarted(false)
	}

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleQuizTypeChange = (e) => {
		setQuizType(e.target.value)
	}

	const startGame = () => {
		console.log("Language 1 selected:", language1);
		console.log("Language 2 selected:", language2);

		fetch(`${process.env.REACT_APP_PATH}api/word/user/${user_id}`)
			.then((res) => res.json())
			.then((data) => {
				let filteredData
				console.log("data: ", data)
				const languageFilteredData = data.filter(item => item.sourceLanguage === language1 && item.translatedTo === language2);
				console.log("languageFilteredData: ", languageFilteredData)

				if (quizType === "wrong") {
					filteredData = languageFilteredData.filter(item => (item.statistics?.attempts !== undefined && item.statistics.attempts > 0) ?
						(item.statistics.guessedCorrectly / item.statistics.attempts < 1) :
						false)
					// filteredData = languageFilteredData.filter(item => console.log("stats:", item.statistics))
					filteredData.sort(function () { return Math.random() })
				} else if (quizType === "least_attempts") {
					filteredData = languageFilteredData.sort((a, b) => {
						return (!a.statistics && !b.statistics) ? 0 :
							(!a.statistics) ? -1 :
								(!b.statistics) ? 1 :
									a.statistics.attempts - b.statistics.attempts;
					});
				} else if (quizType === "flagged") {
					filteredData = languageFilteredData.filter(item => item.statistics.flag);
				} else {
					filteredData = languageFilteredData;
					filteredData.sort(function () { return Math.random() })
				}

				console.log("data: ", filteredData)
				setWordIds(filteredData.map(({ id }) => id));
				setQuestions(filteredData.map(({ word }) => word));
				setAnswers(filteredData.map(({ translation }) => translation));
				setSentenceOriginal(filteredData.map(({ contextSentence }) => contextSentence));
				setSentenceTranslated(filteredData.map(({ translatedContextSentence }) => translatedContextSentence));
				setGameStarted(true);
			});
	};

	const checkAnswer = (e) => {
		e.preventDefault();
		const userAnswer = input;
		let correct = false;
		const wordId = wordIds[currentQuestionIndex];
		if (userAnswer.toLowerCase() === answers[currentQuestionIndex].toLowerCase()) {
			correct = true;
			if (currentQuestionIndex + 1 <= Math.min(questions.length, 10)) {
				setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
			} else {
				setFeedback("Congratulations! You completed the quiz.");
				setInput("");
			}
		} else {
			setFeedback("Incorrect. Try again.");
		}
		fetch(`${process.env.REACT_APP_PATH}api/statistics/add_attempts/${wordId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(correct),
		})
	};

	return (
		<Container className="mt-4">
			<h1>Quiz Game with Hints</h1>
			{gameStarted && currentQuestionIndex + 1 <= Math.min(questions.length, 10) && (
				<div>
					<Button onClick={() => setHint1(!hint1)}>Hint 1</Button>
					<Button onClick={() => setHint2(!hint2)}>Hint 2</Button>
					<Button onClick={() => setHint3(!hint3)}>Hint 3</Button>

					{hint1 && (
						<div>
							<strong>hint 1</strong>:{" "}
							{Array.from(answers[currentQuestionIndex])
								.map((char) => (char === " " ? " " : "*"))
								.join("")}
						</div>
					)}
					{hint2 && (
						<div>
							<strong>hint 2</strong>: {sentenceOriginal[currentQuestionIndex]}
						</div>
					)}
					{hint3 && (
						<div>
							<strong>hint 3</strong>:{" "}
							{sentenceTranslated[currentQuestionIndex]}
						</div>
					)}

					<Form onSubmit={checkAnswer}>
						<div><strong>{language1}</strong> to <strong>{language2}</strong></div>
						<div>Question: {currentQuestionIndex + 1}</div>
						<div>Translate: {output}</div>
						<div style={{ color: "red" }}>{feedback}</div>

						<Form.Group controlId="inputBox">
							<Form.Control
								type="text"
								placeholder="Type your answer here"
								value={input}
								onChange={handleInputChange}
								style={{ width: "300px" }}
							/>
						</Form.Group>
						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</div>
			)}{" "}
			{!gameStarted && (
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%' }}>
					<label htmlFor="lang1">Choose language 1:</label>
					<select id="lang1" value={language1} onChange={handleLanguage1Change} style={{ width: '50%' }}>
						<option value="NL">NL</option>
						<option value="EN">EN</option>
						<option value="EN-GB">EN-GB</option>
						<option value="ES">ES</option>
					</select>

					<label htmlFor="lang2">Choose language 2:</label>
					<select id="lang2" value={language2} onChange={handleLanguage2Change} style={{ width: '50%' }}>
						<option value="NL">NL</option>
						<option value="EN">EN</option>
						<option value="EN-GB">EN-GB</option>
						<option value="ES">ES</option>
					</select>

					<label htmlFor="quiztype">Choose a quiz type:</label>
					<select id="quiztype" value={quizType} onChange={handleQuizTypeChange} style={{ width: '100%' }}>
						<option>Select quiz type</option>
						<option value="all">All</option>
						<option value="wrong">Top 10 wrong answers</option>
						<option value="least_attempts">Least practiced words</option>
						<option value="flagged">Flagged</option>
					</select>

					<button onClick={startGame}>Start</button>
				</div>)
			}
			{
				currentQuestionIndex > 0 && (
					<Button onClick={restartQuiz}>Restart</Button>
				)
			}
			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</Container >
	);
};

export default Quiz;
