import Statistics from 'components/Statistics';
import Graph from 'components/Graph';
import React from 'react';
import { Container } from "react-bootstrap";

export default function StatisticsPage() {
	return (
		<Container className="mt-4">
			<h1 className="mb-4">My statistics</h1>
			<Statistics />
			<div className="mb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Graph choice="correct" />
                <Graph choice="attempt" />
            </div>
		</Container>
	)
}