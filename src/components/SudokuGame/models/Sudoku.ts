export type SudokuCell = "" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type CellRow = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CellCol = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CellId = `${CellRow}${CellCol}`;

export type CellInfo = [SudokuCell, CellRow, CellCol];

export type RegionRow = 0 | 1 | 2;

export type RegionCol = 0 | 1 | 2;

export type RegionNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ShouldReturn = boolean;

export type SudokuGrid = SudokuCell[][];

export interface Conflicts {
    rows: CellRow[];
    cols: CellCol[];
    regions: RegionCol[][];
    cells: CellId[];
}