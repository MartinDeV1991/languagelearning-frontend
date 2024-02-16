import Statistics from 'components/Statistics';
import Graph from 'components/Graph';
import React, { useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";

export default function StatisticsPage() {

	const [sourceLanguage, setSourceLanguage] = useState('NL');
	const [translatedTo, setTranslatedTo] = useState('EN-GB');

	const handleSourceLanguageChange = (event) => {
		setSourceLanguage(event);
	};

	const handleTranslatedLanguageChange = (event) => {
		setTranslatedTo(event);
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
							<Dropdown.Item eventKey="NL">NL</Dropdown.Item>
							<Dropdown.Item eventKey="EN-GB">EN-GB</Dropdown.Item>
							<Dropdown.Item eventKey="EN">EN</Dropdown.Item>
							<Dropdown.Item eventKey="FR">FR</Dropdown.Item>
							<Dropdown.Item eventKey="ES">ES</Dropdown.Item>
							<Dropdown.Item eventKey="DE">DE</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>

				<Graph type="correct" language1={sourceLanguage} language2={translatedTo} />
				<Graph type="attempt" language1={sourceLanguage} language2={translatedTo} />
			</div>
			<Statistics />
			<div className='mb-5'></div>
		</Container>
	)
}