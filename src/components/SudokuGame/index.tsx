import React from "react";

import SudokuGrid from "./SudokuGrid";
import useSudoku from "./hooks/use-sudoku";

const SudokuGame: React.FC = () => {
    const { grid, conflicts, changeCell, clearGrid, solvePuzzle, isSolvable } =
        useSudoku();

    return (
        <div>
            <h3>Sudoku Solver</h3>
            <SudokuGrid
                grid={grid}
                conflicts={conflicts}
                onCellChange={changeCell}
            />

            <button onClick={clearGrid}>Clear</button>
            <br />
            <button>Generate</button>
            <br />
            <button disabled={!isSolvable} onClick={solvePuzzle}>Solve puzzle</button>
            <br />
            {/* Game must be evaluated for conflicts after every input */}
        </div>
    );
};

export default SudokuGame;
