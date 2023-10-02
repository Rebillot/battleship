import React, { useEffect, useState } from "react";

export default function Board({ ships, onSelectShip }) {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    const initialBoard = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        const shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
        const shipClass = shipAtPosition ? shipAtPosition.type : "";

        columns.push(
          <div
            key={`${row}-${col}`}
            className={`square ${shipClass}`}
            onClick={() => {
              if (onSelectShip) {
                onSelectShip(row, col);
              }
            }}
          ></div>
        );
      }
      initialBoard.push(<div className="board-row" key={row}>{columns}</div>);
    }
    setBoard(initialBoard);
  }, [ships, onSelectShip]);

  return <div className="board">{board}</div>;
}
