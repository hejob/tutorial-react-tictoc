import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.isWinning ? "square winning" : "square"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(row, col) {
        const i = getNum(row, col);
        // if this belongs to the winning ones
        const isWinning = this.props.isWin ? (this.props.isWin.includes(getNum(row, col))) : false;
        return (
            <Square
                isWinning={isWinning}
                key={col}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(row, col)}
                />
        );
    }

    render() {
        const rows = [0, 1, 2].map((row) => {
            const cols = [0, 1, 2].map((col) => this.renderSquare(row, col));
            return (
                <div className="board-row" key={row}>
                    {cols}
                </div>
            )
        })
        return (
            <div>
                {rows}
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
                    move: [null, null],
                }
            ],
            currentStep: 0,
            xIsNext: true,
        };
    }

    handleClick(row, col) {
        const i = getNum(row, col);
        const currentSquares = this.state.history[this.state.currentStep];
        const squares = currentSquares.squares.slice();
        if (calculateWinner(squares) || squares[i]) { // win or already has occupied
            return false;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: this.state.history.concat([{ //concat leaves history immutable
                squares: squares,
                move: [row, col],
            }]),
            currentStep: this.state.currentStep + 1,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(move) {
        this.setState({
            history: this.state.history.slice(0, move + 1),
            currentStep: move,
            xIsNext: (move % 2 === 0),
        })
    }

    render() {
        const currentSquares = this.state.history[this.state.history.length - 1];
        let status = "";
        const isWin = calculateWinner(currentSquares.squares); //[a,b,c] or false
        if (isWin) {
            status = "Winner is " + (this.state.xIsNext ? "O" : "X");
        } else {
            if (this.state.currentStep === 9) {
                status = "No space to play. Draw.";
            } else {
                status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
            }
        }            
            
        const moves = this.state.history.map((step, move) => {
            const desc = move ?
                'Jump to move #' + move + (step.move[0] !== null ?
                    (' [' + step.move[0] + ',' + step.move[1] + ']') :
                    '') : 
                'Jump to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        isWin={isWin}
                        squares={currentSquares.squares}
                        xIsNext={this.state.xIsNext}
                        onClick={(row, col) => this.handleClick(row, col)}/>
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
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) { // should not be null
            return [a, b, c];
        }
    }
    return false;
}

function getNum(row, col) {
    return row * 3 + col;
}

// function getRowCol(num) {
//     return (Math.floor(num / 3), num % 3);
// }

ReactDOM.render(
    <Game />,
    document.getElementById('root'),
);
