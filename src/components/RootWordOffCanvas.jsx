import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteOne, putData } from "utils/api";

export default function RootWordOffCanvas(params) {
	const [rootWord, setRootWord] = useState(params.value);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const generateRootWord = async (wordID) => {
		try {
			const promiseToast = toast.promise(putData(`api/word/${wordID}/root`), {
				pending: "Generating...",
				success: "Root word generated.",
				error: "Could not generate root for that word. Please try again.",
			});

			const response = await promiseToast;
			setRootWord(response);
		} catch (error) {
			console.error("Error generating root word:", error);
			toast.error("An error occurred. Please try again.");
		}
	};

	const deleteRootWord = async (rootWordID) => {
		try {
			const responses = await deleteOne("api/root-word", rootWordID);
			if (responses[0].ok) {
				setShow(false);
				setRootWord(null);
				toast.success("Deleted root word.");
			} else throw Error("Delete request failed.");
		} catch (error) {
			console.log(error);
			toast.error("Couldn't delete that root word. Please try again.");
		}
	};
	const unlinkRootWord = async (rootWordID, wordID) => {
		// write backend endpoint to unlink word and root word
		console.log(rootWordID);
		console.log(wordID);
	};

	return (
		<>
			{rootWord === null ? (
				<Button onClick={() => generateRootWord(params.data.id)} size="sm">
					Generate
				</Button>
			) : (
				<>
					<Button size="sm" variant="secondary" onClick={handleShow}>
						{rootWord.word} ({rootWord.partOfSpeech})
					</Button>

					<Offcanvas show={show} onHide={handleClose} placement="bottom">
						<Offcanvas.Header closeButton>
							<Offcanvas.Title>
								<h2>{rootWord.word}</h2>
								<h3>{rootWord.partOfSpeech}</h3>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<h4>Definition: {rootWord.definitionInEnglish}</h4>
							<Button onClick={() => deleteRootWord(rootWord.id)}>
								Delete
							</Button>
							<Button
								onClick={() => unlinkRootWord(rootWord.id, params.data.id)}
							>
								Unlink
							</Button>
						</Offcanvas.Body>
					</Offcanvas>
				</>
			)}
		</>
	);
}
