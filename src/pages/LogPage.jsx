import LineGraph from 'components/LineGraph';
import React, { useState, useEffect } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { fetchData } from 'utils/api';

export default function LogPage() {
	let user_id = localStorage.getItem("languagelearning_id");

	const [sourceLanguage, setSourceLanguage] = useState('all');
	const [translatedTo, setTranslatedTo] = useState('all');
	const [partOfSpeech, setPartOfSpeech] = useState('all');
	const [data, setData] = useState([]);

	const handlePartOfSpeechChange = (event) => {
		setPartOfSpeech(event);
	};

	async function loadStats() {
		const data = await fetchData(`api/user/${user_id}`);
		if (data && data.hasOwnProperty('log')) {
			setData(data.log);
		}
	}

	useEffect(() => {
		loadStats();
	}, []);

	return (
		<Container className="mt-4">
			<h1 className="mb-3">My statistics</h1>

			<div className="mb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<Dropdown onSelect={(event) => setSourceLanguage(event)}>
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

					<Dropdown onSelect={(event) => setTranslatedTo(event)}>
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

				</div>

				<LineGraph type="correct" language1={sourceLanguage} language2={translatedTo} data = {data} />
				<LineGraph type="tries" language1={sourceLanguage} language2={translatedTo} data = {data}/>
			</div>
			<div className='mb-5'></div>
		</Container>
	)
}