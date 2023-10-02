import React from "react";

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.width = 10;
        this.height = length;
        this.health = length;

    }
}

const carrier = new Ship("Carrier", 5);
const battleship = new Ship("Battleship", 4);
const cruiser = new Ship("Cruiser", 3);
const submarine = new Ship("Submarine", 3);
const destroyer = new Ship("Destroyer", 2);

const ShipArray = [
    carrier,
    battleship,
    cruiser,
    submarine,
    destroyer
];

export default ShipArray;