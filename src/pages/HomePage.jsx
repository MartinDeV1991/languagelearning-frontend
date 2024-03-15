import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "utils/AuthContext";

const HomePage = () => {
	const { name, setName, isLoggedIn } = useAuth();

	useEffect(() => {
		setName(localStorage.getItem("languagelearning_first_name"));
	}, [setName]);

	return (
		<Container className="mt-4">
			{isLoggedIn ? (
				<>
					<h1>Hello {name}</h1>
					<LinkContainer to={`/quiz`}>
						<Button className="mt-3 ms-3" variant="primary">
							Go to quiz
						</Button>
					</LinkContainer>
				</>
			) : (
				<>
					<LinkContainer to={`/login`}>
						<Button className="mt-3 ms-3" variant="primary">
							Login
						</Button>
					</LinkContainer>
				</>
			)}
		</Container>
	);
};

export default HomePage;
