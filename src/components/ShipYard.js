import React, { useState } from "react";
import ShipArray from "./ShipConstructor";


export default function ShipYard({ onSelectShip }) {
    const [selectedShip, setSelectedShip] = useState(null);

    const handleShipClick = (shipName, shipLength) => {
      setSelectedShip(shipName === selectedShip ? null : shipName);
      onSelectShip(shipName, shipLength);
    };
  
    return (
      <>
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