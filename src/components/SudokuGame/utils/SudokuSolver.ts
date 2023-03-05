import { ShouldReturn, SudokuGrid } from "../models/Sudoku";

import {
    copyGrid,
    getClearGrid,
    getRandomCellValue,
    getRandomGridLocation,
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

        const MAX_CALLS = 3500000;
        let calls = 0;

        const copy = copyGrid(grid);

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
                    calls++;
                    const [gridPermutation, shouldReturn] = _solve(grid);
                    if (shouldReturn || calls > MAX_CALLS) {
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
            if (calls > MAX_CALLS) reject("Puzzle is taking too long. Aborting...");
            if (!solved) reject("Puzzle cannot be solved.");
            resolve(solution);
        });
    };
}

export default SudokuSolver;
