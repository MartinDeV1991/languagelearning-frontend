import React from "react";
import { Container } from "react-bootstrap";
import WordTable from "./WordTable";

export default function WordList() {
	return (
		<Container className="mt-4">
			<h1 className="mb-4">My words</h1>
			<WordTable />
		</Container>
	);
}
