import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";
import { fetchData, putData } from "utils/api";
import QuizInitialization from "./QuizInitialization";

const Quiz = () => {
	let user_id = localStorage.getItem("languagelearning_id");

	const [language1, setLanguage1] = useState("NL");
	const [language2, setLanguage2] = useState("EN-GB");
	const [quizType, setQuizType] = useState("all");

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

	const [attempts, setAttempts] = useState(0);

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
		setCurrentQuestionIndex(0);
		setGameStarted(false);
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleQuizTypeChange = (e) => {
		setQuizType(e.target.value);
	};

	const startGame = async () => {
		try {
			const data = await fetchData(`api/word/user/${user_id}`);
			let filteredData;
			const languageFilteredData = data.filter(
				(item) =>
					item.sourceLanguage === language1 && item.translatedTo === language2
			);

			if (quizType === "wrong") {
				filteredData = languageFilteredData.filter((item) =>
					item.statistics?.attempts !== undefined &&
						item.statistics.attempts > 0
						? item.statistics.guessedCorrectly / item.statistics.attempts < 1
						: false
				);
				filteredData.sort(() => Math.random() - 0.5);
			} else if (quizType === "least_attempts") {
				filteredData = languageFilteredData.sort((a, b) => {
					return !a.statistics && !b.statistics
						? 0
						: !a.statistics
							? -1
							: !b.statistics
								? 1
								: a.statistics.attempts - b.statistics.attempts;
				});
			} else if (quizType === "flagged") {
				filteredData = languageFilteredData.filter(
					(item) => item.statistics?.flag
				);
				filteredData.sort(() => Math.random() - 0.5);
			} else {
				filteredData = languageFilteredData;
				filteredData.sort(() => Math.random() - 0.5);
			}

			setWordIds(filteredData.map(({ id }) => id));
			setQuestions(filteredData.map(({ word }) => word));
			setAnswers(filteredData.map(({ translation }) => translation));
			setSentenceOriginal(
				filteredData.map(({ contextSentence }) => contextSentence)
			);
			setSentenceTranslated(
				filteredData.map(
					({ translatedContextSentence }) => translatedContextSentence
				)
			);
			setGameStarted(true);
		} catch (error) {
			console.log(error);
		}
	};

	const checkAnswer = async (e) => {
		e.preventDefault();
		const userAnswer = input;
		let correct = false;
		const wordId = wordIds[currentQuestionIndex];
		if (
			userAnswer.toLowerCase() === answers[currentQuestionIndex].toLowerCase()
		) {
			correct = true;
			if (currentQuestionIndex + 1 <= Math.min(questions.length, 10)) {
				setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
				setAttempts(0);
			} else {
				setFeedback("Congratulations! You completed the quiz.");
				setInput("");
			}
		} else {
			if (attempts >= 2) {
				if (currentQuestionIndex + 1 <= Math.min(questions.length, 10)) {
					setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
					setAttempts(0);
				} else {
					setFeedback("Congratulations! You completed the quiz.");
					setInput("");
				}
			} else {
				setFeedback("Incorrect. Try again.");
				setAttempts(attempts + 1);
			}
		}
		await putData(`api/statistics/add_attempts/${wordId}`, correct);
	};

	return (
		<Container className="mt-4">
			<h1>Quiz Game with Hints</h1>
			{gameStarted &&
				currentQuestionIndex + 1 <= Math.min(questions.length, 10) && (
					<div>
						<div className="mb-3">
							<strong>
								{language1}
							</strong>{" "}
							to{" "}
							<strong>
								{language2}
							</strong>
						</div>

						<Form onSubmit={checkAnswer} className="mb-5">
							<div><strong>Question #{currentQuestionIndex + 1}</strong></div>
							<div>Translate: <strong>{output}</strong></div>
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
						<div>You have had {attempts} attempts for this question.</div>

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
								<strong>hint 2</strong>:{" "}
								{sentenceOriginal[currentQuestionIndex]}
							</div>
						)}
						{hint3 && (
							<div>
								<strong>hint 3</strong>:{" "}
								{sentenceTranslated[currentQuestionIndex]}
							</div>
						)}

					</div>
				)}{" "}
			{currentQuestionIndex > 0 && (
				<Button onClick={restartQuiz}>Restart</Button>
			)}
			{!gameStarted &&
				<QuizInitialization
					language1={language1}
					language2={language2}
					handleLanguage1Change={handleLanguage1Change}
					handleLanguage2Change={handleLanguage2Change}
					quizType={quizType}
					handleQuizTypeChange={handleQuizTypeChange}
					startGame={startGame}
				/>}

			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</Container>
	);
};

export default Quiz;
