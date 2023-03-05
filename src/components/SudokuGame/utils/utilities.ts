import {
    CellCol,
    CellInfo,
    CellRow,
    Conflicts,
    SudokuCell,
    SudokuGrid,
} from "../models/Sudoku";

export const getClearGrid = (): SudokuGrid =>
    [...Array(9)].map(() => [...Array(9)].map(() => ""));

export const copyGrid = (grid: SudokuGrid) => grid.map((row) => [...row]);

export const validCellValues: SudokuCell[] = [
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

export const getRandomCellValue = () => {
    const rndIndex = Math.floor(Math.random() * validCellValues.length);
    return validCellValues[rndIndex];
};

export const getRandomGridLocation = (): [CellRow, CellCol] => {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    return [row as CellRow, col as CellCol];
};

export const getConflictsObject = (): Conflicts => ({
    rows: [],
    cols: [],
    regions: [[], [], []],
    cells: [],
});

export const getMappedRegionsArray = (): CellInfo[][][] =>
    [...Array(3)].map(() => [...Array(3)].map(() => []));
