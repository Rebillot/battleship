import React, { useState, useEffect } from "react";

export default function Board() {
  const [board, setBoard] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  useEffect(() => {
    const initialBoard = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        columns.push(
          <div
            key={`${row}-${col}`}
            className={`square ${selectedBoxes.includes(`${row}-${col}`) ? "selected" : ""}`}
            onClick={() => {
              setSelectedBoxes(prevSelectedBoxes => [...prevSelectedBoxes, `${row}-${col}`]);
            }}
          ></div>
        );
      }
      initialBoard.push(columns);
    }
    setBoard(initialBoard);
  }, [selectedBoxes]);

  return <div className="board">{board}</div>;
}
