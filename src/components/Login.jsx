import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData } from "utils/api";
import { useAuth } from "utils/AuthContext";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const { setIsLoggedIn } = useAuth();

	const handleChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const handleChangePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const loginRequest = {
			email: email,
			password: password,
		};
		try {
			const data = await postData("api/user/login", loginRequest);
			console.log(data);
			console.log("succesvol ingelogd");
			console.log(data.success);
			if (data.status !== 404) {
				localStorage.setItem("languagelearning_token", data[1]);
				localStorage.setItem("languagelearning_first_name", data[0].firstName);
				localStorage.setItem("languagelearning_last_name", data[0].lastName);
				localStorage.setItem("languagelearning_id", data[0].id);
				setIsLoggedIn(true);
				navigate(`/`);
			} else {
				localStorage.setItem("languagelearning_id", "1");
				localStorage.setItem("languagelearning_first_name", "User");
				setIsLoggedIn(true);
				navigate(`/`);
			}
		} catch (error) {
			console.error("Error:", error);
			// add error message here
			navigate(`/`);
		}
	};

	return (
		<Container className="mt-4">
			<h3 className="mb-3">Login</h3>
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						required
						type="text"
						placeholder="Enter email"
						name="email"
						value={email}
						onChange={handleChangeEmail}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control
						required
						type="password"
						placeholder="Enter password"
						name="password"
						value={password}
						onChange={handleChangePassword}
					/>
				</Form.Group>
				<Button variant="primary" type="submit" className="ms-2 mt-3">
					Login
				</Button>
				<LinkContainer to={`/signup`}>
					<Button className="mt-3 ms-3" variant="primary">
						Sign Up
					</Button>
				</LinkContainer>
			</Form>
		</Container>
	);
};

export default Login;
