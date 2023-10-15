import React, { useEffect, useState, useRef } from "react";
import ShipArray from "./ShipConstructor.js";
import GameOverModal from "./GameOverModal.js";
import { useTurn } from "./Context/Context.js";




export default function ComputerBoard() {
  // Component state initialization
  const [ships, setShips] = useState([]);
  const [lastClicked, setLastClicked] = useState(null);
  const [missedShots, setMissedShots] = useState([]); // [ [row, col], [row, col], ...
  const coordinatesRef = useRef([]);
  const { currentTurn, toggleTurn, setPlayerHits, setPlayerMisses } = useTurn();
  const [gameOver, setGameOver] = useState(false);


// Helper function to generate random computer ship positions
const generateRandomShips = () => {
  const ships = [];
  const shipLengths = [5, 4, 3, 3, 2];

  for (let length of shipLengths) {
    let shipPlaced = false;
    let row, col, orientation;

    while (!shipPlaced) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      orientation = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical
      console.log('Orientation:', orientation);

      if (orientation === 0) {
        if (col + length <= 10) {
          const ship = { row, col, length, orientation };
          ships.push(ship);
          shipPlaced = true;
        }
      } else {
        if (row + length <= 10) {
          const ship = { row, col, length, orientation };
          ships.push(ship);
          shipPlaced = true;
        }
      }
    }
  }

  return ships;
};

const handlePlaceShip = (row, col, length, orientation, ships) => {
  // Check if ship is placed outside of the board
  if (orientation === 0 && col + length > 10) {
    return false;
  } else if (orientation === 1 && row + length > 10) {
    return false;
  }

  // Check if ship overlaps with any existing ships
  for (let ship of ships) {
    if (orientation === 0) {
      // Check if ship overlaps horizontally
      if (ship.row === row && col <= ship.col + ship.length && col + length > ship.col) {
        return false;
      }
    } else {
      // Check if ship overlaps vertically
      if (ship.col === col && row <= ship.row + ship.length && row + length > ship.row) {
        return false;
      }
    }
  }

  // Place the ship on the board
  const newShips = [...ships];
  const newShip = { row, col, length, orientation };
  newShips.push(newShip);
  return newShips;
};





 // Function to handle the player's attack on the computer board
 const handlePlayerAttack = (row, col) => {
  let attackedShipIndex = -1;

  for (let ship of ships) {
    if (ship.orientation === 0) { // horizontal
      for (let i = 0; i < ship.length; i++) {
        if (ship.row === row && ship.col + i === col) {
          attackedShipIndex = ships.indexOf(ship);
          break;
        }
      }
    } else { // vertical
      for (let i = 0; i < ship.length; i++) {
        if (ship.row + i === row && ship.col === col) {
          attackedShipIndex = ships.indexOf(ship);
          break;
        }
      }
    }
    if (attackedShipIndex !== -1) break;
  } /*starting point for the ship*/

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

// Function to handle click event on a board square
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
  
// Function to place a ship on the board


  // Function to initialize the game's starting state
  const initializeGame = () => {
    setGameOver(false);
  
    const randomShips = generateRandomShips();
    let newShipsList = [];
  
    for (let i = 0; i < randomShips.length; i++) {
      if (handlePlaceShip(
        randomShips[i].row,
        randomShips[i].col,
        randomShips[i].length,
        randomShips[i].orientation,
        newShipsList
      )) {
        // add to newShipsList if it's a valid placement
        newShipsList.push({...randomShips[i], hits: 0, status: 'intact'});
      }
    }
  
    setShips(newShipsList);
  };
  
  

  const resetGame  = () => {
    window.location.reload();
  }

  // Function to render the computer board UI
  const renderBoard = () => {
    const boardElements = [];
    for (let row = 0; row < 10; row++) {
        const columns = [];
        for (let col = 0; col < 10; col++) {
            const isSquareClicked = coordinatesRef.current.some(coord => coord[0] === row && coord[1] === col);

            let shipAtPosition;
            for (let ship of ships) {
                if (ship.orientation === 0) { // horizontal
                    if (ship.row === row && ship.col <= col && ship.col + ship.length > col) {
                        shipAtPosition = ship;
                        break;
                    }
                } else { // vertical
                    if (ship.row <= row && ship.row + ship.length > row && ship.col === col) {
                        shipAtPosition = ship;
                        break;
                    }
                }
            }
            let squareClass = 'square';
            if (isSquareClicked) {
              if (shipAtPosition) {
                squareClass += ` ${shipAtPosition.status}`;  // add hit or destroyed class
              } else {
                squareClass += ' missed';  // missed shot
              }
            }

            columns.push(
              <div
                key={`${row}-${col}`}
                className={`${squareClass} `}  // ${shipAtPosition ? shipAtPosition.ship.name : ''}
                onClick={() => handleSquareClick(row, col)}
              ></div>
            ); 
        }
        boardElements.push(<div className="board-row" key={row}> {columns } </div>);
    }

    return boardElements;
};




// Effect hook to run the game initialization logic when the component mounts
  useEffect(() => {
    initializeGame();
  }, []);


  return (
    <div className="board">
      <GameOverModal isVisible={gameOver} onRestart={resetGame} />
      {renderBoard()}
    </div>
  );
}