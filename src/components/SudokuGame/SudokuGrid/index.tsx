import React, { memo } from "react";
import styles from "./index.module.css";

import SudokuGridModel from "../models/SudokuGrid";
import SudokuCell from "../models/SudokuCell";

import { validCellValues } from "../utils/utilities";
import Mapper from "../utils/SudokuGridMapper";
import { Conflicts } from "../models/Conflicts";

const SudokuGrid: React.FC<{
    grid: SudokuGridModel;
    conflicts: Conflicts;
    onCellChange: (newCellValue: SudokuCell, row: number, col: number) => void;
}> = ({ grid, conflicts, onCellChange }) => {
    const cellChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SudokuCell;
        if (!validCellValues.includes(value)) {
            return;
        }
        const cellId = event.target.id;
        const cellRow = +cellId[3];
        const cellCol = +cellId[4];
        onCellChange(value, cellRow, cellCol);
    };

    // const sudokuGridBody = () => {

    //     //console.log(fullGrid);
    //     return <></>;
    // };

    const fullGrid = Mapper.divideIntoRegions(grid);
    return (
        <div className={styles["sudoku-grid"]}>
            {fullGrid.map((regionRow, regionRowIndex) => {
                return (
                    <div
                        key={`region-row-${regionRowIndex}`}
                        className={styles["region-row"]}
                    >
                        {regionRow.map((region, regionIndex) => {
                            const regionNumber =
                                regionRowIndex * 3 + regionIndex;
                            const regionHasConflict =
                                conflicts.regions[regionNumber].length !== 0;
                            const regionClasses = `${styles.region} ${
                                regionHasConflict
                                    ? styles["conflicted-region"]
                                    : null
                            }`;
                            return (
                                <div
                                    key={`region-${regionNumber}`}
                                    className={regionClasses}
                                >
                                    {region.map(([cell, row, col]) => {
                                        const cellId = `rc-${row}${col}`;
                                        const cellRowHasConflict =
                                            conflicts.rows[row].length !== 0;
                                        const cellColHasConflict =
                                            conflicts.cols[col].length !== 0;
                                        const cellClasses = `${styles.cell} ${
                                            cellRowHasConflict ||
                                            cellColHasConflict
                                                ? styles["red-bordered-cell"]
                                                : null
                                        }`;
                                        return (
                                            <input
                                                key={cellId}
                                                id={cellId}
                                                className={cellClasses}
                                                type="text"
                                                autoComplete="off"
                                                value={cell}
                                                onChange={cellChangeHandler}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default memo(SudokuGrid);
