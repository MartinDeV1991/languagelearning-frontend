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
import Footer from "partials/Footer";
import { ToastContainer } from "react-toastify";

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
