import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";

const Quiz = () => {
	let user_id = localStorage.getItem("languagelearning_id");

	const [language1, setLanguage1] = useState('NL');
	const [language2, setLanguage2] = useState('NL');


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

	useEffect(() => {
		setOutput(questions[currentQuestionIndex]);
		setInput("");
		setFeedback("");
		setHint1(false);
		setHint2(false);
		setHint3(false);
	}, [currentQuestionIndex, questions]);

	const handleLanguage1Change = (event) => {
		setLanguage1(event.target.value);
	};

	const handleLanguage2Change = (event) => {
		setLanguage2(event.target.value);
	};

	const restartQuiz = () => {
		setCurrentQuestionIndex(0)
		setGameStarted(false)
	}

	const startGame = () => {
		console.log("Language 1 selected:", language1);
		console.log("Language 2 selected:", language2);

		fetch(`${process.env.REACT_APP_PATH}api/word/user/${user_id}`)
			.then((res) => res.json())
			.then((data) => {
				const filteredData = data.filter(item => item.sourceLanguage === language1 && item.translatedTo === language2);
				setQuestions(filteredData.map(({ word }) => word));
				setAnswers(filteredData.map(({ translation }) => translation));
				setSentenceOriginal(filteredData.map(({ contextSentence }) => contextSentence));
				setSentenceTranslated(filteredData.map(({ translatedContextSentence }) => translatedContextSentence));
				setOutput("filteredData[0].word");
				setGameStarted(true);
			});
	};

	const checkAnswer = (e) => {
		e.preventDefault();
		const userAnswer = input;
		if (
			userAnswer.toLowerCase() === answers[currentQuestionIndex].toLowerCase()
		) {
			if (currentQuestionIndex + 1 <= Math.min(questions.length, 10)) {
				setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
			} else {
				setFeedback("Congratulations! You completed the quiz.");
				setInput("");
			}
		} else {
			setFeedback("Incorrect. Try again.");
		}
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	return (
		<Container className="mt-4">
			<h1>Quiz Game with Hints</h1>
			{gameStarted && (
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
				<div>
					<select value={language1} onChange={handleLanguage1Change}>
						<option value="NL">NL</option>
						<option value="EN">EN</option>
						<option value="EN-GB">EN-GB</option>
						<option value="ES">ES</option>
					</select>

					<select value={language2} onChange={handleLanguage2Change}>
						<option value="NL">NL</option>
						<option value="EN">EN</option>
						<option value="EN-GB">EN-GB</option>
						<option value="ES">ES</option>
					</select>

					<Button onClick={startGame}>Start</Button>
				</div>)}
			{currentQuestionIndex > 0 && (
				<Button onClick={restartQuiz}>Restart</Button>
			)}
			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</Container>
	);
};

export default Quiz;
