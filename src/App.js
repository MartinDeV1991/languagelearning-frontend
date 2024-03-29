import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import {
	HomePage,
	LoginPage,
	QuizPage,
	SignUpPage,
	WordListPage,
	StatisticsPage,
	LogPage
} from "./pages";
import TopNav from "partials/TopNav";
import Footer from "partials/Footer";
import { ToastContainer } from "react-toastify";
import MyBooksPage from "pages/MyBooksPage";
import ImportPage from "pages/ImportPage";

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
				<Route path="/stats" element={<StatisticsPage />} />
				<Route path="/log" element={<LogPage />} />
				<Route path="/import" element={<ImportPage />} />
				<Route path="/my-books" element={<MyBooksPage />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme="light"
			/>
			<Footer />
		</>
	);
}

export default App;
