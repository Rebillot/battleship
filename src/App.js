import React, { useState } from "react";
import ShipYard from "./components/ShipYard";
import Board from "./components/Board";
import ComputerBoard from "./components/CB2";
import PlaceShips from "./components/PlaceShips";
import { useTurn } from "./components/Context/Context";
import { ScoreBoard } from "./components/ScoreBoard";

function App() {
  // Define and initialize state variables for the application
  const [ships, setShips] = useState([]);
  const [selectedShipType, setSelectedShipType] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { currentTurn, toggleTurn } = useTurn();
  const [gamePhase, setGamePhase] = useState("positioning"); // can be "positioning" or "playing"
  const [shipOrientation, setShipOrientation] = useState("horizontal");

  // Handler for selecting a ship from the ShipYard
  const handleSelectShip = (shipType, shipLength) => {
    console.log("Selected shipType:", shipType);
    console.log("Selected shipLength:", shipLength);

    // If a valid ship is selected, update the state
    if (shipType && shipLength) {
      setSelectedShipType({ type: shipType, length: shipLength });
      console.log(`Selected ship: ${shipType}, ${shipLength} length`);
    } else {
      console.log("Invalid ship type or length");
    }
  };

  // Handler for placing a ship on the player's board
  const handlePlaceShip = (row, col, shipLength) => {
    const newShips = [...ships];

    if (currentTurn !== "player") {
      console.log("It's not the player's turn");
      return;
    }

    let canPlaceShip = true;

    if (shipOrientation === "vertical") {

      // Check for horizontal ship placement
      for (let i = col; i < col + shipLength; i++) {
        // Check if another ship occupies this space
        if (newShips.some((ship) => ship.row === row && ship.col === i)) {
          canPlaceShip = false;
          break;
        }
      }

      if (canPlaceShip && col + shipLength <= 10) {
        // Place the ship if valid position found
        for (let i = col; i < col + shipLength; i++) {
          newShips.push({ type: selectedShipType.type, row, col: i });
        }
      } else {
        console.log("Not enough horizontal space");
        canPlaceShip = false;
      }
    } else { // shipOrientation === "vertical"
      // Check for vertical ship placement
      for (let i = row; i < row + shipLength; i++) {
        // Check if another ship occupies this space
        if (newShips.some((ship) => ship.row === i && ship.col === col)) {
          canPlaceShip = false;
          break;
        }
      }

      if (canPlaceShip && row + shipLength <= 10) {
        for (let i = row; i < row + shipLength; i++) {
          // Place the ship if valid position found
          newShips.push({ type: selectedShipType.type, row: i, col });
        }
      } else {
        console.log("Not enough vertical space");
        canPlaceShip = false;
      }
    }
    // Update ships array if the ship was successfully placed
    if (canPlaceShip) {
      setShips(newShips);
      console.log(
        `Placed ${selectedShipType.type} with length ${shipLength} at position (${row}, ${col}) with orientation ${shipOrientation}. Current Turn: ${currentTurn}`
      );
    } else {
      console.log("Failed to place the ship due to insufficient space.");
    }
  };

  // Return the main JSX content for the App component
  return (
    <>
      <div className="start" style={{ marginTop: "10px" }}>
        <button onClick={() => setIsGameStarted(!isGameStarted)}>
          Start Game
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {isGameStarted && (<h2> Current Turn: {currentTurn} </h2>)}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2> Your Fleet </h2>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

            <ComputerBoard gamePhase={gamePhase} />
          </div>
        </div>
      )}
      {isGameStarted && (
        <div>
          <div>
            <PlaceShips />
          </div>
          <ShipYard
            onSelectShip={isGameStarted ? handleSelectShip : null}
            setGamePhase={setGamePhase}
            onOrientationChange={setShipOrientation}
          />
        </div>
      )}
      <ScoreBoard />
    </>
  );
}

export default App;
