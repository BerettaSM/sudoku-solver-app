import SudokuCell from "../models/SudokuCell";
import SudokuGrid from "../models/SudokuGrid";

import Mapper from "./SudokuGridMapper";

class SudokuSolver {
    static getConflictingIndexes = (sequence: SudokuCell[]) => {
        const conflicts = [];
        for (let i = 0; i < sequence.length; i++) {
            const cell = sequence[i];
            if (cell === "") continue;
            const lastOccurrenceIndex = sequence.lastIndexOf(cell);
            if (i !== lastOccurrenceIndex) {
                conflicts.push(i);
                if (!conflicts.includes(lastOccurrenceIndex)) {
                    conflicts.push(lastOccurrenceIndex);
                }
            }
        }
        return conflicts;
    };

    static getRowConflicts = (grid: SudokuGrid, rowNumber: number) => {
        const row = grid[rowNumber];
        return this.getConflictingIndexes(row);
    };

    static getColConflicts = (grid: SudokuGrid, colNumber: number) => {
        const column = Mapper.extractColumnFromGrid(grid, colNumber);
        return this.getConflictingIndexes(column);
    };

    static getRegionConflicts = (
        grid: SudokuGrid,
        rowNumber: number,
        colNumber: number
    ) => {
        const region = Mapper.extractRegionFromGrid(grid, rowNumber, colNumber);
        return this.getConflictingIndexes(region);
    };

    static getConflicts = (
        grid: SudokuGrid,
        rowNumber: number,
        colNumber: number
    ) => {
        return {
            row: this.getRowConflicts(grid, rowNumber),
            col: this.getColConflicts(grid, colNumber),
            region: this.getRegionConflicts(grid, rowNumber, colNumber),
        };
    };
}

export default SudokuSolver;
