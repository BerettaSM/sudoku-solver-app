import { useState, useEffect } from "react";

import { SudokuCell, CellRow, CellCol } from "../models/Sudoku";
import { Conflicts } from "../models/Sudoku";

import Validator from "../utils/SudokuValidator";
import Solver from "../utils/SudokuSolver";
import { getClearGrid, getConflictsObject } from "../utils/utilities";

const useSudoku = () => {
    const [grid, setGrid] = useState(getClearGrid());
    const [conflicts, setConflicts] = useState<Conflicts>(getConflictsObject());
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const updatedConflicts = Validator.getAllConflicts(grid);
        setConflicts(updatedConflicts);
    }, [grid]);

    const changeCell = (
        newCellValue: SudokuCell,
        rowNumber: CellRow,
        colNumber: CellCol
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

    const generatePuzzle = () => {
        const puzzle = Solver.generatePartialPuzzle(26);
        setGrid(puzzle);
    };

    const solvePuzzle = async () => {
        setCalculating(true);

        Solver.solve(grid)
            .then((solution) => {
                setGrid(solution);
            })
            .catch((failure) => {
                alert(failure);
            })
            .finally(() => {
                setCalculating(false);
            });

    };

    const isSolvable =
        !Validator.puzzleHasAnyConflict(conflicts) &&
        Validator.findEmptyCell(grid) !== null;

    return {
        grid,
        conflicts,
        changeCell,
        clearGrid,
        generatePuzzle,
        solvePuzzle,
        calculating,
        isSolvable,
    };
};

export default useSudoku;
