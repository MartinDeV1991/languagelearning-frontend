import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { Button } from "react-bootstrap";
import { postData } from "utils/api";

export default function CsvWordTable({ csvData }) {
	const gridRef = React.useRef(null);
	const [rowData, setRowData] = useState([]);
	const user_id = 1;
	const [selectedWords, setSelectedWords] = useState([]);

	const convertCSV = async (csv) => {
		const data = Papa.parse(csv, {
			header: true,
		});
		setRowData(convertToWordArray(data.data));
	};

	const convertToWordArray = (data) => {
		const wordArray = [];
		data.forEach((row) => {
			const word = {
				word: row.word,
				rootWord: row.stem,
				contextSentence: row.usage,
				sourceLanguage: row.lang,
				translatedTo: "EN-GB",
				book: {
					title: row.title,
					author: row.authors,
					language: row.lang,
					isbn: row.isbn,
				},
			};
			wordArray.push(word);
		});
		console.log(wordArray);
		return wordArray;
	};

	useMemo(() => {
		convertCSV(csvData);
	}, [csvData]);

	const columnDefs = [
		{
			headerName: "📖",
			field: "sourceLanguage",
			width: 60,
			filter: true,
		},
		{
			headerName: "Word",
			field: "word",
			width: 130,
			filter: true,
			headerCheckboxSelection: true,
			headerCheckboxSelectionFilteredOnly: true,
		},
		{ headerName: "Stem", field: "rootWord", width: 130 },
		{ headerName: "Usage", field: "contextSentence", width: 300 },
		{
			headerName: "Book",
			field: "book.title",
			width: 200,
			filter: true,
		},
		{
			headerName: "Author",
			field: "book.author",
			width: 150,
			filter: true,
		},
		{
			headerName: "ISBN",
			field: "book.isbn",
			width: 150,
			filter: true,
		},
	];

	const onSelectionChanged = (event) => {
		const selectedNodes = event.api.getSelectedNodes();
		const selectedWordObjects = [];
		selectedNodes.map((node) => {
			selectedWordObjects.push(node.data);
		});
		setSelectedWords(selectedWordObjects);
	};

	const importWords = async () => {
		const response = await postData(
			`api/word/user/${user_id}/multiple`,
			selectedWords
		);
		console.log(response);
	};

	return (
		<>
			<p>
				Select and deselect words by clicking on them, or add filters to the
				columns and then check the checkbox to select all the words that match
				that filter. When you have chosen your words, click the button below to
				import them.
			</p>
			{/* Click a book title to select all words from that book:
			<div>
				<Button onClick={selectRowsFromBook}>
					Select all rows from book "De getemde man"
				</Button>
				<Button onClick={() => setSelectedBook(null)}>Reset</Button>
			 </div> */}
			<div className="ag-theme-balham" style={{ height: 600, width: "100%" }}>
				<AgGridReact
					ref={gridRef}
					columnDefs={columnDefs}
					rowData={rowData}
					pagination={true}
					rowSelection="multiple"
					rowMultiSelectWithClick={true}
					onSelectionChanged={onSelectionChanged} // Event listener when selected rows changes
				/>
			</div>
			<Button className="mt-3" onClick={importWords}>
				Import words
			</Button>
		</>
	);
}
