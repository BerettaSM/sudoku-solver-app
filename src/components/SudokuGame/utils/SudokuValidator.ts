import { validCellValues } from "./utilities";
import {
    CellCol,
    CellRow,
    CellId,
    SudokuCell,
    SudokuGrid,
    RegionCol,
} from "../models/Sudoku";
import { Conflicts } from "../models/Sudoku";

import Mapper from "./SudokuMapper";

class SudokuValidator {
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

    /*
        Full scan methods - Scan the whole grid.
    */

    static getAllRowConflicts = (grid: SudokuGrid) => {
        const conflictingRowNumbers: CellRow[] = [];
        const conflictingCells: CellId[] = [];

        grid.forEach((row, rowNumber) => {
            const rowConflicts = this.getConflictingIndexes(row);

            if (rowConflicts.length > 0) {
                conflictingRowNumbers.push(rowNumber as CellRow);
                rowConflicts.forEach((col) => {
                    const cellId = `${rowNumber}${col}`;
                    conflictingCells.push(cellId as CellId);
                });
            }
        });

        return {
            rows: conflictingRowNumbers,
            individualCells: conflictingCells,
        };
    };

    static getAllColConflicts = (grid: SudokuGrid) => {
        const conflictingColNumbers: CellCol[] = [];
        const conflictingCells: CellId[] = [];

        for (let col = 0; col < 9; col++) {
            const extractedColumn = Mapper.extractColumnFromGrid(
                grid,
                col as CellCol
            );
            const colConflicts = this.getConflictingIndexes(extractedColumn);

            if (colConflicts.length > 0) {
                conflictingColNumbers.push(col as CellCol);
                colConflicts.forEach((rowNumber) => {
                    const cellId = `${rowNumber}${col}`;
                    conflictingCells.push(cellId as CellId);
                });
            }
        }

        return {
            cols: conflictingColNumbers,
            individualCells: conflictingCells,
        };
    };

    static getAllRegionConflicts = (grid: SudokuGrid) => {
        const conflictingRegionNumbers: RegionCol[][] = [...Array(3)].map(
            () => []
        );
        const conflictingCells: CellId[] = [];

        const regions = Mapper.extractAllRegionsFromGrid(grid);

        regions.forEach((regionRow, regionRowNumber) => {
            regionRow.forEach((region, regionColNumber) => {
                const aux = region.reduce(
                    (
                        auxObj: {
                            regionCellValues: SudokuCell[];
                            regionCellIds: CellId[];
                        },
                        r
                    ) => {
                        const cell = r[0];
                        const cellId = `${r[1]}${r[2]}`;
                        auxObj.regionCellValues.push(cell);
                        auxObj.regionCellIds.push(cellId as CellId);
                        return auxObj;
                    },
                    { regionCellValues: [], regionCellIds: [] }
                );

                const regionConflicts = this.getConflictingIndexes(
                    aux.regionCellValues
                );

                if (regionConflicts.length > 0) {
                    conflictingRegionNumbers[regionRowNumber].push(
                        regionColNumber as RegionCol
                    );

                    regionConflicts.forEach((index) => {
                        const cellNumber = aux.regionCellIds[index];
                        conflictingCells.push(cellNumber);
                    });
                }
            });
        });

        return {
            regions: conflictingRegionNumbers,
            individualCells: conflictingCells,
        };
    };

    static getAllConflicts = (grid: SudokuGrid) => {
        const rowConflicts = this.getAllRowConflicts(grid);
        const colConflicts = this.getAllColConflicts(grid);
        const regionConflicts = this.getAllRegionConflicts(grid);

        const uniqueCells = [
            ...rowConflicts.individualCells,
            ...colConflicts.individualCells,
            ...regionConflicts.individualCells,
        ].reduce((filteredCells: CellId[], cell, currIndex, arr) => {
            if (currIndex === arr.lastIndexOf(cell)) {
                filteredCells.push(cell as CellId);
            }
            return filteredCells;
        }, []);

        return {
            rows: rowConflicts.rows,
            cols: colConflicts.cols,
            regions: regionConflicts.regions,
            cells: uniqueCells,
        };
    };

    /*
        Partial scan methods - scan isolate rows, columns and regions.
    */

    static getRowConflicts = (grid: SudokuGrid, row: CellRow) => {
        return this.getConflictingIndexes(grid[row]);
    };

    static getColConflicts = (grid: SudokuGrid, col: CellCol) => {
        const extractedColumn = Mapper.extractColumnFromGrid(grid, col);
        return this.getConflictingIndexes(extractedColumn);
    };

    static getRegionConflicts = (
        grid: SudokuGrid,
        row: CellRow,
        col: CellCol
    ) => {
        const extractedRegion = Mapper.extractRegionFromGrid(grid, row, col);
        return this.getConflictingIndexes(extractedRegion);
    };

    static puzzleHasAnyConflict = (conflicts: Conflicts) => {
        return Object.entries(conflicts).reduce(
            (hasPreviousConflict, [key, arr]) => {
                if (key === "regions") {
                    return (
                        (arr as RegionCol[][]).some((a) => a.length > 0) ||
                        hasPreviousConflict
                    );
                } else {
                    return arr.length > 0 || hasPreviousConflict;
                }
            },
            false
        );
    };

    static cellHasAdjacentConflict = (
        grid: SudokuGrid,
        row: CellRow,
        col: CellCol
    ) => {
        return [
            this.getRowConflicts(grid, row),
            this.getColConflicts(grid, col),
            this.getRegionConflicts(grid, row, col),
        ].some((conflicts) => conflicts.length > 0);
    };

    static findEmptyCell = (grid: SudokuGrid): [CellRow, CellCol] | null => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === "")
                    return [row as CellRow, col as CellCol];
            }
        }
        return null;
    };

    static getValidValues = (grid: SudokuGrid, row: CellRow, col: CellCol) => {
        const possibleValues = new Set(validCellValues);
        for (let i = 0; i < 9; i++) {
            possibleValues.delete(grid[row][i]);
            possibleValues.delete(grid[i][col]);
        }
        const region = Mapper.extractRegionFromGrid(grid, row, col);
        region.forEach((value) => possibleValues.delete(value));
        return Array.from(possibleValues);
    };
}

export default SudokuValidator;
