import React, { useState } from "react";
import ShipArray from "./ShipConstructor";

function getColorForShip(shipName) {
  switch (shipName.toLowerCase()) {
    case "carrier":
      return "#FF5733";
    case "battleship":
      return "#3498db";
    case "cruiser":
      return "#2ecc71";
    case "submarine":
      return "#f39c12";
    case "destroyer":
      return "#e74c3c";
    default:
      return "#000000";
  }
}

export default function ShipYard({ onSelectShip }) {
    const [selectedShip, setSelectedShip] = useState(null);
  
    const handleShipClick = (shipName) => {
      setSelectedShip(shipName === selectedShip ? null : shipName);
      onSelectShip(shipName);
    };
  
    return (
      <>
        <div className="grid-container">
          {ShipArray.map((ship, index) => (
            <div
              key={index}
              className={`ship ship-${ship.name.toLowerCase()} ${selectedShip === ship.name ? "selected-ship" : ""}`}
              onClick={() => handleShipClick(ship.name)}
            >
              {Array.from({ length: ship.length }, (_, i) => (
                <div
                  key={i}
                  className={`ship-segment ship-${ship.name.toLowerCase()}`}
                  style={{
                    width: "20px",
                    height: "20px",
                    margin: "1px",
                    backgroundColor: getColorForShip(ship.name),
                    display: "inline-block",
                  }}
                />
              ))}
              <div className="ship-length">{ship.name}</div>
            </div>
          ))}
        </div>
      </>
    );
  }