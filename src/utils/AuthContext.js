import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState(
		localStorage.getItem("languagelearning_token")
	);
	const [name, setName] = useState(
		localStorage.getItem("languagelearning_first_name")
	);

	useEffect(() => {
		setIsLoggedIn(!!token);
	}, [token]);

	useEffect(() => {
		const handleStorageChange = () => {
			const newToken = localStorage.getItem("languagelearning_token");
			setToken(newToken);
			const newName = localStorage.getItem("languagelearning_first_name");
			setName(newName);
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, setIsLoggedIn, token, setToken, name, setName }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
