import React from "react";
import styles from "./index.module.css";

import SudokuGridModel from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";

import { sliceIntoChunks, validCellValues } from "../utils/utilities";

const SudokuGrid: React.FC<{
    grid: SudokuGridModel;
    onCellChange: (
        newCellValue: SudokuCell,
        cellNumber: number
    ) => void;
}> = ({ grid, onCellChange }) => {

    const cellChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SudokuCell;
        if(!validCellValues.includes(value)) {
            return;
        }
        const cellNumber = +event.target.id.substring(5);
        onCellChange(value, cellNumber);
    }

    const colGroups = () => {
        const colGroups = [];
        for (let i = 0; i < 3; i++) {
            const cols = [];
            for (let j = 0; j < 3; j++) {
                const colNumber = 3 * i + j;
                cols.push(
                    <col
                        className={`col col-${colNumber}`}
                        key={`col-${colNumber}`}
                    />
                );
            }
            const colGroup = (
                <colgroup key={`region-col-${i}`} className={`region-col-${i} ${styles.colgroup}`}>
                    {cols}
                </colgroup>
            );
            colGroups.push(colGroup);
        }
        return colGroups;
    };

    const tableBody = () => {
        const tBodies = sliceIntoChunks(grid, 3) as any[][][];
        return tBodies.map((tBody, tBodyIndex) => (
            // A tbody represents 3 rows
            <tbody
                key={`region-row-${tBodyIndex}`}
                className={`region-row-${tBodyIndex} ${styles.tbody}`}
            >
                {tBody.map((tableRow, tableRowIndex) => {
                    const gridRowIndex = 3 * tBodyIndex + tableRowIndex;
                    return (
                        <tr
                            key={`row-${gridRowIndex}`}
                            className={`row-${gridRowIndex}`}
                        >
                            {tableRow.map((cell, cellIndex) => {
                                const cellNumber = gridRowIndex * 9 + cellIndex;
                                return (
                                    <td key={`cell-${cellNumber}`}>
                                        <input
                                            id={`cell-${cellNumber}`}
                                            className={`${styles.td}`}
                                            type='text'
                                            value={cell}
                                            onChange={cellChangeHandler}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        ));
    };

    return (
        <table className={styles.table}>
            {colGroups()}
            {tableBody()}
        </table>
    );
};

export default SudokuGrid;
