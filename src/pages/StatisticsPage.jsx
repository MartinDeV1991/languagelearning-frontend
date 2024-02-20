import Statistics from 'components/Statistics';
import Graph from 'components/Graph';
import React, { useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";

export default function StatisticsPage() {

	const [sourceLanguage, setSourceLanguage] = useState('all');
	const [translatedTo, setTranslatedTo] = useState('all');
	const [partOfSpeech, setPartOfSpeech] = useState('all');

	const handleSourceLanguageChange = (event) => {
		setSourceLanguage(event);
	};

	const handleTranslatedLanguageChange = (event) => {
		setTranslatedTo(event);
	};

	const handlePartOfSpeechChange = (event) => {
		setPartOfSpeech(event);
	};

	return (
		<Container className="mt-4">
			<h1 className="mb-3">My statistics</h1>

			<div className="mb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<Dropdown onSelect={handleSourceLanguageChange}>
						<Dropdown.Toggle variant="secondary" id="dropdown-basic">
							Language from
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">all</Dropdown.Item>
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
							Language to
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">all</Dropdown.Item>
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
							Part of speech
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey="all">all</Dropdown.Item>
							<Dropdown.Item eventKey="verb">verb</Dropdown.Item>
							<Dropdown.Item eventKey="noun">noun</Dropdown.Item>
							<Dropdown.Item eventKey="interjection">interjection</Dropdown.Item>
							<Dropdown.Item eventKey="adverb">adverb</Dropdown.Item>
							<Dropdown.Item eventKey="adjective">adjective</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

				</div>

				<Graph type="correct" language1={sourceLanguage} language2={translatedTo} speechType={partOfSpeech} />
				<Graph type="attempt" language1={sourceLanguage} language2={translatedTo} speechType={partOfSpeech} />
			</div>
			<Statistics />
			<div className='mb-5'></div>
		</Container>
	)
}