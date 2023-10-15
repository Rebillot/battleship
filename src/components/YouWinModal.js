



export default function YouWinModal({ isVisible, onRestart }) {
    return (
      isVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You WIN!!!</h2>
            <img src="https://media2.giphy.com/media/mw9Mrm9gi1x6X1nhzo/giphy.gif?cid=ecf05e4782tw789pkkaf37ct2cxygkk6dm3j5ppbzccsu96h&ep=v1_gifs_related&rid=giphy.gif&ct=g" alt="game over" />
            <button onClick={onRestart}>Play Again</button>
          </div>
        </div>
      )
    );
  }
  