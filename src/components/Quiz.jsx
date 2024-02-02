import React from "react";
import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";

const Quiz = () => {
	// const path = `https://language-backend.azurewebsites.net/`;
	const path = `http://localhost:8080/`;

	let user_id = localStorage.getItem("languagelearning_id");

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
	}, [currentQuestionIndex]);

	const startGame = () => {
		fetch(`${path}api/word/user/${user_id}`)
			.then((res) => res.json())
			.then((data) => {
				setQuestions(data.map((item) => item.word));
				setAnswers(data.map((item) => item.translation));
				setSentenceOriginal(data.map((item) => item.contextSentence));
				setSentenceTranslated(
					data.map((item) => item.translatedContextSentence)
				);
				setOutput(data[0].word);
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
		<div className="mt-5">
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
			{!gameStarted && <Button onClick={startGame}>Start</Button>}
			{currentQuestionIndex > 0 && (
				<Button onClick={() => setCurrentQuestionIndex(0)}>Restart</Button>
			)}
			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</div>
	);
};

export default Quiz;
