import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

const Graph = ({ type, language1, language2, speechType, data }) => {
	const rowData = data;
	const sourceLanguage = language1;
	const translatedTo = language2;
	const partOfSpeech = speechType;

	const [sortingOrder, setSortingOrder] = useState("normal");

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label:
					type === "correct"
						? "Number of Correct Guesses"
						: "Number of Total Attempts",
				data: [],
			},
		],
	});

	const updateChart = async () => {
		const filteredData = rowData.filter((item) =>
			(sourceLanguage === 'all' || item.sourceLanguage === sourceLanguage) &&
			(translatedTo === 'all' || item.translatedTo === translatedTo) &&
			(partOfSpeech === 'all' || item.rootWord.partOfSpeech === partOfSpeech));

		const dataWithLabels = filteredData.map((item) => ({
			label: item.word,
			data: item.statistics
				? type === "correct"
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
					label: type === "correct"
						? "Number of Correct Guesses"
						: "Number of Total Attempts",
					data: data,
					backgroundColor: type === "correct"
						? "rgba(75, 192, 192, 0.3)"
						: "rgba(54, 162, 235, 0.3)",
					borderColor: type === "correct"
						? "rgb(75, 192, 192)"
						: "rgb(54, 162, 235)",
					borderWidth: 1
				},
			],
		});
	};

	useEffect(() => {
		if (rowData) {
			updateChart();
		}
	}, [type, translatedTo, sourceLanguage, partOfSpeech, sortingOrder, rowData]);

	return (
		<div
			className="chart-container mb-5"
			style={{ width: "800px", height: "300px" }}
		>
			<Dropdown onSelect={(event) => setSortingOrder(event)}>
				<Dropdown.Toggle variant="primary" id="dropdown-basic">
					Sorted: {sortingOrder}
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
							display: false,
							text: `Number of ${type === "correct" ? "Correct Guesses" : "Total Attempts"
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
