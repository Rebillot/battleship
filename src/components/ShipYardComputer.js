import React, { useState } from "react";
import ShipArray from "./ShipConstructor";


export default function ShipYardComputer() {

    return (
      <>
        <div className="grid-container">
          {ShipArray.map((ship, index) => (
            <div
              key={index}
              className={`ship-${ship.name} selected-ship`}
             
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