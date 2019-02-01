import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            xIsNext: true,
        };
    }

    handleClick(i) {
        const currentSquares = this.state.history[this.state.history.length - 1];
        const squares = currentSquares.squares.slice();
        if (calculateWinner(squares) || squares[i]) { // win or already has occupied
            return false;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: this.state.history.concat([{ //concat leaves history immutable
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(move) {
        this.setState({
            history: this.state.history.slice(0, move + 1),
            xIsNext: (move % 2 === 0),
        })
    }

    render() {
        const currentSquares = this.state.history[this.state.history.length - 1];        
        const status = calculateWinner(currentSquares.squares) ? 
            "Winner is " + (this.state.xIsNext ? "O" : "X") : 
            "Next Player: " + (this.state.xIsNext ? "X" : "O");
        const moves = this.state.history.map((step, move) => {
            const desc = move ?
                'Jump to move #' + move:
                'Jump to game start';
            return (
                <li key="move">
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentSquares.squares}
                        xIsNext={this.state.xIsNext}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    // if 3 squares in a row/column/diag are the same
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) { // should not be null
            return true;
        }
    }
    return false;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root'),
);
