import React, { useEffect, useState, } from "react";
import { useTurn } from "./Context/Context";

// Game over modal component
function GameOverModal({ isVisible, onRestart }) {
  return (
    isVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Game Over!</h2>
          <h3>your fleet has vanished</h3>
          <img src="https://i.pinimg.com/originals/09/df/6b/09df6ba48147dc142373d2a2bc599801.gif" alt="game over" />

          <button onClick={onRestart}>Play Again</button>
        </div>
      </div>
    )
  );
}

// Board main component

/**
 * Board component for the Battleship game.
 * @param {Object[]} ships - Array of ship objects with row, col, and type properties.
 * @param {function} onSelectShip - Function to handle selecting a ship on the board.
 * @returns {JSX.Element} Board component JSX.
 */
export default function Board({ ships, onSelectShip }) {
  const [board, setBoard] = useState([]);
  const [gamePhase, setGamePhase] = useState("positioning"); // positioning or playing
  const [gameOver, setGameOver] = useState(false);
  const [attackedCount, setAttackedCount] = useState(0);
  const { hits, setHits, misses, setMisses, currentTurn, toggleTurn } = useTurn();


  // reset game function

  function resetGame() {
    setBoard([]);
    setGamePhase("positioning");
    setGameOver(false);
    setAttackedCount(0);
    setHits([]);
    setMisses([]);
    window.location.reload();

  }

  // useEffect to check if the computer has won the game

  useEffect(() => {
    if (hits.length === ships.length && ships.length !== 0) {
      setGameOver(true);
    }
  }, [hits, ships]);


  // Computer logic to attack the player's board

  const isHit = (row, col) => hits.some(h => h.row === row && h.col === col);
  const isMiss = (row, col) => misses.some(m => m.row === row && m.col === col);
  const isAttacked = (row, col) => isHit(row, col) || isMiss(row, col);
  const [lastHits, setLastHits] = useState([])


  // function to get the adjacent square to a hit square
  const getUnexploredAdjacentSquare = () => {
    const allDirections = ['up', 'down', 'left', 'right'];
    for (let hit of lastHits) {
      for (let dir of allDirections) {
        let newRow = hit.row, newCol = hit.col;
        switch (dir) {
          case 'up':
            newRow--;
            break;
          case 'down':
            newRow++;
            break;
          case 'left':
            newCol--;
            break;
          case 'right':
            newCol++;
            break;
          default:
            break;
        }
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && !isAttacked(newRow, newCol)) {
          return { row: newRow, col: newCol };
        }
      }
    }
    return null;
  };

  // function to attack the player's board
  const attackBoard = () => {
    let row, col, shipAtPosition;

    const nextSquare = getUnexploredAdjacentSquare();
    if (nextSquare) {
      row = nextSquare.row;
      col = nextSquare.col;
    } else {
      let attempts = 0;
      do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        attempts++;
        if (attempts > 100) {
          return;
        }
      } while (isAttacked(row, col));
    }

    shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
    if (shipAtPosition) {
      setHits(prevHits => [...prevHits, { row, col, source: 'computer' }]);
      setLastHits(prevLastHits => [...prevLastHits, { row, col }]);
    } else {
      if (nextSquare) {
        // This was a calculated attack based on a hit, but it missed. Remove the hit from lastHits.
        setLastHits(prevLastHits => prevLastHits.filter(hit => !(hit.row === nextSquare.row && hit.col === nextSquare.col)));
      }
      setMisses(prevMisses => [...prevMisses, { row, col, source: 'computer' }]);
    }

    setAttackedCount(prevCount => prevCount + 1);
  };


  // interval to count atacks, and toggle turns. the board is 100 squares, so the computer will attack 100 times, and then the game will end.
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTurn === "computer" && attackedCount < 100) {
        attackBoard();
        toggleTurn();
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);

  }, [currentTurn, toggleTurn, hits, misses, ships, attackedCount]);


  // useEffect to render the board, and check for hits and misses

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
              if (!onSelectShip) { 
                console.error('No ship selected');
                return;
              }
              
              if (gamePhase === "positioning" && ships.length < 17) {
                onSelectShip(row, col);
              } else if (gamePhase === "playing") {
                const shipAtPosition = ships.find(ship => ship.row === row && ship.col === col);
                if (shipAtPosition && !isAttacked(row, col)) {
                  setHits(prevHits => [...prevHits, { row, col, source: 'player' }]);
                } else if (!shipAtPosition && !isAttacked(row, col)) {
                  setMisses(prevMisses => [...prevMisses, { row, col, source: 'player' }]);
                }
              }
            }}
          ></div>
        );
      }

      initialBoard.push(<div className="board-row" key={row}>{columns}</div>);
    }
    setBoard(initialBoard);
  }, [ships, onSelectShip, hits, misses, currentTurn, toggleTurn]);

  return (
    <div className="board">
      <GameOverModal isVisible={gameOver} onRestart={resetGame} />
      {board}
    </div>
  );
}