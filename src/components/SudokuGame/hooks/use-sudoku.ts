import { useState, useEffect } from "react";

import { SudokuCell, SudokuGrid } from "../models/Sudoku";
import Solver from "../utils/SudokuSolver";
import { getClearGrid } from "../utils/utilities";
import { Conflicts, getConflictsObject } from "../models/Conflicts";

const useSudoku = () => {
    const [grid, setGrid] = useState<SudokuGrid>(getClearGrid());

    const [conflicts, setConflicts] = useState<Conflicts>(getConflictsObject());

    useEffect(() => {
        const updatedConflicts = Solver.getConflicts(grid);
        setConflicts(updatedConflicts);
    }, [grid])

    const changeCell = (
        newCellValue: SudokuCell,
        rowNumber: number,
        colNumber: number
    ) => {
        setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((row) => [...row]);
            updatedGrid[rowNumber][colNumber] = newCellValue;
            return updatedGrid;
        });
    };

    const clearGrid = () => {
        setGrid(getClearGrid());
        setConflicts(getConflictsObject());
    };

    const isSolvable = Object.entries(conflicts).reduce((isSolvable, [key, arr]) => {
        if(key === 'regions') {
            return (arr as number[][]).every(a => a.length === 0) && isSolvable;
        } else {
            return arr.length === 0 && isSolvable;
        }
    }, true);

    return {
        grid,
        conflicts,
        changeCell,
        clearGrid,
        isSolvable
    };
};

export default useSudoku;
