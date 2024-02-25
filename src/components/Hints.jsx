import React from "react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Hints = ({ answers, sentenceOriginal, sentenceTranslated, currentQuestionIndex }) => {

    const [hint1, setHint1] = useState(false);
    const [hint2, setHint2] = useState(false);
    const [hint3, setHint3] = useState(false);

    useEffect(() => {
        setHint1(false);
        setHint2(false);
        setHint3(false);
    }, [currentQuestionIndex]);

    return (
        <div>
            <Button onClick={() => setHint1(!hint1)}>Hint 1</Button>
            <Button onClick={() => setHint2(!hint2)}>Hint 2</Button>
            <Button onClick={() => setHint3(!hint3)}>Hint 3</Button>

            {
                hint1 && (
                    <div>
                        <strong>hint 1</strong>:{" "}
                        {Array.from(answers[currentQuestionIndex])
                            .map((char) => (char === " " ? " " : "*"))
                            .join("")}
                    </div>
                )
            }
            {
                hint2 && (
                    <div>
                        <strong>hint 2</strong>:{" "}
                        {sentenceOriginal[currentQuestionIndex]}
                    </div>
                )
            }
            {
                hint3 && (
                    <div>
                        <strong>hint 3</strong>:{" "}
                        {sentenceTranslated[currentQuestionIndex]}
                    </div>
                )
            }
        </div>
    )
}
export default Hints;