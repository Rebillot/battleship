import React, { useEffect, useState, useRef } from "react";
import ShipArray from "./ShipConstructor.js";


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
  const [ships, setShips] = useState([]);
  const [lastClicked, setLastClicked] = useState(null);
  const [missedShots, setMissedShots] = useState([]); // [ [row, col], [row, col], ...
  const coordinatesRef = useRef([]);



  const handlePlayerAttack = (row, col) => {
    // Check if the given row and col matches any ship's position
    const attackedShipIndex = ships.findIndex((ship) => ship.row === row && ship.col === col);
    if (attackedShipIndex !== -1) {
        // Create a copy of the ships array and update the status
        const updatedShips = [...ships];
        updatedShips[attackedShipIndex] = { ...updatedShips[attackedShipIndex], status: 'hit' };
        console.log(updatedShips[attackedShipIndex], "hit")
 
        setShips(updatedShips); // Update the ships array
    } else {

       setMissedShots([...missedShots, [row, col]]);
       console.log(missedShots, "missedShots")
    }
};

  const handleSquareClick = (row, col) => {
    const clickedCoordinates = [row, col];
  
    if (!coordinatesRef.current.some(coord => coord[0] === row && coord[1] === col)) {
      coordinatesRef.current = [...coordinatesRef.current, clickedCoordinates];
      handlePlayerAttack(row, col);
      setLastClicked(clickedCoordinates);
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

    coordinatesRef.current = [];
    setShips(ships);
    console.log(ships, "ships");
    console.log(coordinatesRef.current, "coordinatesRef");
  };

  const renderBoard = () => {
    const boardElements = [];
    for (let row = 0; row < 10; row++) {
        const columns = [];
        for (let col = 0; col < 10; col++) {
            const isSquareClicked = coordinatesRef.current.some(coord => coord[0] === row && coord[1] === col);
            const shipAtPosition = ships.find((ship) => ship.row === row && ship.col === col);
            const shipClass = shipAtPosition ? (shipAtPosition.status === 'hit' ? 'hit-ship' : shipAtPosition.ship.name) : '';       

            let squareClass = 'square'; 
            if (isSquareClicked) {
                if (shipAtPosition && shipAtPosition.status === 'hit') {
                    squareClass = 'square hit ship';
                } else {
                    squareClass = 'square missed'; 
                }
            }
        
            columns.push(
                <div
                    key={`${row}-${col}`} 
                    className={`${squareClass} ${shipClass}`}
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


  return <div className="board">
  {renderBoard()}
</div>;

}