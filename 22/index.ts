import { getInput, splitArray, range } from '../utils';

class Player {
  private _name: string;
  private _cards: number[];

  constructor(name:string, cards:number[]) {
    this._name = name;
    this._cards = cards;
  }

  get name(): string {
    return this._name
  }
  
  get deck(): number[] {
    return this._cards;
  }

  draw(): number {
    return this._cards.shift() || -1;
  }

  hasCard(): boolean {
    return this._cards.length > 0;
  }

  winsCards(...cards:number[]) {
    this._cards.push(...cards);
  }

  calculateScore(): number {
    const numOfCards = this.deck.length;
    return range(numOfCards).reverse().reduce((prev, k, i) => prev + this.deck[i] * (k+1), 0)
  }
  
  cardsLeft(): number {
    return this.deck.length;
  }

}

async function partOne() {
  const input = splitArray(await getInput(), '');
  const [player1, player2] = input.map(p => {
    const name = p.shift() || '';
    return new Player(name, p.map(Number))
  });

  while (player1.hasCard() && player2.hasCard()) {
    const p1card = player1.draw();
    const p2card = player2.draw();

    //[player1, player2].forEach(p => console.log(`${p.name} deck: ${p.deck.join(', ')}`));
    //console.log('Player 1 plays', p1card);
    //console.log('Player 2 plays', p2card);
    if (p1card > p2card) {
      player1.winsCards(p1card, p2card);
      //console.log('Player 1 wins the round');
    } else {
      player2.winsCards(p2card, p1card);
      //console.log('Player 2 wins the round');
    }
  }
  console.log('============');
  console.log(`Player 1 score: ${player1.calculateScore()}`);
  console.log(`Player 2 score: ${player2.calculateScore()}`);
}

function toKey(...input:number[][]):string {
  return input.map(x => x.join(',')).join(';');
}

function playGame(p1:Player, p2: Player, id:number = 1):Player {
  const memo:Set<string> = new Set();
  
  while (p1.hasCard() && p2.hasCard()) {
    const key = toKey(p1.deck, p2.deck);
    if (memo.has(key)) {
      return p1;
    };
    memo.add(key);

    const p1card = p1.draw();
    const p2card = p2.draw();

    if (p1.cardsLeft() >= p1card && p2.cardsLeft() >= p2card) {
      const winner = playGame(new Player(p1.name, p1.deck.slice(0, p1card)), new Player(p2.name, p2.deck.slice(0, p2card)), id++);
      if (winner.name === p1.name) {
        p1.winsCards(p1card, p2card);
      } else {
        p2.winsCards(p2card, p1card);
      }
    } else {
      if (p1card > p2card) {
        p1.winsCards(p1card, p2card);
      } else {
        p2.winsCards(p2card, p1card);
      }
    }  
  }
  return (p1.calculateScore() > p2.calculateScore()) ? p1 : p2;
}


async function partTwo() {
  const input = splitArray(await getInput(), '');
  const [player1, player2] = input.map(p => {
    const name = p.shift() || '';
    return new Player(name, p.map(Number))
  });
  playGame(player1, player2);
  console.log(`Player 1 score: ${player1.calculateScore()}`);
  console.log(`Player 2 score: ${player2.calculateScore()}`);
}

partTwo()