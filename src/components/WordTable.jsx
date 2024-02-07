import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function WordTable() {
	const [quickFilterText, setQuickFilterText] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [originalRowData, setOriginalRowData] = useState([]);

	const onSelectionChanged = (event) => {
		const selectedNodes = event.api.getSelectedNodes();
		const selectedWordIds = selectedNodes.map((node) => node.data.id);
		setSelectedRows(selectedWordIds);
	};

	const onRowEditingStarted = (event) => {
		const { data } = event.node;
		// Make a deep copy of the original row data to preserve it
		const originalDataCopy = JSON.parse(JSON.stringify(data));
		setOriginalRowData(originalDataCopy);
	};

	const onRowEditingStopped = (event) => {
		const { node } = event;
		const rowId = node.data.id;

		// Get the edited row data
		const editedData = node.data;

		// Compare the original row data with the edited row data
		const hasChanged =
			JSON.stringify(originalRowData) !== JSON.stringify(editedData);

		if (hasChanged) {
			// Display confirmation dialog
			const confirmEdit = window.confirm("Do you want to save changes?");
			handleEditConfirmation(rowId, editedData, confirmEdit);
		}
	};

	const handleDeleteClick = () => {
		const confirmDelete = window.confirm(
			`You are about to delete ${selectedRows.length} word(s) from your list. Are you sure you want to do this?`
		);

		if (confirmDelete) {
			selectedRows.forEach((id) => {
				fetch(`${process.env.REACT_APP_PATH}api/word/${id}`, {
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

	const handleEditConfirmation = (rowId, data, column, confirmEdit) => {
		if (confirmEdit) {
			// Send API request to save changes;
			console.log(data);
			console.log("flag: ", data.statistics.flag)
			if (column == "statistics.flag") {
				fetch(`${process.env.REACT_APP_PATH}api/statistics/flag/${rowId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data.statistics.flag),
				}).then((response) => {
					if (response.ok) {
						fetchWords();
						// alert confirmation?
					} else {
						console.log("response: ", response);
					}
				});
			}
			if (data) {
				// Send API request with the updated data
				fetch(`${process.env.REACT_APP_PATH}api/word/${rowId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}).then((response) => {
					if (response.ok) {
						fetchWords();
						// alert confirmation?
					} else {
						console.log("response: ", response);
					}
				});
			}
		} else {
			// can I just revert that one cell instead of refreshing all?
			fetchWords();
		}
	};

	const onCellEditingStopped = (event) => {
		const { node } = event;
		const rowId = node.data.id;

		// Display confirmation dialog
		const confirmEdit = window.confirm("Do you want to save changes?");
		handleEditConfirmation(rowId, event.node.data, confirmEdit);
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

	const generateRootWord = (wordID) => {
		fetch(`${path}api/word/${wordID}/root`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		}).then((response) => {
			if (response.ok) {
				fetchWords();
				// alert confirmation?
			} else {
				console.log(response);
			}
		});
	};

	const rootWordRenderer = (params) => {
		const rootWord = params.value;
		if (rootWord != null) {
			if (rootWord.partOfSpeech != null) {
				return `${rootWord.word} (${rootWord.partOfSpeech})`; // custom format, showing part of speech in brackets
			} else {
				return `${rootWord.word}`;
			}
		}
		return (
			<Button onClick={() => generateRootWord(params.data.id)} size="sm">
				Generate
			</Button>
		);
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
		{
			field: "rootWord",
			// valueFormatter: rootWordFormatter,
			editable: false,
			cellRenderer: rootWordRenderer,
		},
		{ field: "statistics.flag" }
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
		fetch(`${process.env.REACT_APP_PATH}api/word`) // Fetch data from server
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
					onSelectionChanged={onSelectionChanged} // Event listener when selected rows changes
					onRowEditingStarted={onRowEditingStarted} // Event listener when editing starts
					onRowEditingStopped={onRowEditingStopped} // Event listener when editing stops
					rowSelection="multiple" // Enable multiple row selection
					editType="fullRow"
				/>
			</div>
			<Button onClick={handleDeleteClick} className="mb-2">
				Delete Selected
			</Button>
		</>
	);
}
