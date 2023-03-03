import { useState } from "react";

import SudokuGrid from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";
import Mapper from "../utils/SudokuGridMapper";
import Solver from "../utils/SudokuSolver";
import { getClearGrid } from "../utils/utilities";
import { Conflicts, getConflictsObject } from "../models/Conflicts";

const useSudoku = () => {
    const [grid, setGrid] = useState<SudokuGrid>(getClearGrid());

    const [conflicts, setConflicts] = useState<Conflicts>(getConflictsObject());

    const updateConflicts = (
        grid: SudokuGrid,
        rowNumber: number,
        colNumber: number
    ) => {
        const regionIndex = Mapper.findRegionIndex(rowNumber, colNumber);
        const newConflicts = Solver.getConflicts(grid, rowNumber, colNumber);
        const updatedConflicts: Conflicts = {
            rows: conflicts.rows.map((row) => [...row]),
            cols: conflicts.cols.map((col) => [...col]),
            regions: conflicts.regions.map((region) => [...region]),
            cells: conflicts.cells.map((cell) => [...cell]),
        };
        updatedConflicts.rows[rowNumber] = newConflicts.row;
        updatedConflicts.cols[colNumber] = newConflicts.col;
        updatedConflicts.regions[regionIndex] = newConflicts.region;

        console.log(updatedConflicts)

        setConflicts(updatedConflicts);
    };

    const changeCell = (
        newCellValue: SudokuCell,
        rowNumber: number,
        colNumber: number
    ) => {
        setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((row) => [...row]);
            updatedGrid[rowNumber][colNumber] = newCellValue;
            
            updateConflicts(updatedGrid, rowNumber, colNumber);

            return updatedGrid;
        });
    };

    const clearGrid = () => {
        setGrid(getClearGrid());
        setConflicts(getConflictsObject());
    };
    
    return {
        grid,
        conflicts,
        changeCell,
        clearGrid,
    };
};

export default useSudoku;
