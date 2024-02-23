import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import { compareDesc } from "date-fns";
import { fetchData } from "utils/api";

Chart.register(CategoryScale);

const LineGraph = ({ type, language1, language2 }) => {
	let user_id = localStorage.getItem("languagelearning_id");

	const sourceLanguage = language1;
	const translatedTo = language2;

	const [rowData, setRowData] = useState([]);

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label:
					type === "correct"
						? "Number of Correct Guesses"
						: "Number of quizes done",
				data: [],
			},
		],
	});

	function calculateAverage(array) {
		var sum = array.reduce(function (a, b) { return a + b; }, 0);
		return sum / array.length;
	}

	const updateChart = async () => {
		console.log("data: ", rowData)
		const filteredData = rowData.filter((item) =>
			(sourceLanguage === 'all' || item.sourceLanguage === sourceLanguage) &&
			(translatedTo === 'all' || item.targetLanguage === translatedTo));

		const dataWithLabels = filteredData.map((item) => ({
			label: item.date,
			data: type === "correct" ? item.numberOfCorrectAnswers : item.numberOfQuestions
		}));

		dataWithLabels.sort((a, b) => compareDesc(b.label, a.label));

		let data;
		let labels;

		// Group the data by date
		var groupedData = {};
		dataWithLabels.forEach(function (item) {
			if (!groupedData[item.label]) {
				groupedData[item.label] = [];
			}
			groupedData[item.label].push(item.data);
		});

		// Calculate the average for each date
		var averages = {};
		let tries = {};
		Object.keys(groupedData).forEach(function (date) {
			averages[date] = calculateAverage(groupedData[date]);
			tries[date] = groupedData[date].length;
		});

		if (type === "correct") {
			labels = Object.keys(averages);
			data = Object.values(averages);
		} else {
			labels = Object.keys(tries);
			data = Object.values(tries);
		}

		setChartData({
			labels: labels,
			datasets: [
				{
					label: type === "correct"
						? "Number of Correct Guesses"
						: "Number of quizes done",
					data: data,
					backgroundColor: "rgba(75, 192, 192, 0.3)",
					borderColor: "rgb(75, 192, 192)",
					borderWidth: 5
				},
			],
		});
	};

	async function loadStats() {
		const data = await fetchData(`api/user/${user_id}`);
		setRowData(data.log);
		console.log("updating");
	}

	useEffect(() => {
		loadStats();
	}, []);

	useEffect(() => {
		updateChart();
	}, [user_id, type, translatedTo, sourceLanguage, rowData]);

	return (
		<div
			className="chart-container mb-5"
			style={{ width: "800px", height: "300px" }}
		>
			<Line
				data={chartData}
				options={{
					plugins: {
						title: {
							display: false,
							text: `Number of Correct Guesses`,
						},
						legend: {
							display: true,
							position: "top",
						},
					},
					scales: {
						y: {
							suggestedMin: 0,
						},
					},
				}}
			/>
		</div>
	);
};
export default LineGraph;
