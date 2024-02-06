import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function Footer() {
	return (
		<Navbar fixed="bottom" bg="secondary" data-bs-theme="dark">
			<Container>
				<Nav className="m-auto">
					<a
						href="https://github.com/MartinDeV1991/languagelearning-frontend"
						target="blank"
						className="me-2 link-light link-underline-opacity-0 link-opacity-50 link-opacity-100-hover"
					>
						Frontend (React)
					</a>
					<a
						href="https://github.com/MartinDeV1991/languagelearning-backend"
						target="blank"
						className="ms-2 link-light link-underline-opacity-0 link-opacity-50 link-opacity-100-hover"
					>
						Backend (Java)
					</a>
				</Nav>
			</Container>
		</Navbar>
	);
}
