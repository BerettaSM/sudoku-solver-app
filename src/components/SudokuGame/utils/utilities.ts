import SudokuCell from "../models/SudokuCell";

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

export const getCellRowAndColumnFromId = (id: string) => {
    const cellNum = +id.substring(5);
    const row = cellNum % 9;
    const col = Math.floor(cellNum / 9);
    return [row, col];
};
