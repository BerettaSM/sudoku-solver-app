import React, { memo } from "react";
import styles from "./index.module.css";

import SudokuRegion from "./SudokuRegion";

import {
    CellCol,
    CellRow,
    RegionCol,
    SudokuCell,
    SudokuGrid as SudokuGridModel,
} from "../models/Sudoku";
import { Conflicts } from "../models/Sudoku";

import { validCellValues } from "../utils/utilities";
import Mapper from "../utils/SudokuMapper";

const SudokuGrid: React.FC<{
    grid: SudokuGridModel;
    conflicts: Conflicts;
    onCellChange: (
        newCellValue: SudokuCell,
        row: CellRow,
        col: CellCol
    ) => void;
}> = ({ grid, conflicts, onCellChange }) => {
    const cellChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SudokuCell;
        if (!validCellValues.includes(value) && value !== "") {
            return;
        }
        const cellId = event.target.id;
        const cellRow = +cellId[3] as CellRow;
        const cellCol = +cellId[4] as CellCol;
        onCellChange(value, cellRow, cellCol);
    };

    /*
        Mainly so regions can be grouped in separate divs and styled.
    */
    const fullGrid = Mapper.extractAllRegionsFromGrid(grid);

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
                            const regionHasConflict = conflicts.regions[
                                regionRowIndex
                            ].includes(regionColIndex as RegionCol);
                            const regionClasses = `${styles.region} ${
                                regionHasConflict
                                    ? styles["conflicted-region"]
                                    : null
                            }`;
                            return (
                                <SudokuRegion
                                    key={`region-${regionId}`}
                                    region={region}
                                    classes={regionClasses}
                                    conflicts={conflicts}
                                    onCellChange={cellChangeHandler}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default memo(SudokuGrid);
