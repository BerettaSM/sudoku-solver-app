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
    const [message, setMessage] = useState('');

    useEffect(() => {
        const updatedConflicts = Validator.getAllConflicts(grid);
        setConflicts(updatedConflicts);
    }, [grid]);

    useEffect(() => {
        if(message === '') return;
        const time = 3500;
        const messageTimeout = setTimeout(() => {
            setMessage('');
        }, time)
        return () => clearTimeout(messageTimeout);
    }, [message]);

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
        setMessage('');
        setGrid(getClearGrid());
        setConflicts(getConflictsObject());
    };

    const generatePuzzle = () => {
        setMessage('');
        const puzzle = Solver.generatePartialPuzzle(27);
        setGrid(puzzle);
    };

    const solvePuzzle = async () => {
        setMessage('');
        setCalculating(true);

        setTimeout(() => {
            /*
                Timeout so the GUI can actually update before being
                momentarily blocked.
            */
            Solver.solve(grid)
                .then((solution) => {
                    setGrid(solution);
                })
                .catch((failure) => {
                    setMessage(failure);
                })
                .finally(() => {
                    setCalculating(false);
                });
        }, 100);
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
        message,
    };
};

export default useSudoku;
