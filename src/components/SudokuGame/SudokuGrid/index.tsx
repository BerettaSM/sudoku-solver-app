import React from "react";
import styles from "./index.module.css";

import SudokuGridModel from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";

import { sliceIntoChunks, validCellValues } from "../utils/utilities";
import Mapper from "../utils/SudokuGridMapper";

const SudokuGrid: React.FC<{
    grid: SudokuGridModel;
    onCellChange: (newCellValue: SudokuCell, cellNumber: number) => void;
}> = ({ grid, onCellChange }) => {
    const cellChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SudokuCell;
        if (!validCellValues.includes(value)) {
            return;
        }
        const cellNumber = +event.target.id.substring(5);
        onCellChange(value, cellNumber);
    };

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
                <colgroup
                    key={`region-col-${i}`}
                    className={`region-col-${i} ${styles.colgroup}`}
                >
                    {cols}
                </colgroup>
            );
            colGroups.push(colGroup);
        }
        return colGroups;
    };

    const tableBody = () => {
        const tBodies = sliceIntoChunks(grid, 3) as SudokuCell[][][];
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
                                            type="text"
                                            autoComplete="off"
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

    const sudokuGridBody = () => {
        const regions: [string, number][][][] = [...Array(3)].map((_) => [
            [],
            [],
            [],
        ]);
        grid.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                const regionRow = Mapper.transformCellRowToRegionRow(rowIndex);
                const regionCol =
                    Mapper.transformCellColumnToRegionColumn(colIndex);
                const cellNumber = Mapper.transformCellRowAndColumnToNumber(
                    rowIndex,
                    colIndex
                );
                regions[regionRow][regionCol].push([cellValue, cellNumber]);
            });
        });
        return (
            <>
                {regions.map((regionRow, regionRowIndex) => {
                    return (
                        <div
                            key={`region-row-${regionRowIndex}`}
                            className={styles["region-row"]}
                        >
                            {regionRow.map((region, regionIndex) => {
                                const regionNumber =
                                    regionRowIndex * 3 + regionIndex;
                                return (
                                    <div
                                        key={`region-${regionNumber}`}
                                        className={styles.region}
                                    >
                                        {region.map(([cell, cellNumber]) => (
                                            <input
                                                key={`cell-${cellNumber}`}
                                                id={`cell-${cellNumber}`}
                                                className={`${styles.cell}`}
                                                type="text"
                                                autoComplete="off"
                                                value={cell}
                                                onChange={cellChangeHandler}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        // <table className={styles.table}>
        //     {colGroups()}
        //     {tableBody2()}
        // </table>
        <div className={styles["sudoku-grid"]}>{sudokuGridBody()}</div>
    );
};

export default SudokuGrid;
