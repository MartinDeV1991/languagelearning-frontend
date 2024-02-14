import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import RootWordOffCanvas from "./RootWordOffCanvas";
import {
	deleteMultiple,
	deleteOne,
	fetchData,
	postData,
	putData,
} from "utils/api";
import { flagFormatter } from "utils/formatter";

export default function WordTable() {
	const gridRef = React.useRef(null);
	let user_id = 3;
	const [quickFilterText, setQuickFilterText] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [originalRowData, setOriginalRowData] = useState([]);
	const [rowData, setRowData] = useState([]);
	const [formData, setFormData] = useState({
		word: "",
		sourceLanguage: "NL",
		translatedTo: "EN-GB",
		contextSentence: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newWord = await toast.promise(
			postData(`api/word/user/${user_id}`, formData),
			{
				pending: "Adding...",
				success: `Word '${formData.word}' successfully added.`,
				error: "Failed to add word. Please try again.",
			}
		);
		console.log(formData);
		console.log(newWord);
		// add to grid
		setRowData((prevRowData) => [...prevRowData, newWord]);
		// reset form
		setFormData({
			word: "",
			sourceLanguage: "NL",
			translatedTo: "EN-GB",
			contextSentence: "",
		});
	};

	async function fetchWords() {
		setRowData(await fetchData(`api/word/user/${user_id}`)); // Update state of `rowData` to the fetched data
	}

	// Fetch data & update rowData state
	useEffect(() => {
		fetchWords();
	}, []);

	const getRowId = (params) => params.data.id;

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

	const handleDeleteClick = async () => {
		const confirmDelete = window.confirm(
			`You are about to delete ${selectedRows.length} word(s) from your list. Are you sure you want to do this?`
		);

		if (confirmDelete) {
			let deletePromise;
			let successMessage;
			let errorMessage;

			if (selectedRows.length === 1) {
				deletePromise = deleteOne(`api/word`, selectedRows[0]);
				successMessage = "Word successfully deleted.";
				errorMessage = "Delete request failed. Please try again.";
			} else {
				deletePromise = deleteMultiple(`api/word`, selectedRows);
				successMessage = "Words successfully deleted.";
				errorMessage = "Some delete requests failed. Please try again.";
			}

			const toastOptions = {
				pending: "Deleting...",
				success: successMessage,
				error: errorMessage,
			};

			const promiseToast = toast.promise(deletePromise, toastOptions);

			try {
				const deletedRows = await promiseToast;
				console.log(deletedRows);

				if (Array.isArray(deletedRows)) {
					// remove multiple rows from the grid
					const rowsToRemove = deletedRows
						.map((id) => gridRef.current.api.getRowNode(id.id))
						.filter((node) => node)
						.map((node) => node.data);
					gridRef.current.api.applyTransaction({
						remove: rowsToRemove,
					});
				} else {
					// remove one row from the grid
					gridRef.current.api.applyTransaction({
						remove: [gridRef.current.api.getRowNode(deletedRows.id).data],
					});
				}
			} catch (error) {
				console.error("Error deleting words:", error);
				toast.error("An error occurred. Please refresh the page.");
			}
		}
	};

	const handleEditConfirmation = async (rowId, data, confirmEdit) => {
		if (confirmEdit && data) {
			try {
				const updatedData = await toast.promise(
					putData(`api/word/${rowId}`, data),
					{
						pending: "Updating...",
						success: "Word successfully edited.",
						error: "Changes not saved. Please try again.",
					}
				);
				gridRef.current.api.applyTransaction({ update: [updatedData] }); //
			} catch (error) {
				console.error("Error editing word:", error);
				gridRef.current.api.refreshCells();
			}
		} else {
			gridRef.current.api.applyTransaction({ update: [originalRowData] });
		}
	};

	const handleCellValueChanged = async (event) => {
		const rowId = event.data.id;
		const flag = event.value;
		console.log(event);
		if (event.colDef.field === "statistics.flag") {
			try {
				await putData(`api/statistics/flag/${rowId}`, flag);
			} catch (error) {
				console.log(error);
				toast.error("Couldn't save, please try again.");
				// reset checkbox back to old value
			}
		}
	};

	const handleSearchChange = (event) => {
		const searchText = event.target.value;
		setQuickFilterText(searchText);
	};

	const bookFormatter = (params) => {
		if (params.value) {
			return `${params.value.title} (${params.value.author})`;
		}
		return "N/A";
	};

	// Row Data: The data to be displayed.
	// Column Definitions: Defines & controls grid columns.

	const [colDefs] = useState([
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
			valueFormatter: null,
			editable: false,
			cellRenderer: RootWordOffCanvas,
		},
		{ field: "book", headerName: "Book", valueFormatter: bookFormatter },
		{
			field: "statistics.flag",
			headerName: "Flag",
			width: 90,
			cellRenderer: "agCheckboxCellRenderer",
		},
	]);

	// Default column settings used for all columns (overridden by colDefs)
	const defaultColDef = useMemo(
		() => ({
			filter: true, // Enable filtering on all columns
			editable: true,
		}),
		[]
	);

	return (
		<>
			<Form className="mb-3" onSubmit={handleSubmit}>
				<Row>
					<Col xs={4} sm={3} md={2} lg={2} xl={1}>
						<Form.Select
							aria-label="Select language"
							name="sourceLanguage"
							value={formData.sourceLanguage}
							onChange={handleInputChange}
						>
							<option disabled>Language</option>
							<option value="NL">NL</option>
							<option value="FR">FR</option>
							<option value="ES">ES</option>
							<option value="EN-GB">EN</option>
						</Form.Select>
					</Col>
					<Col xs={8} sm={9} md={3} lg={3} xl={3}>
						<Form.Control
							placeholder="Word"
							name="word"
							value={formData.word}
							onChange={handleInputChange}
						/>
					</Col>
					<Col xs={9} sm={10} md={5} lg={5} xl={7} className="mt-2 mt-md-0">
						<Form.Control
							placeholder="Context sentence"
							name="contextSentence"
							value={formData.contextSentence}
							onChange={handleInputChange}
						/>
					</Col>
					<Col xs="auto" className="mt-1 mt-md-0">
						<Button type="submit">Add</Button>
					</Col>
				</Row>
			</Form>
			<Form.Control
				type="text"
				placeholder="Search"
				value={quickFilterText}
				onChange={handleSearchChange}
				className="m-auto mb-2"
			/>
			<div className={"ag-theme-quartz"} style={{ width: "100%", height: 600 }}>
				<AgGridReact
					ref={gridRef}
					rowData={rowData} // data from api call
					defaultColDef={defaultColDef} // default column settings
					columnDefs={colDefs} // column headings and settings
					pagination={true} // sorts data into pages
					quickFilterText={quickFilterText} // filters based on what is inputted in search bar
					onSelectionChanged={onSelectionChanged} // Event listener when selected rows changes
					onRowEditingStarted={onRowEditingStarted} // Event listener when editing starts
					onRowEditingStopped={onRowEditingStopped} // Event listener when editing stops
					onCellValueChanged={handleCellValueChanged} // Event listener for change of flagging words
					rowSelection="multiple" // Enable multiple row selection
					getRowId={getRowId} // so ID matches id in data
					editType="fullRow"
				/>
			</div>
			<Button onClick={handleDeleteClick} className="mb-2">
				Delete Selected
			</Button>
		</>
	);
}
