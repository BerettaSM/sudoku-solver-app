import React, { ChangeEvent } from "react";
import styles from "./index.module.css";

import SudokuGridModel from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";

import { validCellValues, getCellRowAndColumnFromId } from "../utils/utilities";

const SudokuGrid: React.FC<{
    grid: SudokuGridModel;
    onCellChange: (
        cellValue: SudokuCell,
        cellRow: number,
        cellCol: number
    ) => void;
}> = ({ grid, onCellChange }) => {
    const cellChangeHandler = (event: ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value as SudokuCell;
        if (!validCellValues.includes(value)) {
            return;
        }
        const [cellRow, cellCol] = getCellRowAndColumnFromId(event.target.id);
        onCellChange(value, cellRow, cellCol);
    };

    const sudokuGrid = grid.map((col, colIndex) => (
        <div key={`col-${colIndex}`} className={styles[`col-${colIndex}`]}>
            {col.map((cell, cellIndex) => {
                const cellNum = 9 * colIndex + cellIndex;
                const rowNumber = cellIndex % 9;
                const className = `${styles["row-" + rowNumber]} ${
                    styles.cell
                }`;
                return (
                    <div key={`cell-${cellNum}`} className={className}>
                        <input
                            type="text"
                            value={cell}
                            id={`cell-${cellNum}`}
                            onChange={cellChangeHandler}
                        />
                    </div>
                );
            })}
        </div>
    ));

    return <div className={styles["sudoku-grid"]}>{sudokuGrid}</div>;
};

export default SudokuGrid;
