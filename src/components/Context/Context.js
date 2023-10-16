import React, { createContext, useContext, useState } from "react";
import ShipArray from "../ShipConstructor";


// Create a context for managing the turn state.
const TurnContext = createContext();


// Custom hook that provides an easier way to use the TurnContext.
export const useTurn = () => {
  return useContext(TurnContext);
};

// The TurnProvider component wraps other components and provides them with the ability 
// to access and manipulate the turn-related state.
export const TurnProvider = ({ children }) => {
  // State for tracking whose turn it currently is (default to "player")
  const [currentTurn, setCurrentTurn] = useState("player");

  // State for tracking the ships that have been placed on the board.
  const [ships, setShips] = useState(ShipArray);

  // State for tracking hits and misses against the computer.
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);



  // State for tracking hits and misses against the player.
  const [playerhits, setPlayerHits] = useState([]);
  const [playermisses, setPlayerMisses] = useState([]);



  // Function to toggle the turn between the player and computer.
  const toggleTurn = () => {
    setCurrentTurn(prevTurn => (prevTurn === "player" ? "computer" : "player"));
  };

  // Return the TurnContext.Provider component, providing all of the turn-related state 
  // and functions to its children.
  return (
    <TurnContext.Provider value={{ currentTurn, toggleTurn, hits, setHits, misses, setMisses, playerhits, setPlayerHits, playermisses, setPlayerMisses, ships, setShips }}>
      {children}
    </TurnContext.Provider>
  );
};
