import { ShouldReturn, SudokuGrid } from "../models/Sudoku";

import {
    copyGrid,
    getClearGrid,
    getRandomCellValue,
    getRandomGridLocation,
    getTimestamp,
} from "./utilities";

import Validator from "./SudokuValidator";

class SudokuSolver {
    static generatePartialPuzzle = (cellQuantity: number) => {
        const grid = getClearGrid();
        for (let i = 0; i < cellQuantity; i++) {
            const [row, col] = getRandomGridLocation();
            while (true) {
                const randomCellValue = getRandomCellValue();
                grid[row][col] = randomCellValue;
                if (!Validator.cellHasAdjacentConflict(grid, row, col)) {
                    break;
                }
            }
        }
        return grid;
    };

    static solve = async (grid: SudokuGrid): Promise<SudokuGrid> => {
        const startTimestamp = getTimestamp();
        const timeoutInSeconds = 5;
        let isTimedOut = false;

        const copy = copyGrid(grid);

        const updateTimeout = () => {
            if (getTimestamp() > startTimestamp + timeoutInSeconds) {
                isTimedOut = true;
            }
        };

        const _solve = (grid: SudokuGrid): [SudokuGrid, ShouldReturn] => {
            const emptyCell = Validator.findEmptyCell(grid);
            if (emptyCell === null) {
                return [grid, true];
            }
            const [row, col] = emptyCell;
            const possibleValues = Validator.getValidValues(grid, row, col);
            for (const cellValue of possibleValues) {
                grid[row][col] = cellValue;
                if (!Validator.cellHasAdjacentConflict(grid, row, col)) {
                    const [gridPermutation, shouldReturn] = _solve(grid);
                    updateTimeout();
                    if (shouldReturn || isTimedOut) {
                        return [gridPermutation, true];
                    }
                }
                grid[row][col] = "";
            }
            return [grid, false];
        };

        return new Promise((resolve, reject) => {
            const [solution] = _solve(copy);
            const solved = Validator.findEmptyCell(solution) === null;
            if (isTimedOut) reject("Puzzle is taking too long. Aborting...");
            if (!solved) reject("Puzzle cannot be solved.");
            resolve(solution);
        });
    };
}

export default SudokuSolver;
