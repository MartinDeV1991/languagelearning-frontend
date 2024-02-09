import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { fetchData } from "utils/api";
import { flagFormatter } from "utils/formatter";

export default function BooksCards() {
	const [books, setBooks] = useState([]);

	const fetchBooks = async () => {
		setBooks(await fetchData("api/books"));
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	return (
		<Row xs={1} sm={1} md={2} lg={3} xxl={4} className="g-3">
			{books &&
				books.map((item) => {
					return (
						<Col key={item.id}>
							<Card>
								<Card.Body>
									<Card.Title>
										{item.title} {flagFormatter({ value: item.language })}
									</Card.Title>
									<Card.Subtitle className="mb-2 text-muted">
										{item.author}
									</Card.Subtitle>
									<Card.Link
										href={`https://www.goodreads.com/book/isbn/${item.isbn}`}
										target="_blank"
										rel="noreferrer"
									>
										View on GoodReads
									</Card.Link>
								</Card.Body>
							</Card>
						</Col>
					);
				})}
		</Row>
	);
}
