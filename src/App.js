import React, { useState } from "react";
import ShipYard from "./components/ShipYard";
import Board from "./components/Board";
import ComputerBoard from "./components/CB2";
import Instructions from "./components/Instructions";
import { useTurn } from "./components/Context/Context";
import { ScoreBoard } from "./components/ScoreBoard";

/**
 * The App component is the main component of the Battleship game.
 * It defines and initializes state variables for the application, handles selecting and placing ships on the board,
 * and renders the main JSX content for the game.
 *
 * @returns {JSX.Element} The main JSX content for the App component.
 */
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
  const handlePlaceShip = (row, col) => {
    if (!selectedShipType) {
      console.log("No ship selected");
      return;
    }

    const shipLength = selectedShipType.length; // Get ship length from the state
    const newShips = [...ships];

    if (currentTurn !== "player") {
      console.log("It's not the player's turn");
      return;
    }

    let canPlaceShip = true;

    if (shipOrientation === "vertical") {
      // Check for horizontal ship placement
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
        console.log("Not enough horizontal space");
        canPlaceShip = false;
      }
    } else { // shipOrientation === "horizontal"
      // Check for vertical ship placement
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
        console.log("Not enough vertical space");
        canPlaceShip = false;
      }
    }

    if (canPlaceShip) {
      setShips(newShips);
      console.log(`Placed ${selectedShipType.type} with length ${shipLength} at position (${row}, ${col}) with orientation ${shipOrientation}. Current Turn: ${currentTurn}`);
    } else {
      console.log("Failed to place the ship due to insufficient space.");
    }
};


  // Return the main JSX content for the App component
  return (
    <>
      {!isGameStarted && (
        <div className="start">
          <button onClick={() => setIsGameStarted(true)}>
            Start Game
          </button>
        </div>
      )}

      <div className="centered-container">
        {isGameStarted && (
          <div className="turn-info">

            <div className="current-turn-text">
              {currentTurn === "player" ? "Your Turn!" : "Enemy's Turn!"}
            </div>
          </div>

        )}
      </div>

      <div className="App">
        <div className="boards">
          <Board
            ships={ships}
            onSelectShip={(row, col) => {
              handlePlaceShip(row, col);
            }}
          />

          {isGameStarted && <ComputerBoard gamePhase={gamePhase} />}
        </div>
      </div>

      {!isGameStarted && (
        <div>
          <Instructions />
          <ShipYard
            onSelectShip={handleSelectShip}
            setGamePhase={setGamePhase}
            onOrientationChange={setShipOrientation}
          />
        </div>
      )}

      {isGameStarted && <ScoreBoard />}
    </>

  );
}

export default App;
