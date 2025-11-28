const state = {
  R: 'R',
  P: 'P',
  S: 'S',
};

class Cell {
  pos = [0, 0];
  size = [0, 0];
  state = random(this.state);
  neighbors = [null, null, null, null, null, null, null, null];

  constructor(x, y, w, h, state = this.state) {
    this.pos = [x, y];
    this.size = [w, h];
    this.state = state;
  }

  setNeighbors(tl, t, tr, r, br, b, bl, l) {
    this.neighbors[0] = tl;
    this.neighbors[1] = t;
    this.neighbors[2] = tr;
    this.neighbors[3] = r;
    this.neighbors[4] = br;
    this.neighbors[5] = b;
    this.neighbors[6] = bl;
    this.neighbors[7] = l;
  }

  computeNextState() {
    //filter: array 내장함수, filter: return 필수. return 뒤에 T인 것만 필터링함.
    const neighborStates = this.neighbors.filter(n => n !== null).map(n => n.state);

    const neighborsDead = this.neighbors.filter(n => n !== null);

    if (neighborStates.includes('R') && this.state === 'S') {
      this.nextState = 'R';
      return;
    } else if (neighborStates.includes('S') && this.state === 'P') {
      this.nextState = 'S';
      return;
    } else if (neighborStates.includes('P') && this.state === 'R') {
      this.nextState = 'P';
      return;
    }

    const win = {
      R: 'S',
      S: 'P',
      P: 'R',
    };

    const iWinAgainst = win[this.state];

    const canEat = neighborStates.includes(iWinAgainst);

    if (canEat) {
      this.nextState = this.state;
    }

    if (canEat) {
      neighborsDead.forEach(n => {
        if (n.state === iWinAgainst) {
          n.nextState = state;
        }
      });
    }
  }

  updateState() {
    this.state = this.nextState;
  }

  render() {
    if (this.state === 'R') fill('#FF8F8F');
    else if (this.state === 'P') fill('#FFF1CB');
    else if (this.state === 'S') fill('#B7A3E3');

    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
  }
}
