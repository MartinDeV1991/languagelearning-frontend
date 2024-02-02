import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import {
	HomePage,
	LoginPage,
	QuizPage,
	SignUpPage,
	WordListPage,
} from "./pages";
import TopNav from "partials/TopNav";

function App() {
	return (
		<>
			<TopNav />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/quiz" element={<QuizPage />} />
				<Route path="/words" element={<WordListPage />} />
			</Routes>
		</>
	);
}

export default App;
