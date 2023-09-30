import React, { useState } from "react";

export default function ChecksShips() {

    return (
        <>
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="1x3"
                  
                />
                <label className="form-check-label" htmlFor="inlineCheckbox1">
                    ship 1 (1x3)
                </label>
            </div>
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox2"
                    value="2x3"
                   
                />
                <label className="form-check-label" htmlFor="inlineCheckbox2">
                    ship 2 (2x3)
                </label>
            </div>
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox3"
                    value="3x3"
                    
                    disabled
                />
                <label className="form-check-label" htmlFor="inlineCheckbox3">
                    3 (disabled)
                </label>
            </div>
        </>
    )
}
