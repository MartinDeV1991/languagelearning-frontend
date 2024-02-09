import UploadCSV from "components/UploadCSV";
import React from "react";
import { Container } from "react-bootstrap";

export default function UploadPage() {
	return (
		<Container>
			<h1>Upload things here!</h1>
			<UploadCSV />
		</Container>
	);
}
