import Statistics from 'components/Statistics';
import React from 'react';
import { Container } from "react-bootstrap";

export default function StatisticsPage() {
	return (
		<Container className="mt-4">
			<h1 className="mb-4">My statistics</h1>
			<Statistics />
		</Container>
	)
}