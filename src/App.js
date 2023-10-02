import React, { useState } from "react";
import ShipYard from "./components/ShipYard";
import Board from "./components/Board";
// import ComputerBoard from "./components/ComputerBoard";
import ComputerBoard from "./components/CB2";
import PlaceShips from "./components/PlaceShips";

function App() {
  const [ships, setShips] = useState([]);
  const [selectedShipType, setSelectedShipType] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [atackingComputer, setAtackingComputer] = useState(false);
  const [coordinates, setCoordinates] = useState([]);

  //Game logic
  // const handleAtack = (row, col) => {
  //   if (!isGameStarted || atackingComputer) {
  //     console.log("Game not started or computer is atacking");
  //     return;
  //   }
  //   const hit = ships.some((ship) => {
  //     return ship.positions.some((pos) => pos.row === row && pos.col === col);
  //   });
  //   if (hit) {
  //     console.log("Hit!");
  //   } else {
  //     console.log("Miss!");
  //   }
  // };


  

  // Check if all ships are sunk
  const checkGameOutcome = () => {
    const AllShipsSunk = ships.every((ship) => {
      return ship.positions.every((pos) => pos.isHit);
    });
    if (AllShipsSunk) {
      console.log("Game over");
    } else {
      console.log("Game continues");
    }
  };

  // Generate player ships
  const handleSelectShip = (shipType, shipLength) => {
    console.log("Selected shipType:", shipType);
    console.log("Selected shipLength:", shipLength);

    if (shipType && shipLength) {
      setSelectedShipType({ type: shipType, length: shipLength });
      console.log(`Selected ship: ${shipType}, ${shipLength} length`);
    } else {
      console.log("Invalid ship type or length");
    }
  };

  const handlePlaceShip = (row, col, shipLength) => {
    const newShips = [...ships];

    // Check if there is enough space horizontally and no ship
    let canPlaceShip = true;
    for (let i = col; i < col + shipLength; i++) {
      if (newShips.some((ship) => ship.row === row && ship.col === i)) {
        canPlaceShip = false;
        break;
      }
    }

    if (canPlaceShip && col + shipLength <= 10) {
      for (let i = col; i < col + shipLength; i++) {
        newShips.push({ type: selectedShipType.type, row, col: i });
      }
    } else {
      canPlaceShip = true;
      // Check if there is enough space vertically and no ship
      for (let i = row; i < row + shipLength; i++) {
        if (newShips.some((ship) => ship.row === i && ship.col === col)) {
          canPlaceShip = false;
          break;
        }
      }

      if (canPlaceShip && row + shipLength <= 10) {
        for (let i = row; i < row + shipLength; i++) {
          newShips.push({ type: selectedShipType.type, row: i, col });
        }
      } else {
        console.log("Not enough space");
        return;
      }
    }

    setShips(newShips);
    console.log(
      `Placed ${selectedShipType.type} with length ${shipLength} at position (${row}, ${col})`
    );
  };

  return (
    <>
      <div className="start">
        <button onClick={() => setIsGameStarted(!isGameStarted)}>
          Start Game
          {console.log("Game started")}
        </button>
      </div>
      {isGameStarted && (
        <div className="App">
          <div className="boards">
            <Board
              ships={ships}
              onSelectShip={(row, col) => {
                // handleAtack(row, col);
                handlePlaceShip(row, col, selectedShipType.length);
              }}
            />
            <ComputerBoard />
          </div>
        </div>
      )}
      <div>
        <PlaceShips />
      </div>
      <ShipYard onSelectShip={isGameStarted ? handleSelectShip : null} />
    </>
  );
}

export default App;
