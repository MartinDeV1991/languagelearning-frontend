import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function WordTable() {
	const path = `http://localhost:8080/`;
	const [quickFilterText, setQuickFilterText] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const onSelectionChanged = (event) => {
		const selectedNodes = event.api.getSelectedNodes();
		const selectedWordIds = selectedNodes.map((node) => node.data.id);
		setSelectedRows(selectedWordIds);
	};

	const handleDeleteClick = () => {
		const confirmDelete = window.confirm(
			`You are about to delete ${selectedRows.length} word(s) from your list. Are you sure you want to do this?`
		);

		if (confirmDelete) {
			selectedRows.forEach((id) => {
				fetch(`${path}api/word/delete/${id}`, {
					method: "DELETE",
				})
					.then((response) => {
						if (response.ok) {
							// Update the grid after successful deletion
							// You may fetch data again or update the rowData state as needed
						} else {
							// Handle error response
						}
					})
					.then(() => fetchWords());
			});
		}
	};

	const handleSearchChange = (event) => {
		const searchText = event.target.value;
		setQuickFilterText(searchText);
	};

	const flagFormatter = (params) => {
		if (params.value != null) {
			// if null, don't return anything
			if (params.value === "EN-GB") {
				// this doesn't return the right flag so it's hard coded
				return "🇬🇧";
			}
			const codePoints = params.value
				.toUpperCase()
				.split("")
				.map((char) => 127397 + char.charCodeAt());
			return String.fromCodePoint(...codePoints);
		}
	};

	// To do: make this into full component with off canvas to see root word details, and button to fetch root word if not yet present
	const rootWordFormatter = (params) => {
		const rootWord = params.value;
		let message = "";
		if (rootWord != null) {
			if (rootWord.partOfSpeech != null) {
				message = `${rootWord.word} (${rootWord.partOfSpeech})`; // custom format, showing part of speech in brackets
			} else {
				message = `${rootWord.word}`;
			}
		}
		return message;
	};

	// Row Data: The data to be displayed.
	// Column Definitions: Defines & controls grid columns.
	const [rowData, setRowData] = useState([]);
	const [colDefs, setColDefs] = useState([
		{
			field: "sourceLanguage", // matches the name in data from api
			headerName: "📖", // custom header name
			valueFormatter: flagFormatter, // custom formatter to show emoji
			width: 65, // sets starting width, but user can resize columns
			cellEditor: "agSelectCellEditor", // edit by select instead of typing
			cellEditorParams: {
				values: ["NL", "FR", "ES", "EN-GB"], // options for select
			},
		},
		{
			field: "word",
			filter: "agTextColumnFilter",
			width: 130,
			checkboxSelection: true,
		},
		{ field: "translation", width: 130 },
		{ field: "contextSentence" },

		{ field: "translatedContextSentence" },
		{ field: "rootWord", valueFormatter: rootWordFormatter },
	]);

	// Default column settings used for all columns (overridden by colDefs)
	const defaultColDef = useMemo(
		() => ({
			filter: true, // Enable filtering on all columns
			editable: true,
		}),
		[]
	);

	function fetchWords() {
		fetch(`${path}api/word`) // Fetch data from server
			.then((result) => result.json()) // Convert to JSON
			.then((rowData) => setRowData(rowData)); // Update state of `rowData`
	}

	// Fetch data & update rowData state
	useEffect(() => {
		fetchWords();
	}, []);

	return (
		<>
			<Form.Control
				type="text"
				placeholder="Search"
				value={quickFilterText}
				onChange={handleSearchChange}
				className="mb-2"
			/>
			<div className={"ag-theme-quartz"} style={{ width: "100%", height: 600 }}>
				<AgGridReact
					rowData={rowData} // data from api call
					defaultColDef={defaultColDef} // default column settings
					columnDefs={colDefs} // column headings and settings
					pagination={true} // sorts data into pages
					quickFilterText={quickFilterText} // filters based on what is inputted in search bar
					onSelectionChanged={onSelectionChanged} // Event listener
					rowSelection="multiple" // Enable multiple row selection
				/>
			</div>
			<Button onClick={handleDeleteClick} className="mb-2">
				Delete Selected
			</Button>
		</>
	);
}
