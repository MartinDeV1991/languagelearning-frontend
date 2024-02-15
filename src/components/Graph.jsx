import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import { fetchData } from "utils/api";

Chart.register(CategoryScale);

const Graph = ({ choice }) => {
	let user_id = localStorage.getItem("languagelearning_id");

	const [rowData, setRowData] = useState([]);
	const [sortingOrder, setSortingOrder] = useState("normal");
	const handleSortingChange = (event) => {
		setSortingOrder(event);
	};

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label:
					choice === "correct"
						? "Number of Correct Guesses"
						: "Number of Total Attempts",
				data: [],
			},
		],
	});

	const updateChart = async () => {
		const dataWithLabels = rowData.map((item) => ({
			label: item.word,
			data: item.statistics
				? choice === "correct"
					? item.statistics.guessedCorrectly
					: item.statistics.attempts
				: 0,
		}));

		if (sortingOrder === "highest") {
			dataWithLabels.sort((a, b) => b.data - a.data);
		} else if (sortingOrder === "lowest") {
			dataWithLabels.sort((a, b) => a.data - b.data);
		}

		const labels = dataWithLabels.map((item) => item.label);
		const data = dataWithLabels.map((item) => item.data);

		setChartData({
			labels: labels,
			datasets: [
				{
					label:
						choice === "correct"
							? "Number of Correct Guesses"
							: "Number of Total Attempts",
					data: data,
				},
			],
		});
	};

	async function loadStats() {
		const data = await fetchData(`api/word/user/${user_id}`);
		setRowData(data);

		console.log("updating");
	}

	useEffect(() => {
		loadStats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		updateChart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [choice, sortingOrder, user_id, rowData]);

	return (
		<div
			className="chart-container mb-5"
			style={{ width: "800px", height: "300px" }}
		>
			<Dropdown onSelect={handleSortingChange}>
				<Dropdown.Toggle variant="primary" id="dropdown-basic">
					Sorting Order
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item eventKey="highest">Highest</Dropdown.Item>
					<Dropdown.Item eventKey="lowest">Lowest</Dropdown.Item>
					<Dropdown.Item eventKey="normal">Normal</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			<Bar
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text: `Number of ${
								choice === "correct" ? "Correct Guesses" : "Total Attempts"
							} by Word`,
						},
						legend: {
							display: true,
							position: "top",
						},
					},
				}}
			/>
		</div>
	);
};
export default Graph;
