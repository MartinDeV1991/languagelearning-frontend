import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const path = `https://language-backend.azurewebsites.net/`;

	const navigate = useNavigate();
	const [firstName, setFirstName] = useState();
	const [lastName, setLastName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const handleChangeFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const handleChangeLastName = (e) => {
		setLastName(e.target.value);
	};

	const handleChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const handleChangePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const signUpRequest = {
			firstName,
			lastName,
			email,
			password,
		};

		console.log(signUpRequest);
		fetch(`${path}api/user/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signUpRequest),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					console.log("User added to the database");
				}
				navigate(`/login`);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	return (
		<Container className="mt-4">
			<h3 className="mb-3">Sign up</h3>
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>First Name</Form.Label>
					<Form.Control
						required
						type="text"
						placeholder="Enter first name"
						name="first_name"
						value={firstName}
						onChange={handleChangeFirstName}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Last Name</Form.Label>
					<Form.Control
						required
						type="text"
						placeholder="Enter last name"
						name="last_name"
						value={lastName}
						onChange={handleChangeLastName}
					/>
				</Form.Group>
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
						type="text"
						placeholder="Enter password"
						name="password"
						value={password}
						onChange={handleChangePassword}
					/>
				</Form.Group>
				<Button variant="primary" type="submit" className="ms-2 mt-3">
					Sign Up
				</Button>
			</Form>
		</Container>
	);
};

export default SignUp;
