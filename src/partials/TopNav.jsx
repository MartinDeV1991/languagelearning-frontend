import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function TopNav() {
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
						title="My account"
						id="basic-nav-dropdown"
						align="end"
						data-bs-theme="light"
					>
						<LinkContainer to={"/my-books"}>
							<NavDropdown.Item>My books</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to={"/import"}>
							<NavDropdown.Item>Import vocab</NavDropdown.Item>
						</LinkContainer>
						<NavDropdown.Divider />
						<LinkContainer to={"/logout"}>
							<NavDropdown.Item>Log out</NavDropdown.Item>
						</LinkContainer>
						<NavDropdown.Divider />
						<LinkContainer to={"/login"}>
							<NavDropdown.Item>Log in</NavDropdown.Item>
						</LinkContainer>
						<LinkContainer to={"/signup"}>
							<NavDropdown.Item>Sign up</NavDropdown.Item>
						</LinkContainer>
					</NavDropdown>
				</Nav>
			</Container>
		</Navbar>
	);
}
