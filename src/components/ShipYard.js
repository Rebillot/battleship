import React, { useState } from "react";
import ShipArray from "./ShipConstructor";


export default function ShipYard({ onSelectShip, setGamePhase, onOrientationChange  }) {
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');
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