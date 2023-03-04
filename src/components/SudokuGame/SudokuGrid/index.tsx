import React, { memo } from "react";
import styles from "./index.module.css";

import { SudokuCell, SudokuGrid as SudokuGridModel } from "../models/Sudoku";
import { Conflicts } from "../models/Conflicts";

import { validCellValues } from "../utils/utilities";
import Mapper from "../utils/SudokuGridMapper";

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

    /*
        Mainly so regions can be grouped in separate divs and styled.
    */
    const fullGrid = Mapper.extractRegionsFromGrid(grid);

    return (
        <div className={styles["sudoku-grid"]}>
            {fullGrid.map((regionRow, regionRowIndex) => {
                return (
                    <div
                        key={`region-row-${regionRowIndex}`}
                        className={styles["region-row"]}
                    >
                        {regionRow.map((region, regionColIndex) => {
                            const regionId = `${regionRowIndex}${regionColIndex}`;
                            const regionHasConflict =
                                conflicts.regions[regionRowIndex].includes(
                                    regionColIndex
                                );
                            const regionClasses = `${styles.region} ${
                                regionHasConflict
                                    ? styles["conflicted-region"]
                                    : null
                            }`;
                            return (
                                <div
                                    key={`region-${regionId}`}
                                    className={regionClasses}
                                >
                                    {region.map(([cell, row, col]) => {
                                        const cellNumber = `${row}${col}`;
                                        const cellId = `rc-${cellNumber}`;
                                        const cellRowHasConflict =
                                            conflicts.rows.includes(row);
                                        const cellColHasConflict =
                                            conflicts.cols.includes(col);
                                        const cellHasConflict =
                                            conflicts.cells.includes(
                                                cellNumber
                                            );
                                        const cellClasses = `${styles.cell} ${
                                            cellRowHasConflict ||
                                            cellColHasConflict
                                                ? styles["red-bordered-cell"]
                                                : null
                                        } ${
                                            cellHasConflict
                                                ? styles["conflicted-cell"]
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