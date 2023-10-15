



export default function GameOverModal({ isVisible, onRestart }) {
    return (
      isVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You WIN!!!</h2>
            <button onClick={onRestart}>Play Again</button>
          </div>
        </div>
      )
    );
  }
  