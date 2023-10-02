import React, { createContext, useContext, useState } from "react";

const TurnContext = createContext();

export const useTurn = () => {
  return useContext(TurnContext);
};

export const TurnProvider = ({ children }) => {
  const [currentTurn, setCurrentTurn] = useState("player");

  const toggleTurn = () => {
    setCurrentTurn(prevTurn => (prevTurn === "player" ? "computer" : "player"));
  };

  return (
    <TurnContext.Provider value={{ currentTurn, toggleTurn }}>
      {children}
    </TurnContext.Provider>
  );
};
