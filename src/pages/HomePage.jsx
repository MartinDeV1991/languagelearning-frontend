import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const HomePage = () => {
	let userName = localStorage.getItem("languagelearning_first_name");
	console.log("username: ", userName);
	if (userName === undefined) {
		userName = "defaultUser";
	}

	return (
		<div className="mt-5">
			<div>Hello {userName}</div>

			<LinkContainer to={`/login`}>
				<Button className="mt-3 ms-3" variant="primary">
					Login
				</Button>
			</LinkContainer>

			<LinkContainer to={`/quiz`}>
				<Button className="mt-3 ms-3" variant="primary">
					Go to quiz
				</Button>
			</LinkContainer>
		</div>
	);
};

export default HomePage;
