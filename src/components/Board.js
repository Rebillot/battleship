import React, { useEffect, useState } from "react";

export default function Board({ ships, onSelectShip }) {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    const initialBoard = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        columns.push(
          <div
            key={`${row}-${col}`}
            className={`square ${ships.some((ship) => ship.row === row && ship.col === col) ? "ship-cell" : ""}`}
            onClick={() => onSelectShip(row, col)}
          ></div>
        );
      }
      initialBoard.push(<div className="board-row" key={row}>{columns}</div>);
    }
    setBoard(initialBoard);
  }, [ships, onSelectShip]);

  return <div className="board">{board}</div>;
}
