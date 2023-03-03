import SudokuCell from "../models/SudokuCell";
import SudokuGrid from "../models/SudokuGrid";

class SudokuGridMapper {
    /* 
        There are 9 regions, each with a row and column.
    
          0  1  2  regionCol
        0 x  x  x
        1 x  x  x
        2 x  x  x
        regionRow
    */

    static findRegionRow = (cellRow: number) => {
        return Math.floor(cellRow / 3);
    };

    static findRegionCol = (cellColumn: number) => {
        return this.findRegionRow(cellColumn);
    };

    static getRegionIndexes = (rowNumber: number, colNumber: number) => {
        const regionRow = this.findRegionRow(rowNumber);
        const regionCol = this.findRegionCol(colNumber);
        const region: { rows: number[]; cols: number[] } = {
            rows: [],
            cols: [],
        };
        for (let i = 0; i < 3; i++) {
            region.rows.push(regionRow * 3 + i);
            region.cols.push(regionCol * 3 + i);
        }
        return region;
    };

    static findRegionIndex = (cellRow: number, cellCol: number) => {
        const regionRow = this.findRegionRow(cellRow);
        const regionCol = this.findRegionCol(cellCol);
        return regionRow * 3 + regionCol;
    };

    static extractColumnFromGrid = (grid: SudokuGrid, colNumber: number) => {
        return grid.reduce(
            (column, currentRow) => [...column, currentRow[colNumber]],
            []
        );
    };

    static extractRegionFromGrid = (
        grid: SudokuGrid,
        rowNumber: number,
        colNumber: number
    ) => {
        const region: SudokuCell[] = [];
        const { rows, cols } = this.getRegionIndexes(rowNumber, colNumber);
        rows.forEach((row) => {
            cols.forEach((col) => {
                region.push(grid[row][col]);
            });
        });
        return region;
    };

    static divideIntoRegions = (grid: SudokuGrid) => {
        const regions: [SudokuCell, number, number][][][] = [...Array(3)].map(
            (_) => [[], [], []]
        );
        grid.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                const regionRow = this.findRegionRow(rowIndex);
                const regionCol = this.findRegionCol(colIndex);
                regions[regionRow][regionCol].push([
                    cellValue,
                    rowIndex,
                    colIndex,
                ]);
            });
        });
        return regions;
    };
}

export default SudokuGridMapper;
