import react from "react";

export default function Board() {
    const board = [];
    for (let row = 0; row < 10; row++) {
        const columns = [];
        for (let col = 0; col < 10; col++) {
        columns.push(<div key={`${row}-${col}`} className="square"></div>);
        }
        board.push(columns);
    }
    return <div className="board">{board}</div>;
}
