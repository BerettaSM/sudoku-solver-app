import SudokuGrid from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";

export const getClearGrid = (): SudokuGrid => Array(9).fill(Array(9).fill(""));

export const validCellValues: SudokuCell[] = [
    "",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
];
