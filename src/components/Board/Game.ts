import { Direction, GameObject } from "../../types";
import {
  compare2DArray,
  filterEmptyCell,
  getRandomInt,
  transpose,
} from "../../utils";
import { pipe } from "fp-ts/lib/pipeable";

export const spawnNumber = (
  { board, hasMoved }: GameObject,
  numberValue = 2
) => {
  if (
    (hasMoved !== undefined && hasMoved === false) ||
    board.every((row) => row.every((value) => value !== 0))
  )
    return board;
  const x = getRandomInt(4);
  const y = getRandomInt(4);
  board[x][y] === 0
    ? (board[x][y] = numberValue)
    : spawnNumber({ board, hasMoved }, numberValue);
  return board;
};

export const resetBoard = (board: number[][]) =>
  board.map((row) => row.map((value) => (value = 0)));

//This function handle sliding and values's merging in a row
const slide = (row: number[], direction: "left" | "right") => {
  row = filterEmptyCell(row);
  if (row.length > 0) {
    row = row.map((value, index, arr) => {
      if (
        direction === "right" &&
        value === arr[index + 1] &&
        arr[index + 1] === arr[index + 2]
      )
        return value;
      if (value === arr[index + 1]) {
        value = value * 2;
        row[index + 1] = 0;
      }
      return value;
    });
  }
  row = filterEmptyCell(row);
  const missing = 4 - row.length;
  const zeros = Array(missing).fill(0);
  if (direction === "left") row = row.concat(zeros);
  if (direction === "right") row = zeros.concat(row);
  return row;
};

const moveLeft = (board: number[][]) => board.map((row) => slide(row, "left"));

const moveRight = (board: number[][]) =>
  board.map((row) => slide(row, "right"));

const moveUp = (board: number[][]) => {
  return pipe(
    board,
    (board) => {
      transpose(board);
      return board;
    },
    (board) => moveLeft(board),
    (board) => {
      transpose(board);
      return board;
    }
  );
};

const moveDown = (board: number[][]) => {
  return pipe(
    board,
    (board) => {
      transpose(board);
      return board;
    },
    (board) => moveRight(board),
    (board) => {
      transpose(board);
      return board;
    }
  );
};

export const isNextMove = (board: number[][]) => {
  if (boardCanMove(board)) return true;
  else
    return board.some((row, rowIndex, rowArr) =>
      row.some((value, valueIndex, valueArr) => {
        if (valueIndex < valueArr.length && rowIndex < rowArr.length) {
          return (
            value === valueArr[valueIndex + 1] ||
            value === rowArr[valueIndex][rowIndex + 1]
          );
        }
      })
    );
};

export const boardCanMove = (board: number[][]) =>
  board.some((row) => row.includes(0));

export const checkForWin = (board: number[][]) =>
  board.some((row) => row.includes(2048));

//This function calculate Score = sum every value on the board + 5% of total score
export const calculateScore = (board: number[][], score: number) => {
  return Math.round(
    score +
      board
        .flatMap((row) => row.reduce((acc, value) => acc + value, 0))
        .reduce((acc, value) => acc + value, 0) *
        0.05
  );
};

export const play = (board: number[][], direction: Direction): GameObject => {
  const oldBoard = [...board];
  let hasMoved = false;
  let newBoard: number[][] = [];
  switch (direction) {
    case "up":
      newBoard = moveUp(board);
      hasMoved = !compare2DArray(newBoard, oldBoard);
      if (hasMoved) board = newBoard;
      return { board: newBoard, hasMoved };
    case "right":
      newBoard = moveRight(board);
      hasMoved = !compare2DArray(newBoard, oldBoard);
      if (hasMoved) board = newBoard;
      return { board, hasMoved };
    case "down":
      newBoard = moveDown(board);
      hasMoved = !compare2DArray(newBoard, oldBoard);
      if (hasMoved) board = newBoard;
      return { board, hasMoved };
    case "left":
      newBoard = moveLeft(board);
      hasMoved = !compare2DArray(newBoard, oldBoard);
      if (hasMoved) board = newBoard;
      return { board, hasMoved };
    default:
      return { board, hasMoved };
  }
};

//TODO refactor this function in a smarter way
export const getBackgroundColor = (value: number) => {
  switch (value) {
    case 2:
      return "#EBDCD0";
    case 4:
      return "#E9DBBA";
    case 8:
      return "#E9A067";
    case 16:
      return "#F08151";
    case 32:
      return "#F2654F";
    case 64:
      return "#F1462C";
    case 128:
      return "#E7C65E";
    case 256:
      return "#E8C350";
    case 512:
      return "#E8BE40";
    case 1024:
      return "#E8BB31";
    case 2048:
      return "#E7B723";
    default:
      return "#C2B3A3";
  }
};
