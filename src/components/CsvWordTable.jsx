import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import React, { useCallback, useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { postData } from "utils/api";

export default function CsvWordTable({ csvData }) {
	const gridRef = React.useRef(null);
	const user_id = localStorage.getItem("languagelearning_id");
	const [selectedWords, setSelectedWords] = useState([]);

	useEffect(() => {
		console.log(csvData);
	}, [csvData]);

	const dateFormatter = (params) => {
		const timestamp = +params.value;
		var date = new Date(timestamp);
		return date.toLocaleString();
	};

	const onBtnExport = useCallback(() => {
		gridRef.current.api.exportDataAsCsv();
	}, []);

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
		{
			headerName: "Time stamp",
			field: "timestamp",
			valueFormatter: dateFormatter,
		},
	];

	const onSelectionChanged = (event) => {
		const selectedNodes = event.api.getSelectedNodes();
		const selectedWordObjects = [];
		selectedNodes.forEach((node) => {
			selectedWordObjects.push(node.data);
			return node;
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
			<Button
				size="sm"
				variant="outline-dark"
				className="ms-auto"
				onClick={onBtnExport}
			>
				Export this table as a csv file
			</Button>
			<div className="ag-theme-balham" style={{ height: 600, width: "100%" }}>
				<AgGridReact
					ref={gridRef}
					columnDefs={columnDefs}
					rowData={csvData}
					pagination={true}
					rowSelection="multiple"
					rowMultiSelectWithClick={true}
					onSelectionChanged={onSelectionChanged} // Event listener when selected rows changes
				/>
			</div>
			<Accordion className="mt-3">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Import settings</Accordion.Header>
					<Accordion.Body>
						<p>Translate to: EN-GB</p>
						<small>
							It is not yet possible to choose a different language to translate
							the words to, this feature is coming soon.
						</small>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<Button className="mt-3" onClick={importWords}>
				Import words
			</Button>
		</>
	);
}
