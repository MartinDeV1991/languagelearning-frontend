import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadFile } from "utils/api";

export default function UploadKindleDB() {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [data, setData] = useState("");

	const handleFileChange = (e) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		console.log(file);
		setUploading(true);
		try {
			const response = await uploadFile(`api/file/db-to-csv`, file);
			console.log(response);

			setData(await response.text());
			setUploading(false);
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	return (
		<>
			<h4>Upload vocab.db file here</h4>
			<p>
				Plug your Kindle into the computer and search for a file called{" "}
				<b>vocab.db</b>. This is where the Kindle stores information about the
				words you look up while reading. Upload it here to extract the data.{" "}
			</p>
			<p>
				In the next step you can download the raw data or choose which words to
				save in your account.
			</p>
			<Col className="m-auto mb-3">
				<Form.Group controlId="formFile" className="mb-3">
					<Form.Control type="file" onChange={handleFileChange} />
				</Form.Group>
				<Row className="justify-items-between">
					<Col>{uploading && <p>Uploading...</p>}</Col>
					<Col className="d-flex justify-content-end">
						<Button
							onClick={handleUpload}
							variant="primary"
							type="submit"
							className="ms-auto"
							disabled={uploading}
						>
							Upload
						</Button>
					</Col>
				</Row>
				{data && (
					<Row className="justify-items-between">
						<Col>
							<h5>CSV formatted data:</h5>
							<pre>{data}</pre> {/* Display CSV data */}
						</Col>
					</Row>
				)}
			</Col>
		</>
	);
}
