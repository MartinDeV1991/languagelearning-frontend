import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { postData } from "utils/api";
import { toast } from "react-toastify";
import CsvWordTable from "./CsvWordTable";

export default function UploadCSV() {
	let user_id = localStorage.getItem("languagelearning_id");
	const sourceLanguage = "NL";
	const translatedTo = "EN-GB";
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [data, setData] = useState("");

	const handleFileChange = (e) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		console.log(file);
		setUploading(true);
		try {
			await accessCsvContents(file);
		} catch (error) {
			console.error(error);
			toast.error(error);
		} finally {
			setUploading(false); // Set uploading state back to false regardless of success or failure
		}
	};

	async function accessCsvContents(file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			console.log(e);
			const textContents = e.target.result;
			setData(textContents.toString()); // Setting data to contents of csv file
			console.log("CSV file contents:", textContents);
		};

		// Read the file as text
		reader.readAsText(file);
	}

	const addWords = async (words) => {
		console.log(words);
		try {
			postData(`api/word/user/${user_id}/multiple`, words);
		} catch (error) {
			console.error(error);
		}
	};

	const convertToWordArray = async (data) => {
		const wordArray = [];
		data.forEach((row) => {
			const word = {
				word: row.word,
				contextSentence: row.usage,
				sourceLanguage: sourceLanguage,
				translatedTo: translatedTo,
				book: {
					title: row.book,
					author: row.authors,
					language: sourceLanguage,
				},
			};
			wordArray.push(word);
		});
		console.log(wordArray);
		return wordArray;
	};

	return (
		<Container>
			<h2>Upload CSV here!</h2>
			<Col className="m-auto mb-3">
				<Form.Group controlId="formFile" className="mb-3">
					<Form.Control
						type="file"
						accept="text/csv"
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Row className="justify-items-between">
					<Col>{uploading && <p>Uploading...</p>}</Col>
					<Col className="d-flex justify-content-end">
						<Button
							onClick={handleUpload}
							variant="primary"
							type="submit"
							className="ms-auto"
							disabled={uploading}
						>
							Upload
						</Button>
					</Col>
				</Row>
				{data && (
					<Row className="justify-items-between">
						<Col>
							<h4>Select words to import</h4>
							<CsvWordTable csvData={data} />
						</Col>
					</Row>
				)}
			</Col>
		</Container>
	);
}
