import React, { createContext, useContext, useState } from "react";

const TurnContext = createContext();

export const useTurn = () => {
  return useContext(TurnContext);
};

export const TurnProvider = ({ children }) => {
  const [currentTurn, setCurrentTurn] = useState("player");
  const [hits, setHits] = useState([]); 
  const [misses, setMisses] = useState([]);
  const [playerhits, setPlayerHits] = useState([]);
  const [playermisses, setPlayerMisses] = useState([]);

  const toggleTurn = () => {
    setCurrentTurn(prevTurn => (prevTurn === "player" ? "computer" : "player"));
  };

  return (
    <TurnContext.Provider value={{ currentTurn, toggleTurn, hits, setHits, misses, setMisses, playerhits, setPlayerHits, playermisses, setPlayerMisses }}>
      {children}
    </TurnContext.Provider>
  );
};
