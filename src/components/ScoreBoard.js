import React from 'react';
import { useTurn } from './Context/Context';

/**
 * Renders the Score Board component.
 * @returns {JSX.Element} The Score Board component.
 */
export function ScoreBoard() {
    const { hits, misses, playerhits, playermisses } = useTurn();
  
    return (
      <div className="scoreboard">
        <div className="score">
          <h2>Score Board</h2>
          <div>Player Hits: {playerhits.length}</div>
          <div>Computer Hits: {hits.length}</div>
          <div>Player Misses: {playermisses.length}</div>
          <div>Computer Misses: {misses.length}</div>

        </div>
      </div>
    );
}
