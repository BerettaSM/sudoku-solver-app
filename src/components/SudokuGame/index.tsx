import React from "react";

import SudokuGrid from "./SudokuGrid";
import useSudoku from "./hooks/use-sudoku";

const SudokuGame: React.FC = () => {
    const {
        grid,
        conflicts,
        changeCell,
        clearGrid,
        generatePuzzle,
        solvePuzzle,
        calculating,
        isSolvable,
    } = useSudoku();

    return (
        <div>
            <h3>Sudoku Solver{calculating && <> : Loading...</>}</h3>
            <SudokuGrid
                grid={grid}
                conflicts={conflicts}
                onCellChange={changeCell}
            />

            <button onClick={clearGrid}>Clear</button>
            <br />
            <button onClick={generatePuzzle}>Generate</button>
            <br />
            <button disabled={!isSolvable} onClick={solvePuzzle}>
                Solve puzzle
            </button>
            <br />
        </div>
    );
};

export default SudokuGame;
