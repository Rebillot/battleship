import React, { useEffect, useState } from "react";
import { useTurn } from "./Context/Context";

export default function Board({ ships, onSelectShip }) {
  const [board, setBoard] = useState([]);
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);
  const [attackedCount, setAttackedCount] = useState(0);
  const { currentTurn, toggleTurn } = useTurn();
 


// bot
  const isHit = (row, col) => hits.some(h => h.row === row && h.col === col);
  const isMiss = (row, col) => misses.some(m => m.row === row && m.col === col);
  const isAttacked = (row, col) => isHit(row, col) || isMiss(row, col);
  const attackRandomSquare = () => {
    let row, col, shipAtPosition;
    let attempts = 0;
  
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
      attempts++;
  
      if (attempts > 100) {
        return;
      }
    } while (isAttacked(row, col));
  
    if (shipAtPosition) {
      setHits(prevHits => [...prevHits, { row, col }]);
    } else {
      setMisses(prevMisses => [...prevMisses, { row, col }]);
    }
    setAttackedCount(prevCount => prevCount + 1);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTurn === "computer" && attackedCount < 100) {
        attackRandomSquare();
        toggleTurn();
        console.log("player turn")
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval); 
    
}, [currentTurn, toggleTurn, hits, misses, ships, attackedCount]);

  useEffect(() => {
    const initialBoard = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        const shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
        const shipClass = shipAtPosition ? shipAtPosition.type : "";
        const attackClass = isHit(row, col) ? "hit" : isMiss(row, col) ? "miss" : "";

        columns.push(
          <div
            key={`${row}-${col}`}
            className={`square ${shipClass} ${attackClass}`}
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
  }, [ships, onSelectShip, hits, misses, currentTurn, toggleTurn]);

  return <div className="board">{board}</div>;
}
