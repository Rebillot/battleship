import React from 'react';
import { useTurn } from './Context/Context';

export function ScoreBoard() {
    const { hits, misses, currentTurn, playerhits, playermisses } = useTurn();
  
    return (
      <div className="scoreboard">
        <div className="score">
          <h2>Score Board</h2>
          <div>Player Hits: {playerhits.length}</div>
          <div>Computer Hits: {hits.length}</div>
          <div>Player Misses: {playermisses.length}</div>
          <div>Computer Misses: {misses.length}</div>
          <div>Current Turn: {currentTurn}</div>
        </div>
      </div>
    );
}
