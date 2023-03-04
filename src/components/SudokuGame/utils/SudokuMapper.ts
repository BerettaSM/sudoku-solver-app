import { CellCol } from "./../models/Sudoku";
import { CellRow, CellInfo, SudokuCell, SudokuGrid } from "../models/Sudoku";

import { getMappedRegionsArray } from "./utilities";

class SudokuMapper {
    static findRegionRow = (row: CellRow) => {
        return Math.floor(row / 3);
    };

    static findRegionCol = (col: CellCol) => {
        return this.findRegionRow(col);
    };

    static findRegionRowAndCol = (row: CellRow, col: CellCol) => {
        return [this.findRegionRow(row), this.findRegionCol(col)];
    };

    static findRegionIndexes = (row: CellRow, col: CellCol) => {
        const regionRow = this.findRegionRow(row);
        const regionCol = this.findRegionCol(col);
        const region: { rows: CellRow[]; cols: CellCol[] } = {
            rows: [],
            cols: [],
        };
        for (let i = 0; i < 3; i++) {
            region.rows.push((regionRow * 3 + i) as CellRow);
            region.cols.push((regionCol * 3 + i) as CellCol);
        }
        return region;
    };

    static extractColumnFromGrid = (grid: SudokuGrid, col: CellCol) => {
        return grid.reduce(
            (column, currentRow) => [...column, currentRow[col]],
            []
        );
    };

    static extractRegionFromGrid = (
        grid: SudokuGrid,
        cellRow: CellRow,
        cellCol: CellCol
    ) => {
        const region: SudokuCell[] = [];
        const indices = this.findRegionIndexes(cellRow, cellCol);
        indices.rows.forEach((row) => {
            indices.cols.forEach((col) => {
                region.push(grid[row][col]);
            });
        });
        return region;
    };

    static extractAllRegionsFromGrid = (grid: SudokuGrid) => {
        const mappedRegions = getMappedRegionsArray();

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const [regionRow, regionCol] = this.findRegionRowAndCol(
                    row as CellRow,
                    col as CellCol
                );
                const cellValue = grid[row][col];
                const cellInfo: CellInfo = [
                    cellValue,
                    row as CellRow,
                    col as CellCol,
                ];
                mappedRegions[regionRow][regionCol].push(cellInfo);
            }
        }
        return mappedRegions;
    };
}

export default SudokuMapper;
