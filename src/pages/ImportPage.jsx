import UploadCSV from "components/UploadCSV";
import UploadKindleDB from "components/UploadKindleDB";
import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

export default function ImportPage() {
	return (
		<Container className="mt-4">
			<h1 className="mb-4">Import vocabulary</h1>
			<Tabs
				defaultActiveKey="kindle"
				id="uncontrolled-tab-example"
				className="mb-3"
			>
				<Tab eventKey="kindle" title="From Kindle">
					<UploadKindleDB />
				</Tab>
				<Tab eventKey="csv" title="From CSV file">
					<UploadCSV />
				</Tab>
				<Tab eventKey="text" title="From text" disabled>
					Import from text here
				</Tab>
			</Tabs>
		</Container>
	);
}
