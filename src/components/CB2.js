import React, { useEffect, useState } from "react";
import ShipArray from "./ShipConstructor.js";
import ShipYardComputer from "./ShipYardComputer.js";

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
    console.log(randomShips);
    return randomShips;
  };

export default function ComputerBoard() {
  const [board, setBoard] = useState([]);

  const handlePlaceShip = (row, col, shipLength, ships) => {
    const newShips = [...ships];
    const directions = [
      [1, 0],  // right direction
      [0, 1],  // down direction
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

  useEffect(() => {
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

    const initialBoard = [];
    for (let row = 0; row < 10; row++) {
      const columns = [];
      for (let col = 0; col < 10; col++) {
        const shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
        const shipClass = shipAtPosition ? shipAtPosition.ship.name : "";
        const shipLength = shipAtPosition ? shipAtPosition.length : 0;

       {
          columns.push(
            <div
              key={`${row}-${col}`} // Use unique key for each div element
              className={`square ${shipClass}`}
            ></div>
          );
          
        } 
      }
      initialBoard.push(<div className="board-row" key={row}>{columns}</div>);
    }

    setBoard(initialBoard);
  }, []); 
  

  return <div className="board">{board}</div>;
}
