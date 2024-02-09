import BooksCards from "components/BooksCards";
import React from "react";
import { Container } from "react-bootstrap";

export default function MyBooksPage() {
	return (
		<Container className="mt-3">
			<BooksCards />
		</Container>
	);
}
