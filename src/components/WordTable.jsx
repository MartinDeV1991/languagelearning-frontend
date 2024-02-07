import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import RootWordOffCanvas from "./RootWordOffCanvas";
import { deleteData, fetchData, putData } from "utils/api";
import { flagFormatter } from "utils/formatter";

export default function WordTable() {
	const gridRef = React.useRef(null);
	let user_id = localStorage.getItem("languagelearning_id");
	const [quickFilterText, setQuickFilterText] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [originalRowData, setOriginalRowData] = useState([]);

	async function fetchWords() {
		const rowData = await fetchData(`api/word/user/${user_id}`);
		// const rowData = await fetchData(`api/word`);
		setRowData(await rowData); // Update state of `rowData` to the fetched data
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
			const promiseToast = toast.promise(deleteData(`api/word`, selectedRows), {
				pending: "Deleting...",
				success: "Words successfully deleted.",
				error: "Some delete requests failed. Please try again.",
			});

			try {
				const responses = await promiseToast;

				const allSucceeded = responses.every((response) => response.ok);
				if (allSucceeded) {
					// Directly remove the rows from the grid using the row ID
					const rowsToRemove = selectedRows
						.map((id) => gridRef.current.api.getRowNode(id))
						.filter((node) => node)
						.map((node) => node.data);
					gridRef.current.api.applyTransaction({ remove: rowsToRemove });
				}
			} catch (error) {
				console.error("Error deleting words:", error);
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

	const handleSearchChange = (event) => {
		const searchText = event.target.value;
		setQuickFilterText(searchText);
	};

	// Row Data: The data to be displayed.
	// Column Definitions: Defines & controls grid columns.
	const [rowData, setRowData] = useState([]);
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
			<Form.Control
				type="text"
				placeholder="Search"
				value={quickFilterText}
				onChange={handleSearchChange}
				className="mb-2"
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
					rowSelection="multiple" // Enable multiple row selection
					getRowId={getRowId} // so ID matches id in data
					editType="fullRow"
				/>
			</div>
			<Button onClick={handleDeleteClick} className="mb-2">
				Delete Selected
			</Button>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme="light"
			/>
		</>
	);
}
