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

  //Game logic

  // Generate player ships
  const handleSelectShip = (shipType, shipLength) => {
    setSelectedShipType({ type: shipType, length: shipLength });
    console.log(`Selected ship: ${shipType}, ${shipLength} length`);
  };
  const handlePlaceShip = (row, col, shipLength) => {
    const newShips = [...ships];

    // Check if there is enough space horizontally and no ship already exists
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
      // Check if there is enough space vertically and no ship already exists
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
        console.log("Not enough space or ship overlaps with existing ship!");
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
        </button>
      </div>
      <div className="App">
        <div className="boards">
          <Board
            ships={ships}
            onSelectShip={(row, col) =>
              handlePlaceShip(row, col, selectedShipType.length)
            }
          />
          <ComputerBoard />
        </div>
      </div>
      <div>
<PlaceShips />
      </div>
      <ShipYard onSelectShip={handleSelectShip} />
    </>
  );
}

export default App;
