import React, { useEffect, useState, useRef } from "react";
import ShipArray from "./ShipConstructor.js";
import GameOverModal from "./GameOverModal.js";
import { useTurn } from "./Context/Context.js";



const generateRandomShips = () => {
  const randomShips = [];
  const availableRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const availableCols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 5; i++) {
    const shipObject = ShipArray[i];
    const shipLength = shipObject.length;
    const randomRow = availableRows.splice(
      Math.floor(Math.random() * availableRows.length),
      1
    )[0];
    const randomCol = availableCols.splice(
      Math.floor(Math.random() * availableCols.length),
      1
    )[0];

    randomShips.push({
      ship: shipObject,
      length: shipLength,
      row: randomRow,
      col: randomCol,
    });
  }
  return randomShips;
};

export default function ComputerBoard() {
  const [ships, setShips] = useState([]);
  const [lastClicked, setLastClicked] = useState(null);
  const [missedShots, setMissedShots] = useState([]); // [ [row, col], [row, col], ...
  const coordinatesRef = useRef([]);
  const { currentTurn, toggleTurn, hits, setHits, misses, setMisses, playerhits, setPlayerHits, playermisses, setPlayerMisses } = useTurn();
  const [gameOver, setGameOver] = useState(false);





  const handlePlayerAttack = (row, col) => {
    let attackedShipIndex = -1;

    for (let ship of ships) {
      for (let i = 0; i < ship.length; i++) {
        if (ship.row + i === row && ship.col === col) {
          attackedShipIndex = ships.indexOf(ship);
          break;
        }
      }
      if (attackedShipIndex !== -1) break;
    }  /*starting point for the ship*/

    if (attackedShipIndex !== -1) {
      setPlayerHits(prevHits => [...prevHits, { row, col }]);


      const updatedShips = [...ships];
      const ship = updatedShips[attackedShipIndex];
      ship.hits += 1;

      if (ship.hits === ship.length) {
        ship.status = 'destroyed';
      } else {
        ship.status = 'hit';
      }
      if (ship.hits === ship.length) {
        ship.status = 'destroyed';
      
        // Check if all ships are destroyed
        const allShipsDestroyed = updatedShips.every(ship => ship.status === 'destroyed');
        if (allShipsDestroyed) {
          setGameOver(true);
          // You can display a message or take any other action here
        }
      } else {
        ship.status = 'hit';
      }
      

      setShips(updatedShips);
    } else {
      setPlayerMisses(prevMisses => [...prevMisses, { row, col }]);
      setMissedShots([...missedShots, [row, col]]);
    }
  };


  const handleSquareClick = (row, col) => {
    if (gameOver) return;
    if (currentTurn === "player") {
      const clickedCoordinates = [row, col];

      if (!coordinatesRef.current.some(coord => coord[0] === row && coord[1] === col)) {
        coordinatesRef.current = [...coordinatesRef.current, clickedCoordinates];
        handlePlayerAttack(row, col);
        setLastClicked(clickedCoordinates);
        toggleTurn();
      }
    }
  };
  
  const handlePlaceShip = (row, col, shipLength, ships) => {
    const newShips = [...ships];
    const directions = [
      [1, 0],  // right
      [0, 1],  // down 
    ];

    for (let dir of directions) {
      const [rowDir, colDir] = dir;
      let canPlaceShip = true;

      for (let i = 0; i < shipLength; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;

        const isOutOfBounds = newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10;
        const isOverlapping = newShips.some((ship) => ship.row === newRow && ship.col === newCol);

        if (isOutOfBounds || isOverlapping) {
          canPlaceShip = false;
          break;
        }
      }

      if (canPlaceShip) {
        for (let i = 0; i < shipLength; i++) {
          const newRow = row + i * rowDir;
          const newCol = col + i * colDir;

          newShips.push({ type: "Computer Ship", row: newRow, col: newCol, length: shipLength });
        }
        return newShips;
      }
    }

    return ships;
  };

  const initializeGame = () => {
    setGameOver(false);
    // Initialize the game for the computer's turn (randomly place computer ships)
    const randomShips = generateRandomShips();
    let ships = randomShips;

    for (let i = 0; i < ships.length; i++) {
      ships = handlePlaceShip(
        ships[i].row,
        ships[i].col,
        ships[i].length,
        ships
      );
    }
    ships = ships.map(ship => ({ ...ship, hits: 0, status: 'intact' }));

    coordinatesRef.current = [];
    setShips(ships);


  };

  const renderBoard = () => {
    const boardElements = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        const isSquareClicked = coordinatesRef.current.some(coord => coord[0] === row && coord[1] === col);

        let shipAtPosition;
        for (let ship of ships) {
          for (let i = 0; i < ship.length; i++) {
            if (ship.row + i === row && ship.col === col) {
              shipAtPosition = ship;
              break;
            }
          }
          if (shipAtPosition) break;
        }

        let squareClass = 'square';

        if (isSquareClicked) {
          if (shipAtPosition) {
            squareClass += ` ${shipAtPosition.status}`;  // add hit or destroyed class
            console.log(shipAtPosition, "shipAtPosition.status")
          } else {
            squareClass += ' missed';  // missed shot
          }
        }

        columns.push(
          <div
            key={`${row}-${col}`}
            className={`${squareClass} ${shipAtPosition ? shipAtPosition.ship.name : ''}`}
            onClick={() => handleSquareClick(row, col)}
          ></div>
        );
      }
      boardElements.push(<div className="board-row" key={row}> {columns} </div>);
    }

    return boardElements;
  };




  useEffect(() => {
    initializeGame();
  }, []);


  return (
    <div className="board">
      <GameOverModal isVisible={gameOver} onRestart={initializeGame} />
      {renderBoard()}
    </div>
  );
}