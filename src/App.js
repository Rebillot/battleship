import React, { useState } from "react";
import ShipYard from "./components/ShipYard";
import Board from "./components/Board";
import ComputerBoard from "./components/CB2";
import PlaceShips from "./components/PlaceShips";
import { useTurn } from "./components/Context/Context";
import { ScoreBoard } from "./components/ScoreBoard";

function App() {
  const [ships, setShips] = useState([]);
  const [selectedShipType, setSelectedShipType] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { currentTurn, toggleTurn } = useTurn();
  const [gamePhase, setGamePhase] = useState("positioning"); // can be "positioning" or "playing"

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
    if (currentTurn === "player") {
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
    }

    setShips(newShips);
    console.log(
      `Placed ${selectedShipType.type} with length ${shipLength} at position (${row}, ${col} } Current Turn:  ${currentTurn}`
    );
  };

  return (
    <>
      <div className="start" style={{ marginTop: "10px" }}>
        <button onClick={() => setIsGameStarted(!isGameStarted)}>
          Start Game
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
         {isGameStarted && ( <h2> Current Turn: {currentTurn} </h2>) }
      </div>
      <div style={{ display: "flex" }}>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2> Your Fleet </h2>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2> Enemy Fleet </h2>
    </div>
</div>


      {isGameStarted && (
        <div className="App">
          <div className="boards">
            <Board
              ships={ships}
              onSelectShip={(row, col) => {
                handlePlaceShip(row, col, selectedShipType.length);
              }}
            />

            <ComputerBoard gamePhase={gamePhase}/>
          </div>
        </div>
      )}
      {isGameStarted && (
        <div>
          <div>
            <PlaceShips />
          </div>
          <ShipYard onSelectShip={isGameStarted ? handleSelectShip : null} setGamePhase={setGamePhase} />
        </div>
      )}
       <ScoreBoard />
    </>
  );
}

export default App;
