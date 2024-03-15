import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "utils/AuthContext";

export default function TopNav() {
	const { isLoggedIn, setIsLoggedIn, name, setName } = useAuth();
	const navigate = useNavigate();

	const logOutUser = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		setName(null);
		navigate("/");
	};

	return (
		<Navbar bg="primary" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">WordLog</Navbar.Brand>
				<Nav className="me-auto">
					<LinkContainer to={"/"}>
						<Nav.Link>Home</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/quiz"}>
						<Nav.Link>Quiz</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/words"}>
						<Nav.Link>Words</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/stats"}>
						<Nav.Link>Statistics</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/log"}>
						<Nav.Link>Log</Nav.Link>
					</LinkContainer>
				</Nav>
				<Nav className="ms-auto">
					<NavDropdown
						title={isLoggedIn && name ? `${name}'s account` : "Account"}
						id="basic-nav-dropdown"
						align="end"
						data-bs-theme="light"
					>
						{isLoggedIn ? (
							<>
								<LinkContainer to={"/my-books"}>
									<NavDropdown.Item>My books</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to={"/import"}>
									<NavDropdown.Item>Import vocab</NavDropdown.Item>
								</LinkContainer>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={logOutUser}>
									Log out
								</NavDropdown.Item>
							</>
						) : (
							<>
								<LinkContainer to={"/login"}>
									<NavDropdown.Item>Log in</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to={"/signup"}>
									<NavDropdown.Item>Sign up</NavDropdown.Item>
								</LinkContainer>
							</>
						)}
					</NavDropdown>
				</Nav>
			</Container>
		</Navbar>
	);
}
