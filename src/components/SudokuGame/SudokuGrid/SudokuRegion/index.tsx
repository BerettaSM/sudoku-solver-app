import { Conflicts } from "../../models/Conflicts";
import { SudokuCell } from "../../models/Sudoku";

import styles from "../index.module.css";

const SudokuRegion: React.FC<{
    region: [SudokuCell, number, number][];
    classes: string;
    conflicts: Conflicts;
    onCellChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ region, classes, conflicts, onCellChange }) => {
    return (
        <div className={classes}>
            {region.map(([cell, row, col]) => {
                const cellNumber = `${row}${col}`;
                const cellId = `rc-${cellNumber}`;
                const cellRowHasConflict = conflicts.rows.includes(row);
                const cellColHasConflict = conflicts.cols.includes(col);
                const cellHasConflict = conflicts.cells.includes(cellNumber);
                const cellClasses = `${styles.cell} ${
                    cellRowHasConflict || cellColHasConflict
                        ? styles["red-bordered-cell"]
                        : null
                } ${cellHasConflict ? styles["conflicted-cell"] : null}`;
                return (
                    <input
                        key={cellId}
                        id={cellId}
                        className={cellClasses}
                        type="text"
                        autoComplete="off"
                        value={cell}
                        onChange={onCellChange}
                    />
                );
            })}
        </div>
    );
};

export default SudokuRegion;
