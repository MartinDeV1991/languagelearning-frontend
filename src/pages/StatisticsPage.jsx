import Statistics from 'components/Statistics';
import Graph from 'components/Graph';
import React, { useState, useEffect } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { fetchData } from "utils/api";

export default function StatisticsPage() {

	const [sourceLanguage, setSourceLanguage] = useState('all');
	const [translatedTo, setTranslatedTo] = useState('all');
	const [partOfSpeech, setPartOfSpeech] = useState('all');

	const [data, setData] = useState([]);

	let user_id = localStorage.getItem("languagelearning_id");

	const handleSourceLanguageChange = (event) => {
		setSourceLanguage(event);
	};

	const handleTranslatedLanguageChange = (event) => {
		setTranslatedTo(event);
	};

	const handlePartOfSpeechChange = (event) => {
		setPartOfSpeech(event);
	};

	useEffect(() => {
		async function fetchStats() {
			const data = await fetchData(`api/word/user/${user_id}`);
			setData(data);
		}
		fetchStats();
	}, [user_id]);

	return (
		<Container className="mt-4">
			<h1 className="mb-3">My statistics</h1>

			<div className="mb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<Dropdown onSelect={handleSourceLanguageChange}>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
							{sourceLanguage === "all" ? "All source languages" : sourceLanguage}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">All source languages</Dropdown.Item>
							<Dropdown.Item eventKey="NL">NL</Dropdown.Item>
							<Dropdown.Item eventKey="EN-GB">EN-GB</Dropdown.Item>
							<Dropdown.Item eventKey="EN">EN</Dropdown.Item>
							<Dropdown.Item eventKey="FR">FR</Dropdown.Item>
							<Dropdown.Item eventKey="ES">ES</Dropdown.Item>
							<Dropdown.Item eventKey="DE">DE</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown onSelect={handleTranslatedLanguageChange}>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
							{translatedTo === "all" ? "All target languages" : translatedTo}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">All target languages</Dropdown.Item>
							<Dropdown.Item eventKey="NL">NL</Dropdown.Item>
							<Dropdown.Item eventKey="EN-GB">EN-GB</Dropdown.Item>
							<Dropdown.Item eventKey="EN">EN</Dropdown.Item>
							<Dropdown.Item eventKey="FR">FR</Dropdown.Item>
							<Dropdown.Item eventKey="ES">ES</Dropdown.Item>
							<Dropdown.Item eventKey="DE">DE</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown onSelect={handlePartOfSpeechChange}>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
							{partOfSpeech === "all" ? "All parts of speech" : partOfSpeech}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">All parts of speech</Dropdown.Item>
							<Dropdown.Item eventKey="verb">verb</Dropdown.Item>
							<Dropdown.Item eventKey="noun">noun</Dropdown.Item>
							<Dropdown.Item eventKey="interjection">interjection</Dropdown.Item>
							<Dropdown.Item eventKey="adverb">adverb</Dropdown.Item>
							<Dropdown.Item eventKey="adjective">adjective</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

				</div>

				<Graph type="correct" language1={sourceLanguage} language2={translatedTo} speechType={partOfSpeech} data={data} />
				<Graph type="attempt" language1={sourceLanguage} language2={translatedTo} speechType={partOfSpeech} data={data} />
			</div>
			<Statistics data={data} />
			<div className='mb-5'></div>
		</Container>
	)
}