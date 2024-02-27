import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import CsvWordTable from "./CsvWordTable";
import Papa from "papaparse";

export default function UploadCSV() {
	const sourceLanguage = "NL";
	const translatedTo = "EN-GB";
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [data, setData] = useState([]);

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

	const convertCSV = async (csv) => {
		const data = Papa.parse(csv, {
			header: true,
		});
		setData(convertToWordArray(data.data));
		return data.data;
	};

	async function accessCsvContents(file) {
		const reader = new FileReader();

		reader.onload = async function (e) {
			console.log(e);
			const textContents = e.target.result;
			console.log("CSV file contents: ", textContents);
			const parsedCsvData = await convertCSV(textContents.toString()); // converting csv to JSON
			setData(convertToWordArray(parsedCsvData)); // Setting data to word array from JSON
			console.log("Parsed CSV data: ", parsedCsvData);
		};

		// Read the file as text
		reader.readAsText(file);
	}

	const convertToWordArray = (data) => {
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
		console.log("Word array: ", wordArray);
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
				{data.length > 0 && (
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
