import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function TopNav() {
	return (
		<Navbar bg="primary" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">Navbar</Navbar.Brand>
				<Nav className="me-auto">
					<LinkContainer to={"/"}>
						<Nav.Link>Home</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/quiz"}>
						<Nav.Link>Quiz</Nav.Link>
					</LinkContainer>
				</Nav>
				<Nav className="ms-auto">
					<NavDropdown title="My account" id="basic-nav-dropdown" align="end">
						<LinkContainer to={"/login"}>
							<NavDropdown.Item>Log in</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to={"/logout"}>
							<NavDropdown.Item>Log out</NavDropdown.Item>
						</LinkContainer>
						<NavDropdown.Divider />
						<LinkContainer to={"/signup"}>
							<NavDropdown.Item>Sign up</NavDropdown.Item>
						</LinkContainer>
					</NavDropdown>
				</Nav>
			</Container>
		</Navbar>
	);
}