import { SudokuCell, SudokuGrid } from "../models/Sudoku";

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

    static getRowConflicts = (grid: SudokuGrid) => {
        const conflictingRowNumbers: number[] = [];
        const conflictingCells: string[] = [];

        grid.forEach((row, rowNumber) => {
            const rowConflicts = this.getConflictingIndexes(row);

            if (rowConflicts.length > 0) {
                conflictingRowNumbers.push(rowNumber);
                rowConflicts.forEach((col) => {
                    const cellNumber = `${rowNumber}${col}`;
                    conflictingCells.push(cellNumber);
                });
            }
        });

        return {
            rows: conflictingRowNumbers,
            individualCells: conflictingCells,
        };
    };

    static getColConflicts = (grid: SudokuGrid) => {
        const conflictingColNumbers: number[] = [];
        const conflictingCells: string[] = [];

        for (let col = 0; col < 9; col++) {
            const extractedColumn = Mapper.extractColumnFromGrid(grid, col);
            const colConflicts = this.getConflictingIndexes(extractedColumn);

            if (colConflicts.length > 0) {
                conflictingColNumbers.push(col);
                colConflicts.forEach((rowNumber) => {
                    const cellNumber = `${rowNumber}${col}`;
                    conflictingCells.push(cellNumber);
                });
            }
        }

        return {
            cols: conflictingColNumbers,
            individualCells: conflictingCells,
        };
    };

    static getRegionConflicts = (grid: SudokuGrid) => {
        const conflictingRegionNumbers: number[][] = [...Array(3)].map(
            () => []
        );
        const conflictingCells: string[] = [];

        const regions = Mapper.extractRegionsFromGrid(grid);
        regions.forEach((regionRow, regionRowNumber) => {
            regionRow.forEach((region, regionColNumber) => {
                const aux = region.reduce(
                    (
                        auxObj: {
                            regionCellValues: SudokuCell[];
                            regionCellNumbers: string[];
                        },
                        r
                    ) => {
                        const cell = r[0];
                        const cellNumber = `${r[1]}${r[2]}`;
                        auxObj.regionCellValues.push(cell);
                        auxObj.regionCellNumbers.push(cellNumber);
                        return auxObj;
                    },
                    { regionCellValues: [], regionCellNumbers: [] }
                );

                const regionConflicts = this.getConflictingIndexes(
                    aux.regionCellValues
                );

                if (regionConflicts.length > 0) {
                    conflictingRegionNumbers[regionRowNumber].push(
                        regionColNumber
                    );
                    regionConflicts.forEach((index) => {
                        const cellNumber = aux.regionCellNumbers[index];
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

    static getConflicts = (grid: SudokuGrid) => {
        const rowConflicts = this.getRowConflicts(grid);
        const colConflicts = this.getColConflicts(grid);
        const regionConflicts = this.getRegionConflicts(grid);

        const uniqueCells = [
            ...rowConflicts.individualCells,
            ...colConflicts.individualCells,
            ...regionConflicts.individualCells,
        ].reduce((filteredCells: string[], cell, currIndex, arr) => {
            if (currIndex === arr.lastIndexOf(cell)) {
                filteredCells.push(cell);
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
}

export default SudokuSolver;
