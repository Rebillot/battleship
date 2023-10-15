import React, { useState } from "react";
import ShipArray from "./ShipConstructor";


/**
 * Renders the ShipYard component.
 * @param {Object} props - The component props.
 * @param {Function} props.onSelectShip - The function to call when a ship is selected.
 * @param {Function} props.setGamePhase - The function to call when the game phase changes.
 * @param {Function} props.onOrientationChange - The function to call when the orientation changes.
 * @returns {JSX.Element} - The rendered component.
 */


// function to handle the placement of a ship on the board, check if the ship is placed outside of the board, check if the ship overlaps with any existing ships,
export default function ShipYard({ onSelectShip, setGamePhase, onOrientationChange }) {
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');

  /**
   * Handles the click event for a ship.
   * @param {string} shipName - The name of the ship.
   * @param {number} shipLength - The length of the ship.
   */
  const handleShipClick = (shipName, shipLength) => {
    setSelectedShip(shipName === selectedShip ? null : shipName);
    onSelectShip(shipName, shipLength, orientation);
  };

  return (
    <>
      <button onClick={() => {
        const newOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
        setOrientation(newOrientation);

        if (onOrientationChange) onOrientationChange(newOrientation);
      }}> Change Orientation </button>
    
      <div className="grid-container">
        {ShipArray.map((ship, index) => (
          <div
            key={index}
            className={`ship-${ship.name} ${selectedShip === ship.name ? "selected-ship" : ""}`}
            onClick={() => handleShipClick(ship.name, ship.length)}
          >
            {Array.from({ length: ship.length }, (_, i) => (
              <div
                key={i}
                className={`${ship.name}`}
                style={{
                  width: "20px",
                  height: "20px",
                  margin: "1px",
                  display: orientation === 'horizontal' ? "inline-block" : "block"
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