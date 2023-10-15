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
/**
 * Renders the shipyard component.
 * @param {Object} props - The component props.
 * @param {Function} props.onSelectShip - The function to call when a ship is selected.
 * @param {Function} props.setGamePhase - The function to call when the game phase changes.
 * @param {Function} props.onOrientationChange - The function to call when the orientation changes.
 * @returns {JSX.Element} - The rendered component.
 */
export default function ShipYard({ onSelectShip, setGamePhase, onOrientationChange }) {
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');
  const [usedShips, setUsedShips] = useState([]);

  /**
   * Handles the click event for a ship.
   * @param {string} shipName - The name of the ship.
   * @param {number} shipLength - The length of the ship.
   * @returns {void}
   */
  const handleShipClick = (shipName, shipLength) => {
    if (usedShips.includes(shipName)) return;
  
    setSelectedShip(shipName === selectedShip ? null : shipName);
    
    // Ensure that a ship is selected before calling onSelectShip
    if (shipName !== null) {
      onSelectShip(shipName, shipLength, orientation);
      setUsedShips(prevShips => [...prevShips, shipName]);
    }
  };

  return (
    <>
      <div className="orientation-button">
        <button onClick={() => {
        const newOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
        setOrientation(newOrientation);

        if (onOrientationChange) onOrientationChange(newOrientation);
      }}> Change Orientation </button>
      </div>
    
      <div className="grid-container">
        {ShipArray.map((ship, index) => (
          <div
            key={index}
            className={`ship-${ship.name} ${selectedShip === ship.name ? "selected-ship" : ""} ${usedShips.includes(ship.name) ? "used-ship" : ""}`}
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