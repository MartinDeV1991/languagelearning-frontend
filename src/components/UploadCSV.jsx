import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Papa from "papaparse";
import { postData, uploadFile } from "utils/api";
import { toast } from "react-toastify";
import CsvWordTable from "./CsvWordTable";

export default function UploadCSV() {
	let user_id = localStorage.getItem("languagelearning_id");
	const sourceLanguage = "NL";
	const translatedTo = "EN-GB";
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [data, setData] = useState();

	const handleFileChange = (e) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		console.log(file);
		setUploading(true);
		try {
			const response = await Papa.parse(file, {
				header: true,
				preview: 20,
			});
			console.log(response);
			setData(response.data);
			setUploading(false);
			console.log(data);
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	async function accessCsvContents(file) {
		const reader = new FileReader(); // Create a new FileReader instance

		const csvPromise = new Promise((resolve, reject) => {
			reader.onload = () => {
				resolve(reader.result); // Resolve the promise with the result when reading is complete
			};
			reader.onerror = reject; // Reject the promise if an error occurs during reading
		});

		reader.readAsText(file); // Read the file as text

		try {
			const csv = await csvPromise; // Wait for the promise to be resolved
			return csv; // Return the CSV content
		} catch (error) {
			throw new Error("Error reading CSV file: " + error.message); // Throw an error if reading fails
		}
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

	// const convertCSV = async () => {
	// 	const data = Papa.parse(await fetchCSVFile(), {
	// 		header: true,
	// 		preview: 20,
	// 	});
	// 	console.log(data);
	// 	addWords(await convertToWordArray(data.data));
	// };

	return (
		<Container>
			<h2>Upload CSV here!</h2>
			<Col className="m-auto mb-3">
				<Form.Group controlId="formFile" className="mb-3">
					<Form.Control type="file" onChange={handleFileChange} />
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
