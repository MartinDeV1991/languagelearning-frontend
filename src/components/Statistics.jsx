import React, { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

import { toast } from "react-toastify";
import { fetchData, putData } from "utils/api";

const Statistics = () => {

    let user_id = localStorage.getItem("languagelearning_id");

    const getRowId = (params) => params.data.id;

    const [quickFilterText, setQuickFilterText] = useState("");

    const [rowData, setRowData] = useState([]);
    const [colDefs] = useState([

        { field: "sourceLanguage", headerName: "📖", width: 80, editable: false },
        { field: "translatedTo", headerName: "📖", width: 80, editable: false },
        { field: "word", editable: false },
        { field: "statistics.guessedCorrectly", editable: false },
        { field: "statistics.attempts", editable: false },
        {
            field: "ratio",
            headerName: "Ratio",
            valueGetter: params => {
                if (params.data.statistics) {
                    const guessedCorrectly = params.data.statistics.guessedCorrectly;
                    const attempts = params.data.statistics.attempts;
                    const ratio = attempts === 0 ? 0 : guessedCorrectly / attempts;
                    return Math.round(ratio * 100) + "%";
                } else {
                    return "0%";
                }
            },
            editable: false,
            width: 100
        },
        { field: "statistics.flag", headerName: "Flag", width: 100 },
    ]);

    const defaultColDef = useMemo(
        () => ({
            filter: true,
            editable: true,
        }),
        []
    );

    async function fetchStats() {
        const rowData = await fetchData(`api/word/user/${user_id}`);
        setRowData(await rowData);
    }

    useEffect(() => {
        fetchStats();
    }, []);


    const handleCellValueChanged = async (event) => {
        const rowId = event.data.id;
        const flag = event.value;
        if (event.colDef.field === "statistics.flag") {
            try {
                await putData(`api/statistics/flag/${rowId}`, flag);
                console.log("changing: ", rowId)
            } catch (error) {
                console.log(error);
                toast.error("Couldn't save, please try again.");
            }
        }
    };

    const handleSearchChange = (event) => {
        const searchText = event.target.value;
        setQuickFilterText(searchText);
    };

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
                    onCellValueChanged={handleCellValueChanged} // Event listener for change of flagging words
                    getRowId={getRowId} // so ID matches id in data
                    quickFilterText={quickFilterText}
                />
            </div>
        </>
    );
}

export default Statistics;
