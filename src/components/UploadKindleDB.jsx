import React, { useState } from "react";
import { Button, Col, Row, Form, Tab, Badge, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadFile } from "utils/api";
import CsvWordTable from "./CsvWordTable";
import Papa from "papaparse";

export default function UploadKindleDB() {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [wordArray, setWordArray] = useState([]);
	const [booksArray, setBooksArray] = useState([]);

	const handleFileChange = (e) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		console.log(file);
		setUploading(true);
		try {
			const response = await uploadFile(`api/file/db-to-csv`, file);
			console.log(response);

			convertCSV(await response.text());
			setUploading(false);
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const convertCSV = async (csv) => {
		const data = Papa.parse(csv, {
			header: true,
		});
		console.log(data);
		convertToArrays(data.data);
	};

	const convertToArrays = (data) => {
		// Create an object to store books by their ISBN or title
		const booksByISBNOrTitle = {};
		const allWords = [];

		// Iterate over each row of data
		data.forEach((row) => {
			// Determine the key for the book object based on the availability of ISBN
			const key = row.isbn || row.title;

			// Check if the book already exists in the booksByISBNOrTitle object
			if (!booksByISBNOrTitle[key]) {
				// If the book does not exist, create a new entry
				booksByISBNOrTitle[key] = {
					title: row.title,
					author: row.authors,
					language: row.lang,
					isbn: row.isbn || null, // Use null if ISBN is not available
					words: [], // Initialize an empty array to store words for this book
				};
			}

			// Create a word object for the current row
			const word = {
				word: row.word,
				rootWord: row.stem,
				contextSentence: row.usage,
				sourceLanguage: row.lang,
				translatedTo: "EN-GB",
				timestamp: row.timestamp,
				book: {
					title: row.title,
					author: row.authors,
					language: row.lang,
					isbn: row.isbn || null,
				}, // Associate the word with the corresponding book object
			};

			// Add the word to the words array of the corresponding book
			booksByISBNOrTitle[key].words.push(word);

			// add word to word array
			allWords.push(word);
		});

		// Convert the booksByISBNOrTitle object to an array of book objects
		setBooksArray(Object.values(booksByISBNOrTitle));
		setWordArray(allWords);
		return allWords;
	};

	return (
		<>
			<h4>Upload vocab.db file here</h4>
			<p>
				Plug your Kindle into the computer and search for a file called{" "}
				<b>vocab.db</b>. This is where the Kindle stores information about the
				words you look up while reading. Upload it here to extract the data.{" "}
			</p>
			<p>
				In the next step you can download the raw data or choose which words to
				save in your account.
			</p>
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
				{wordArray.length > 0 && (
					<Row>
						<hr className="mt-3" />
						<Tab.Container id="list-group-tabs-example" defaultActiveKey="#all">
							<Col sm={3}>
								<div className="sidebar">
									<h5>Books</h5>
									<ListGroup>
										<ListGroup.Item action href="#all">
											All{" "}
											<Badge bg="primary" pill>
												{wordArray.length}
											</Badge>
										</ListGroup.Item>
										{booksArray.map((book, index) => (
											<ListGroup.Item
												action
												href={`#${book.title}`}
												key={index}
											>
												{book.title}{" "}
												<Badge bg="primary" pill>
													{book.words.length}
												</Badge>
											</ListGroup.Item>
										))}
									</ListGroup>
								</div>
							</Col>
							<Col sm={9}>
								<Tab.Content>
									<Tab.Pane eventKey="#all">
										<h4>All books</h4>
										<CsvWordTable csvData={wordArray} />
									</Tab.Pane>
									{booksArray.map((book, index) => (
										<Tab.Pane eventKey={`#${book.title}`} key={index}>
											<h4>{book.title}</h4>
											<CsvWordTable csvData={book.words} />
										</Tab.Pane>
									))}
								</Tab.Content>
							</Col>
						</Tab.Container>
					</Row>
				)}
			</Col>
		</>
	);
}
