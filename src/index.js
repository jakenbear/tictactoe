import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

function Square_Winner(props) {
  return (
    <button className="square_winner" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    let mark = 0;
    if (this.props.squares[i] == "X Win") {this.props.squares[i] = "X"; mark = 1;}
    if (this.props.squares[i] == "O Win") {this.props.squares[i] = "O"; mark = 1;}

    if (mark == 0)
    {
      return (
        <Square value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
        />
      );
    }
    else
    {
      return (
        <Square_Winner value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
        />
      );
    }

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
          xcords: Array(9).fill(null),
          ycords: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      winner_block1: -1,
      winner_block2: -1,
      winner_block3: -1
      };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const xc = current.xcords.slice();
    const yc = current.ycords.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    xc[this.state.stepNumber] = find_x(i);
    yc[this.state.stepNumber] = find_y(i);

    this.setState({
      history: history.concat([
        {
          squares: squares,
          xcords: xc,
          ycords: yc,
          cords: [xc,yc]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const xxcc = current.xcords;
    const yycc = current.ycords;

    const moves = history.map((step, move) => {

    const xypos = xxcc[move] ?
        '(col:' + yycc[move] + ',row:' + xxcc[move] + ')' :
        ''
    const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <button>{xypos}</button>
        </li>

      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player : " + (this.state.xIsNext ? "X" : "O");
    }

      return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
            </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function find_x(i)
{
  if (i < 3)
  {
    return 1;
  }
  else if (i <6)
  {
    return 2;
  }
  else
  {
    return 3;
  }
}

function find_y(i)
{
  return (i % 3) + 1;
}

function calculateWinner(squares,winner) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      let winee = squares[a];
      squares[a] = winee + " Win";
      squares[b] = winee + " Win";
      squares[c] = winee + " Win";
      return squares[a];
    }
  }
  return null;
}
