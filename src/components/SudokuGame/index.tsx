import React from "react";

import styles from "./index.module.css";

import SudokuGrid from "./SudokuGrid";
import useSudoku from "./hooks/use-sudoku";
import Spinner from "../Spinner";
import Title from "../Title";
import Message from "../Message";

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
            <Title />
            <Message message={message} />
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
                    {calculating ? (
                        <Spinner />
                    ) : !isSolvable ? (
                        <>...</>
                    ) : (
                        <>Solve</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SudokuGame;
