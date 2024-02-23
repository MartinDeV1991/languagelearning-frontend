import LineGraph from 'components/LineGraph';
import React, { useState } from "react";
import { Container, Dropdown } from "react-bootstrap";

export default function LogPage() {

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

				</div>

				<LineGraph type="correct" language1={sourceLanguage} language2={translatedTo} />
				<LineGraph type="tries" language1={sourceLanguage} language2={translatedTo} />
			</div>
			<div className='mb-5'></div>
		</Container>
	)
}