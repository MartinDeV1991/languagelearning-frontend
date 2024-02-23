import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";
import { fetchData, postData, putData } from "utils/api";
import QuizInitialization from "./QuizInitialization";

const Quiz = () => {
	let user_id = localStorage.getItem("languagelearning_id");

	const maxQuestions = 10;

	const [language1, setLanguage1] = useState("NL");
	const [language2, setLanguage2] = useState("EN-GB");
	const [quizType, setQuizType] = useState("all");
	const [multipleChoice, setMultipleChoice] = useState(false);
	const [choices, setChoices] = useState([]);
	const [checking, setChecking] = useState(false);

	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [feedback, setFeedback] = useState("");
	const [correct, setCorrect] = useState(false);
	const [displayInput, setDisplayInput] = useState(true);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [sentenceOriginal, setSentenceOriginal] = useState([]);
	const [sentenceTranslated, setSentenceTranslated] = useState([]);

	const [hint1, setHint1] = useState(false);
	const [hint2, setHint2] = useState(false);
	const [hint3, setHint3] = useState(false);

	const [gameStarted, setGameStarted] = useState(false);
	const [gameFinished, setGameFinished] = useState(false);

	const [wordIds, setWordIds] = useState([]);

	const [attempts, setAttempts] = useState(0);

	useEffect(() => {
		setOutput(questions[currentQuestionIndex]);
		setInput("");
		setFeedback("");
		setHint1(false);
		setHint2(false);
		setHint3(false);

		let multipleChoiceAnswers = [];
		const answerList = answers;
		multipleChoiceAnswers.push(answerList[currentQuestionIndex]);
		let selectedIndices = new Set();

		for (let i = 0; i < 3; i++) {
			let index;
			if (answers.length > 3) {
				do {
					index = Math.floor(Math.random() * answers.length);
				} while (selectedIndices.has(index) || index === currentQuestionIndex);
				selectedIndices.add(index);
				multipleChoiceAnswers.push(answerList[index]);
			} else {
				index = Math.floor(Math.random() * answers.length);
				multipleChoiceAnswers.push(answerList[index]);
			}
		}
		setChoices(multipleChoiceAnswers);
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
		setGameFinished(false);
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const submitChoice = async (e) => {
		setInput(e);
		setChecking(true);
	};

	const submitAnswer = async (e) => {
		e.preventDefault();
		checkAnswer();
	}

	useEffect(() => {
		console.log("input: ", input)
		console.log("checking: ", checking)
		if (checking) {
			console.log("checking the answer")
			checkAnswer();
			setChecking(false);
		}
	}, [checking]);

	const handleQuizTypeChange = (e) => {
		setQuizType(e.target.value);
	};

	const handleMultipleChoiceChange = (e) => {
		setMultipleChoice(e.target.checked);
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

	const checkAnswer = async () => {
		setCorrect(false);
		// console.log("input: ", input)
		const userAnswer = input;
		const wordId = wordIds[currentQuestionIndex];
		if (
			userAnswer.toLowerCase() === answers[currentQuestionIndex].toLowerCase()
		) {
			setCorrect(true);
			if (currentQuestionIndex < Math.min(questions.length, maxQuestions) - 1) {
				setDisplayInput(false);
				setFeedback(`You answered correctly: The answer was "${answers[currentQuestionIndex]}"`);
				setTimeout(() => {
					setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
					setAttempts(0);
					setDisplayInput(true);
				}, 2000);

			} else {
				setFeedback("Congratulations! You completed the quiz.");
				const today = new Date();
				const year = today.getFullYear();
				const month = (today.getMonth() + 1).toString().padStart(2, '0');
				const day = today.getDate().toString().padStart(2, '0');

				const formattedDateToday = `${year}-${month}-${day}`;
				const logData = {
					testType: "all",
					sourceLanguage: language1,
					targetLanguage: language2,
					numberOfQuestions: 10,
					numberOfCorrectAnswers: 9,
					date: formattedDateToday
				}
				postData(`api/log/${user_id}`, logData);
				setInput("");
				setDisplayInput(false);
				setTimeout(() => setGameFinished(true), 3000);
			}
			await putData(`api/statistics/add_attempts/${wordId}`, true);
		} else {
			if (attempts >= 2) {
				if (currentQuestionIndex < Math.min(questions.length, maxQuestions) - 1) {
					setFeedback(`You answered incorrectly: The answer was "${answers[currentQuestionIndex]}"`);
					setTimeout(() => {
						setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
						setAttempts(0);
					}, 2000);
				} else {
					setFeedback("Congratulations! You completed the quiz.");
					const today = new Date();
					const year = today.getFullYear();
					const month = (today.getMonth() + 1).toString().padStart(2, '0');
					const day = today.getDate().toString().padStart(2, '0');

					const formattedDateToday = `${year}-${month}-${day}`;
					const logData = {
						testType: "all",
						sourceLanguage: language1,
						targetLanguage: language2,
						numberOfQuestions: 10,
						numberOfCorrectAnswers: 9,
						date: formattedDateToday
					}
					postData(`api/log/${user_id}`, logData);
					setInput("");
					setDisplayInput(false);
					setTimeout(() => setGameFinished(true), 3000);
				}
				await putData(`api/statistics/add_attempts/${wordId}`, false);
			} else {
				setFeedback("Incorrect. Try again.");
				setAttempts(attempts + 1);
			}
		}
	};

	return (
		<Container className="mt-4">
			<h1>Quiz Game with Hints</h1>
			{gameStarted &&
				!gameFinished && (
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

						<div><strong>Question #{currentQuestionIndex + 1}</strong></div>
						<div>Translate: <strong>{output}</strong></div>
						<div style={{ color: correct === true ? "green" : "red", fontSize: "30px" }}>{feedback}</div>

						{!multipleChoice && (
							<Form onSubmit={submitAnswer} className="mb-5">
								<Form.Group controlId="inputBox">
									<Form.Control
										type="text"
										placeholder="Type your answer here"
										value={input}
										onChange={handleInputChange}
										style={{ width: "300px", display: displayInput ? "block" : "none" }}
									/>
								</Form.Group>
								<Button variant="primary" type="submit" style={{ display: displayInput ? "block" : "none" }}>
									Submit
								</Button>
							</Form>
						)}
						{multipleChoice && (
							<div>
								<button
									type="button"
									onClick={() => submitChoice(choices[0])}
								>
									{choices[0]}
								</button>
								<button
									type="button"
									onClick={() => submitChoice(choices[1])}
								>
									{choices[1]}
								</button>
								<button
									type="button"
									onClick={() => submitChoice(choices[2])}
								>
									{choices[2]}
								</button>
								<button
									type="button"
									onClick={() => submitChoice(choices[3])}
								>
									{choices[3]}
								</button>
							</div>
						)}
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
					handleMultipleChoiceChange={handleMultipleChoiceChange}
				/>}

			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</Container>
	);
};

export default Quiz;
