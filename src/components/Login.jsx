import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const path = `https://language-backend.azurewebsites.net/`;

	const navigate = useNavigate()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()

	const handleChangeEmail = (e) => {
		setEmail(e.target.value)
	}

	const handleChangePassword = (e) => {
		setPassword(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		const loginRequest = {
			email: email,
			password: password,
		}

		fetch(`${path}api/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginRequest),
		})
			.then((response) => response.json())
			.then((data) => {
                console.log(data)
                console.log("succesvol ingelogd")
                console.log(data.success)
				if (data.status != 404) {
					localStorage.setItem('languagelearning_token', data.token)
					localStorage.setItem('languagelearning_first_name', data.firstName)
                    localStorage.setItem('languagelearning_last_name', data.lastName)
					localStorage.setItem('languagelearning_id', data.id)
					navigate(`/`)
				} else {
                    localStorage.setItem('languagelearning_id', 1)
                    localStorage.setItem('languagelearning_first_name', "User")
                    navigate(`/`)
                }
			})
			.catch((error) => {
				console.error('Error:', error)
				localStorage.setItem('languagelearning_id', 1)
                localStorage.setItem('languagelearning_first_name', "User")
				navigate(`/`)
			})
	}

	return (
		<Container>
			<h3 className="mt5 mb-3">Login</h3>
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
	)
}

export default Login