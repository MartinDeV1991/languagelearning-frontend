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
	const [numberToDisplay, setNumberToDisplay] = useState(20);

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

	const [numbers, setNumbers] = useState(Array.from({ length: 20 }, (_, index) => index + 1));

	const handleChange = (eventKey) => {
		setNumberToDisplay(eventKey);
	};

	const updateChart = async () => {
		const filteredData = rowData.filter((item) =>
			(sourceLanguage === 'all' || item.sourceLanguage === sourceLanguage) &&
			(translatedTo === 'all' || item.translatedTo === translatedTo) &&
			(partOfSpeech === 'all' || item.rootWord.partOfSpeech === partOfSpeech));

		// const dataWithLabels = filteredData.map((item) => ({
		// 	label: item.word,
		// 	data: item.statistics
		// 		? type === "correct"
		// 			? item.statistics.guessedCorrectly
		// 			: item.statistics.attempts
		// 		: 0,
		// }));
		const groupedData = filteredData.reduce((acc, item) => {
			const rootWord = item.rootWord.word;
			if (!acc[rootWord]) {
				acc[rootWord] = {
					rootWord: rootWord,
					guessedCorrectly: 0,
					attempts: 0
				};
			}

			if (item.statistics) {
				if (type === "correct") {
					acc[rootWord].guessedCorrectly += item.statistics.guessedCorrectly || 0;
				} else {
					acc[rootWord].attempts += item.statistics.attempts || 0;
				}
			}

			return acc;
		}, {});

		const dataWithLabels = Object.values(groupedData).map(item => ({
			label: item.rootWord,
			data: type === "correct" ? item.guessedCorrectly : item.attempts
		}));

		if (sortingOrder === "highest") {
			dataWithLabels.sort((a, b) => b.data - a.data);
		} else if (sortingOrder === "lowest") {
			dataWithLabels.sort((a, b) => a.data - b.data);
		}

		setNumbers(Array.from({ length: dataWithLabels.length }, (_, index) => index + 1));

		let slicedData = dataWithLabels.slice(0, numberToDisplay);
		const labels = slicedData.map((item) => item.label);
		const data = slicedData.map((item) => item.data);

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
	}, [type, translatedTo, sourceLanguage, partOfSpeech, sortingOrder, rowData, numberToDisplay]);

	return (
		<div
			className="chart-container mb-5"
			style={{ width: "800px", height: "300px" }}
		>
			<div style={{ display: 'flex' }}>
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

				<Dropdown onSelect={handleChange}>
					<Dropdown.Toggle variant="primary" id="dropdown-basic">
						{numberToDisplay}
					</Dropdown.Toggle>
					<Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
						{numbers.map((number) => (
							<Dropdown.Item key={number} eventKey={number}>
								{number}
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
			</div>
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
