import React, { useEffect, useState, useRef } from "react";
import YouWinModal from "./YouWinModal.js";
import { useTurn } from "./Context/Context.js";

/**
 * This file exports a React component that represents the computer board in a Battleship game.
 * It contains functions to generate random computer ship positions, handle player attacks, place ships on the board,
 * initialize the game's starting state, reset the game, and render the computer board UI.
 * 
 * @exports ComputerBoard
 */
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

// funtion to handle the placement of a ship on the board, check if the ship is placed outside of the board, check if the ship overlaps with any existing ships,
// and place the ship on the board depending on the orientation
const handlePlaceShip = (row, col, length, orientation, ships) => {
  const occupiedTiles = [];
  
  // Check if ship is placed outside of the board
  if (orientation === 0 && col + length > 10) {
    return false;
  } else if (orientation === 1 && row + length > 10) {
    return false;
  }

  // Generate occupied tiles for this ship
  for (let i = 0; i < length; i++) {
    occupiedTiles.push(orientation === 0 ? [row, col + i] : [row + i, col]);
  }

  // Check if ship overlaps with any existing ships
  for (let shipTile of occupiedTiles) {
    if (ships.some(ship => {
      for (let i = 0; i < ship.length; i++) {
        if (ship.orientation === 0 && ship.row === shipTile[0] && ship.col + i === shipTile[1]) {
          return true;
        }
        if (ship.orientation === 1 && ship.row + i === shipTile[0] && ship.col === shipTile[1]) {
          return true;
        }
      }
      return false;
    })) {
      return false;
    }
  }

  // Place the ship on the board
  const newShips = [...ships];
  const newShip = { row, col, length, orientation, tiles: occupiedTiles };
  newShips.push(newShip);
  return newShips;
};

 // Function to handle the player's attack on the computer board and update the board accordingly
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

// Function to handle click event on a board square and update the board accordingly
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
  
  // Function to initialize the game's starting state by generating random computer ship positions and placing them on the board
  const initializeGame = () => {
    setGameOver(false);
    
    let totalTiles = 0;
    
    let newShipsList = [];
    
    while (totalTiles !== 17) {
      const randomShips = generateRandomShips();
      newShipsList = [];
      totalTiles = 0;
      
      for (let i = 0; i < randomShips.length; i++) {
        const shipPlacement = handlePlaceShip(
          randomShips[i].row,
          randomShips[i].col,
          randomShips[i].length,
          randomShips[i].orientation,
          newShipsList
        );
        if (shipPlacement) {
          newShipsList = shipPlacement;
          totalTiles += randomShips[i].length;
        }
      }
    }
    
    setShips(newShipsList.map(ship => ({ ...ship, hits: 0, status: 'intact' })));
    console.log("totalTiles used by enemy ships,", totalTiles)
  };
  
 // Function to reset the game by reloading the page
  const resetGame  = () => {
    window.location.reload();
  }

  // Function to render the computer board UI using the board state
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
                className={`${squareClass} `}
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
      <YouWinModal isVisible={gameOver} onRestart={resetGame} />
      {renderBoard()}
    </div>
  );
}