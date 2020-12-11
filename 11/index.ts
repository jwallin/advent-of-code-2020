import { lines, Position, toChars } from '../utils';
import { Matrix } from '../utils/matrix';

const SEAT_OCCUPIED = '#';
const SEAT_EMPTY = 'L';

const isOccupied = (seat: string): boolean => seat === SEAT_OCCUPIED;
const isEmpty = (seat: string): boolean => seat === SEAT_EMPTY;
const isSeat = (val: string): boolean => isOccupied(val) || isEmpty(val);

const occupiedSeats = (input: string[]): number => input.filter(isOccupied).length;

async function getMatrix():Promise<Matrix> {
  const seats:string[] = (await lines('input.txt'));
  return new Matrix(seats.map(toChars));
}

function applyRules(matrix: Matrix, updateSeat: (matrix: Matrix, p: Position) => string):Matrix {
  const newMatrix = matrix.clone();
  matrix.asArray().forEach((p: Position) => {
    newMatrix.set(p, updateSeat(matrix, p));
  });
  return newMatrix;
}

async function run(updateSeat: (matrix: Matrix, p: Position) => string): Promise<Matrix> {
  let matrix = await getMatrix();
  let oldMatrix;
  let i = 0;

  while(!oldMatrix || !matrix.equals(oldMatrix)) {
    oldMatrix = matrix;
    matrix = applyRules(matrix, updateSeat);
  }
  return matrix;
}

async function partOne() {
  const matrix = await run((matrix: Matrix, p: Position) => {
    const seat = matrix.get(p);
    const adjacent = matrix.adjacent(p);
    if (isEmpty(seat) && occupiedSeats(adjacent) === 0) {
      return SEAT_OCCUPIED;
    } else if (isOccupied(seat) && occupiedSeats(adjacent) >= 4) {
      return SEAT_EMPTY;
    }
    return seat;
  });
  console.log(occupiedSeats(matrix.values()));
}

async function partTwo() {
  const matrix = await run((matrix: Matrix, p: Position) => {
    const seat = matrix.get(p);
    const visibleSeats = matrix.visibleValues(p, (x:string) => isSeat(x));
  
    if (isEmpty(seat) && occupiedSeats(visibleSeats) === 0) {
      return SEAT_OCCUPIED;
    } else if (isOccupied(seat) && occupiedSeats(visibleSeats) >= 5) {
      return SEAT_EMPTY;
    }
    return seat;
  });
  console.log(matrix.draw())
  console.log(occupiedSeats(matrix.values()));
}

partOne();