import React, { useState } from "react";
import ShipYard from "./components/ShipYard";
import Board from "./components/Board";

function App() {
  const [ships, setShips] = useState([]);
  const [selectedShipType, setSelectedShipType] = useState(null);

  const handleSelectShip = (shipType) => {
    setSelectedShipType(shipType);
    console.log(`Selected ship: ${shipType}`);
};

const handlePlaceShip = (row, col) => {

    const newShips = [...ships, { type: selectedShipType, row, col }];
    setShips(newShips);
    console.log(`Placed ${selectedShipType} at position (${row}, ${col})`);
};

  return (
    <div className="App">
      <Board ships={ships} onSelectShip={handlePlaceShip} />
      <ShipYard onSelectShip={handleSelectShip} />
    </div>
  );
}

export default App;
