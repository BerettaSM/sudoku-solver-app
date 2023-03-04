import { Conflicts } from "../models/Conflicts";
import { SudokuCell, SudokuGrid } from "../models/Sudoku";

import Mapper from "./SudokuGridMapper";

import { validCellValues } from "./utilities";

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

    /*
        Full scan methods - Scan the whole grid.
    */

    static getAllRowConflicts = (grid: SudokuGrid) => {
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

    static getAllColConflicts = (grid: SudokuGrid) => {
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

    static getAllRegionConflicts = (grid: SudokuGrid) => {
        const conflictingRegionNumbers: number[][] = [...Array(3)].map(
            () => []
        );
        const conflictingCells: string[] = [];

        const regions = Mapper.extractAllRegionsFromGrid(grid);

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

    static getAllConflicts = (grid: SudokuGrid) => {
        const rowConflicts = this.getAllRowConflicts(grid);
        const colConflicts = this.getAllColConflicts(grid);
        const regionConflicts = this.getAllRegionConflicts(grid);

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

    /*
        Partial scan methods - scan isolate rows, columns and regions.
    */

    static getRowConflicts = (grid: SudokuGrid, row: number) => {
        return this.getConflictingIndexes(grid[row]);
    }

    static getColConflicts = (grid: SudokuGrid, col: number) => {
        const extractedColumn = Mapper.extractColumnFromGrid(grid, col);
        return this.getConflictingIndexes(extractedColumn);
    }

    static getRegionConflicts = (grid: SudokuGrid, row: number, col: number) => {
        const extractedRegion = Mapper.extractRegionFromGrid(grid, row, col);
        return this.getConflictingIndexes(extractedRegion);
    }

    static puzzleHasConflicts = (conflicts: Conflicts) => {
        return Object.entries(conflicts).reduce((isSolvable, [key, arr]) => {
            if(key === 'regions') {
                return (arr as number[][]).some(a => a.length > 0) || isSolvable;
            } else {
                return arr.length > 0 || isSolvable;
            }
        }, false);
    }

    static coordinateHasConflicts = (grid: SudokuGrid, row: number, col: number) => {
        return [
            this.getRowConflicts(grid, row),
            this.getColConflicts(grid, col),
            this.getRegionConflicts(grid, row, col)
        ].some(conflicts => conflicts.length > 0);
    }

    static isGridFullySet = (grid: SudokuGrid) => {
        for(const row of grid) {
            for(const cell of row) {
                if(cell === "") return false;
            }
        }
        return true;
    }

    static solve = (grid: SudokuGrid) => {
        if(this.isGridFullySet(grid)) {
            throw new Error('Grid has no empty spaces');
        }
        const gridCopy = grid.map(row => [...row]);
        const [gridSolution] = this._solve(gridCopy);
        return gridSolution;
    }

    private static _solve = (grid: SudokuGrid): [SudokuGrid, boolean] => {
        if(this.isGridFullySet(grid)) {
            return [grid, true];
        }
        for(let row = 0;row < 9;row++) {
            for(let col = 0; col < 9;col++) {
                const cell = grid[row][col];
                if(cell !== '') continue;
                for(const num of validCellValues) {
                    grid[row][col] = num;
                    if(!this.coordinateHasConflicts(grid, row, col)) {
                        const [gridPermutation, shouldReturn] = this._solve(grid);
                        if(shouldReturn) {
                            return [gridPermutation, true];
                        }
                    }
                    grid[row][col] = cell;
                }
                return [grid, false];
            }
        }
        throw new Error('No solution.');
    }

}

// solve(puzzleString) {
//     /*
//         This function expects a valid puzzle string,
//         or in other words, validated by validatePuzzle() function.
//     */
//     if(puzzleString.indexOf('.') == -1) {
//         /*
//             Our base case.
            
//             A solution is considered solved when it first enters
//             this function, with no dots. It must only have numbers in it.
//         */
//         return puzzleString;
//     }
//     for(const pos in puzzleString) {
//         /*
//             We don't worry about positions that already contain numbers,
//             since the puzzle string has already been validated by validatePuzzle().
//         */
//         if(puzzleString[pos] == '.') {
//             /*
//                 We calculate the row and column for a position
//                 inside the string.
//             */
//             const row = floor(pos / 9);
//             const column = pos % 9;
//             /*
//                 From 1 to 9.
//             */
//             for(const num of this.validNums) {
//                 /*
//                     We test it for conflicts.
//                 */
//                 const conflicts = this.checkForConflicts(
//                     puzzleString, row, column, num
//                 );
//                 if(conflicts.length == 0) {
//                     /*
//                         If there's no conflict when we test
//                         the current position for a number,
//                         we replace it.
//                     */
//                     let newPuzzleString = puzzleString.split('');
//                     newPuzzleString.splice(pos, 1, num);
//                     newPuzzleString = newPuzzleString.join('');
//                     /*
//                         And send it deeper into the recursion.
//                     */
//                     const puzzlePermutation = this.solve(newPuzzleString);
//                     if(puzzlePermutation.indexOf('.') == -1) {
//                         /*
//                             And if it's solved, meaning it has no more dots,
//                             we pass it back all the way to the first iteration.
//                         */
//                         return puzzlePermutation;
//                     }
//                 }
//             }
//             /*
//                 A solution could not be achieved, so we backtrack and
//                 let the upper iterations find a new solution.
//             */
//             return puzzleString;
//         }
//     }
// }

export default SudokuSolver;
