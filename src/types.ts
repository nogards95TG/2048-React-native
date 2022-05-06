export type Direction = "left" | "right" | "up" | "down";

export type GameObject = {
  board: number[][];
  hasMoved?: boolean;
};
