import { SudokuCell, SudokuGrid } from "../models/Sudoku";

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

    static findRegionRowAndCol = (cellRow: number, cellCol: number) => {
        return [this.findRegionRow(cellRow), this.findRegionCol(cellCol)];
    };

    static findRegionIndexes = (rowNumber: number, colNumber: number) => {
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

    static extractColumnFromGrid = (grid: SudokuGrid, colNumber: number) => {
        return grid.reduce(
            (column, currentRow) => [...column, currentRow[colNumber]],
            []
        );
    };

    static extractRegionFromGrid = (grid: SudokuGrid, cellRow: number, cellCol: number) => {
        const region: SudokuCell[] = [];
        const indices = this.findRegionIndexes(cellRow, cellCol);
        indices.rows.forEach(row => {
            indices.cols.forEach(col => {
                region.push(grid[row][col]);
            })
        })
        return region;
    }

    static extractAllRegionsFromGrid = (grid: SudokuGrid) => {
        const mappedRegions: [SudokuCell, number, number][][][] = [
            ...Array(3),
        ].map(() => [...Array(3)].map(() => []));

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const [regionRow, regionCol] = this.findRegionRowAndCol(
                    row,
                    col
                );

                const cellValue = grid[row][col];
                const cellInfo: [SudokuCell, number, number] = [
                    cellValue,
                    row,
                    col,
                ];
                mappedRegions[regionRow][regionCol].push(cellInfo);
            }
        }

        return mappedRegions;
    };
}

export default SudokuGridMapper;
