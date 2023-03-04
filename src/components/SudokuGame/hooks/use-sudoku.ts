import { useState, useEffect } from "react";

import { SudokuCell, SudokuGrid } from "../models/Sudoku";
import { Conflicts, getConflictsObject } from "../models/Conflicts";

import Solver from "../utils/SudokuSolver";
import { getClearGrid } from "../utils/utilities";

const useSudoku = () => {
    const [grid, setGrid] = useState<SudokuGrid>(getClearGrid());

    const [conflicts, setConflicts] = useState<Conflicts>(getConflictsObject());

    useEffect(() => {
        const updatedConflicts = Solver.getAllConflicts(grid);
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

    const solvePuzzle = () => {
        const solution = Solver.solve(grid);
        setGrid(solution);
    }

    const isSolvable = !Solver.puzzleHasConflicts(conflicts) && !Solver.isGridFullySet(grid);
    
    return {
        grid,
        conflicts,
        changeCell,
        clearGrid,
        solvePuzzle,
        isSolvable
    };
};

export default useSudoku;
