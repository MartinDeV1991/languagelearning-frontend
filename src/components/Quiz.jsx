import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizAnimation from "../components/QuizAnimation";
import QuizInitialization from "./QuizInitialization";
import Hints from "./Hints";
import { fetchData, postData, putData } from "utils/api";

const Quiz = () => {
	let user_id = localStorage.getItem("languagelearning_id");

	const maxQuestions = 10;

	const [language1, setLanguage1] = useState("NL");
	const [language2, setLanguage2] = useState("EN-GB");
	const [quizType, setQuizType] = useState("all");
	const [multipleChoice, setMultipleChoice] = useState(false);
	const [choices, setChoices] = useState([]);
	const [correctCounter, setCorrectCounter] = useState(0);

	const [input, setInput] = useState("");
	const [question, setQuestion] = useState("");
	const [feedback, setFeedback] = useState("");
	const [correct, setCorrect] = useState(false);
	const [displayInput, setDisplayInput] = useState(true);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [sentenceOriginal, setSentenceOriginal] = useState([]);
	const [sentenceTranslated, setSentenceTranslated] = useState([]);

	const [gameStarted, setGameStarted] = useState(false);
	const [gameFinished, setGameFinished] = useState(false);

	const [wordIds, setWordIds] = useState([]);
	const [attempts, setAttempts] = useState(0);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		setQuestion(questions[currentQuestionIndex]);
		setInput("");
		determineMultipleChoiceOptions();
	}, [currentQuestionIndex, questions,]);

	function determineMultipleChoiceOptions() {
		let multipleChoiceAnswers = [];
		const answerList = answers;
		let selectedIndices = new Set();

		multipleChoiceAnswers.push(answerList[currentQuestionIndex]);
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
	}

	const restartQuiz = () => {
		setCurrentQuestionIndex(0);
		setGameStarted(false);
		setGameFinished(false);
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const submitAnswer = async (e) => {
		e.preventDefault();
		checkAnswer(input);
	}

	const startGame = async () => {
		try {
			const data = await fetchData(`api/word/user/${user_id}`);
			let filteredData;
			const languageFilteredData = data.filter(
				(item) =>
					(item.sourceLanguage === language1 || item.sourceLanguage === language2) && (item.translatedTo === language2 || item.translatedTo === language1)
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

			const wordsInLanguage1 = filteredData.map(({ translation, word, sourceLanguage, translatedTo }) => {
				if (sourceLanguage === language2 && translatedTo === language1) {
					return word;
				}
				return translation;
			});

			const wordsInLanguage2 = filteredData.map(({ word, translation, sourceLanguage, translatedTo }) => {
				if (sourceLanguage === language2 && translatedTo === language1) {
					return translation;
				}
				return word;
			});

			setQuestions(wordsInLanguage2);
			setAnswers(wordsInLanguage1);

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

	const checkAnswer = async (answer) => {
		setCorrect(false);
		const userAnswer = answer;
		const wordId = wordIds[currentQuestionIndex];
		const isCorrect = userAnswer.toLowerCase() === answers[currentQuestionIndex].toLowerCase();
		const isLastQuestion = currentQuestionIndex >= Math.min(questions.length, maxQuestions) - 1;

		if (isCorrect || attempts >= 2) {
			if (isCorrect) setCorrectCounter((prevIndex) => prevIndex + 1);
			setCorrect(isCorrect);
			const feedbackMessage = `You answered ${isCorrect ? "correctly" : "incorrectly"}. The answer was "${answers[currentQuestionIndex]}".`;

			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
			if (!isLastQuestion) {
				setDisplayInput(false);
				setFeedback(feedbackMessage);
				setTimeout(() => {
					setAttempts(0);
					setDisplayInput(true);
				}, 1000);
			} else if (isLastQuestion) {
				const formattedDateToday = new Date().toISOString().split('T')[0]
				const logData = {
					testType: quizType,
					sourceLanguage: language1,
					targetLanguage: language2,
					numberOfQuestions: Math.min(questions.length, maxQuestions),
					numberOfCorrectAnswers: correctCounter,
					date: formattedDateToday
				}
				postData(`api/log/${user_id}`, logData);
				setInput("");
				setDisplayInput(false);
				setTimeout(() => {
					setGameFinished(true);
					setGameStarted(false);
					setFeedback("Congratulations! You completed the quiz.");
				}, 3000);
			}
			await putData(`api/statistics/add_attempts/${wordId}`, isCorrect);
		} else {
			setFeedback("Incorrect. Try again.");
			setAttempts(attempts + 1);
		}
	};

	return (
		<Container className="mt-4">
			<div style={{ width: '50%' }}>
				<h1>Quiz Game with Hints</h1>
				<div style={{ color: correct === true ? "green" : "red", fontSize: "30px", display: !gameFinished ? "none" : "block" }}>{feedback}</div>
				{gameStarted &&
					!gameFinished && (
						<div>
							<div className="mb-3">
								<strong>{language1}</strong>{" "}
								to{" "}
								<strong>{language2}</strong>
							</div>

							<div style={{ display: displayInput ? "block" : "none" }}>
								<div><strong>Question #{currentQuestionIndex + 1}</strong></div>
								<div>Translate: <strong>{question}</strong></div>
							</div>
							<div style={{ color: correct === true ? "green" : "red", fontSize: "30px", display: displayInput ? "none" : "block" }}>{feedback}</div>

							{displayInput && (
								<>
									{!multipleChoice && (
										<Form onSubmit={submitAnswer} className="mb-5">
											<Form.Group controlId="inputBox">
												<Form.Control
													type="text"
													placeholder="Type your answer here"
													onChange={handleInputChange}
													style={{ width: "300px", display: displayInput ? "block" : "none" }}
												/>
											</Form.Group>
											<Button variant="primary" type="submit">
												Submit
											</Button>
										</Form>
									)}
									{multipleChoice && (
										<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', justifyContent: 'start', width: '20%' }}>
											{choices.map((choice, index) => (
												<button
													key={index}
													type="button"
													onClick={() => checkAnswer(choice)}
													style={{ width: '100%', height: '50px', margin: '0', padding: '0', backgroundColor: 'rgb(0, 200, 250, 1)' }}
												>
													{choice}
												</button>
											))}
										</div>
									)}
									<div>You have had {attempts} attempts for this question.</div>
									<Hints
										answers={answers}
										sentenceOriginal={sentenceOriginal}
										sentenceTranslated={sentenceTranslated}
										currentQuestionIndex={currentQuestionIndex}
									/>
								</>
							)}
						</div>
					)}{" "}
				{currentQuestionIndex > 0 && !gameFinished && (
					<Button onClick={restartQuiz}>Restart</Button>
				)}
			</div>
			{!gameStarted &&
				<QuizInitialization
					language1={language1}
					language2={language2}
					quizType={quizType}
					startGame={startGame}
					handleLanguage1Change={(e) => setLanguage1(e.target.value)}
					handleLanguage2Change={(e) => setLanguage2(e.target.value)}
					handleQuizTypeChange={(e) => setQuizType(e.target.value)}
					handleMultipleChoiceChange={(e) => setMultipleChoice(e.target.checked)}
				/>}
			<QuizAnimation {...{ currentQuestionIndex, questions }}></QuizAnimation>
		</Container >
	);
};

export default Quiz;
