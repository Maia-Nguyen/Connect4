import React from 'react';
import './App.css';

export default class App extends React.Component {
  state = {
    rows: 6,
    columns: 7,
    moves: [],
    playerTurn: 'red',
  };

  resetBoard = () => {
    this.setState({ moves: [], winner: null });
  }

  getPiece = (x,y) => {
    const list = this.state.moves.filter((item) => {
      return (item.x === x && item.y === y);
    });

    return list[0];
  }

  isWinningPiece = (x,y) => {
    const { winner, winningMoves } = this.state;
    if (!winner) return false;
    return winningMoves.some(item => item.x === x && item.y === y);
  }

  getWinningMovesForVelocity = (xPosition, yPosition, xVelocity, yVelocity) => {
    const winningMoves = [{ x: xPosition, y: yPosition }];
    const player = this.getPiece(xPosition, yPosition).player;

    for (let change = 1; change <= 3; change += 1) {
      const checkX = xPosition + xVelocity * change;
      const checkY = yPosition + yVelocity * change;
      const checkPiece =  this.getPiece(checkX, checkY);
      if(checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY});
      } else {
        break;
      }
    }

    for (let change = -1; change >= -3; change -= 1) {
      const checkX = xPosition + xVelocity * change;
      const checkY = yPosition + yVelocity * change;
      const checkPiece =  this.getPiece(checkX, checkY);
      if(checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY});
      } else {
        break;
      }
    }

    return winningMoves;
  }

  checkForWin = (x, y) => {
    const velocities = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1}, { x: 1, y: 1}];
    for (let dex = 0; dex < velocities.length; dex++) {
      const element = velocities[dex];
      const winningMoves = this.getWinningMovesForVelocity(x, y, element.x, element.y);
      if (winningMoves.length > 3) {
        this.setState({winner: this.getPiece(x,y).player, winningMoves});
      }
    }
  }

  checkForDraw = () => {
    const { moves } = this.state;

    if (moves.length === 42) {
      return true;
    }
  }

  addMove = (x,y) => {
    const { playerTurn } = this.state;
    const nextPlayerTurn = playerTurn === 'red' ? 'blue' : 'red';
    let availYPosition = null;
    for (let position = this.state.rows - 1; position >= 0; position--) {
      if (!this.getPiece(x, position)) {
        availYPosition = position;
        break;
      }
    }
    if (availYPosition !== null) {
      // check for a win, based on this next move
      this.setState({ moves: this.state.moves.concat({ x, y: availYPosition, player: playerTurn }), playerTurn: nextPlayerTurn }, () => this.checkForWin(x, availYPosition, playerTurn));
    } 
  }

  renderHistory() {
    return (
      <select style={{ height: '2.5vw', width: '10vw', marginTop: '10px',backgroundColor: 'white', color: 'darkseagreen', fontSize: '1vw'}}>
        {this.state.moves.map((move, index) => <option>#{index+1} (row: {move.y+1}, col: {move.x+1})  Player: {move.player}</option>)}
      </select>
    );
  }

  renderBoard() {
    const { rows, columns, winner } = this.state;
    const rowViews = [];

    for (let row = 0; row < this.state.rows; row +=1) {
      const columnViews = [];
      for (let column = 0; column < this.state.columns; column +=1) {
        const piece = this.getPiece(column, row);
        const winner = this.isWinningPiece(column, row);
        columnViews.push(
          <div onClick={() => {this.addMove(column, row)}} style={{ width: '4vw', height: '4vw', backgroundColor: winner ? 'darkseagreen' : 'lightblue', display: 'flex', padding: 5, cursor: 'pointer' }}>
            <div style={{ borderRadius: '50%', backgroundColor: 'white', flex: 1, padding: 5, display: 'flex' }}>
              {piece ? <div style={{ backgroundColor: piece.player, flex: 1, borderRadius: '50%', border: '1px solid #333' }} /> : undefined}
            </div>
          </div>
        );
      }
      rowViews.push(
        <div style={{ display: 'flex', flexDirection: 'row'}}>{columnViews}</div>
      );
    }

    return(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {winner && <div style={{ display: 'flex', justifyContent:'center', backgroundColor: 'white', alignItems: 'center', color: 'darkseagreen', fontSize: '3vw' }}>{`${winner} WINS!`}</div>}
        {winner && <div onClick={this.resetBoard} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, zIndex: 3, display: 'flex',
        justifyContent:'center', alignItems: 'center', color: 'darkblue', fontSize: '4vw' }}></div>}
        {rowViews}
      </div>
    );
  }

  render() {
    const {style} = this.props;
    const {playerTurn, winner, moves } = this.state;
    const draw = this.checkForDraw(moves);

    return (
      <div style={{...styles.container}}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {draw && <h1 style={{ display: 'flex', justifyContent:'center', backgroundColor: 'white', alignItems: 'center', color: 'darkseagreen', fontSize: '3vw' }}>Draw!</h1>}
          {!winner && !draw && <h1 style={{ display: 'flex', justifyContent:'center', backgroundColor: 'white', alignItems: 'center', marginRight: '10px', color: playerTurn, fontSize: '3vw' }}>{playerTurn}'s Turn</h1>}
          {this.renderBoard()}
          <button onClick={this.resetBoard} style={{ backgroundColor: 'white', padding: '4px', marginTop: '10px', borderRadius: '5px', fontSize: '1vw' }}>Clear Board</button>
          {this.renderHistory()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};