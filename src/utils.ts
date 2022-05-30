export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const filterEmptyCell = (grid: number[]) => {
  return grid.filter((value) => value !== 0);
};
//This function invert the 2DArray values, with given indexes
export const swap = (
  board: number[][],
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let temp = board[y1][x1];
  board[y1][x1] = board[y2][x2];
  board[y2][x2] = temp;
};

//This function transpose a 2DArray on his main diagonal
export const transpose = (board: number[][]) => {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < y; x++) {
      swap(board, x, y, y, x);
    }
  }
};

export const compareArray = <T>(arr1: T[], arr2: T[]) => {
  return arr1.every((value, index) => {
    //console.log('check righe',index, value === arr2[index])
    return value === arr2[index]
  });
};

export const compare2DArray = <T>(arr1: T[][], arr2: T[][]) => {
  //console.log('funzione compare',arr1.toString(), arr2.toString())
  return arr1.every((row, index) => compareArray(row, arr2[index]));
};
