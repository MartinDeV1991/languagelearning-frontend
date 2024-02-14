import React from "react";
import { Button, Container } from "react-bootstrap";
import Papa from "papaparse";
import { postData } from "utils/api";

export default function UploadCSV() {
	const sourceLanguage = "NL";
	const translatedTo = "EN-GB";

	const addWords = async (words) => {
		console.log(words);
		try {
			postData("api/word/user/3/multiple", words);
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

	const convertCSV = async () => {
		const data = Papa.parse(await fetchCSVFile(), {
			header: true,
			preview: 5,
		});
		console.log(data);
		addWords(await convertToWordArray(data.data));
	};

	async function fetchCSVFile() {
		const response = await fetch("vocab.csv");
		const reader = response.body.getReader();
		const result = await reader.read();
		const decoder = new TextDecoder("utf-8");
		const csv = await decoder.decode(result.value);
		return csv;
	}

	return (
		<Container>
			<h2>Upload CSV here!</h2>
			<Button onClick={convertCSV}>Convert</Button>
		</Container>
	);
}
