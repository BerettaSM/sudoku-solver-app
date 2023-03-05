import React, { useEffect} from "react";

import styles from "./index.module.css";

import SudokuGrid from "./SudokuGrid";
import useSudoku from "./hooks/use-sudoku";
import Spinner from "../Spinner";

const SudokuGame: React.FC = () => {

    const {
        calculating,
        changeCell,
        clearGrid,
        conflicts,
        generatePuzzle,
        grid,
        message,
        isSolvable,
        solvePuzzle,
    } = useSudoku();

    return (
        <div className={styles["sudoku-game"]}>
            <h3>Sudoku Solver</h3>
            {message !== '' && <h5 className={styles.message}>{message}</h5>}
            <SudokuGrid
                grid={grid}
                conflicts={conflicts}
                onCellChange={changeCell}
            />
            <div className={styles.actions}>
                <div>
                    <button disabled={calculating} onClick={clearGrid}>
                        Clear
                    </button>
                    <button disabled={calculating} onClick={generatePuzzle}>
                        Generate New Puzzle
                    </button>
                </div>
                <button
                    disabled={!isSolvable || calculating}
                    onClick={solvePuzzle}
                >
                    {calculating && <Spinner />}
                    {!calculating && <>Solve</>}
                </button>
            </div>
        </div>
    );
};

export default SudokuGame;
