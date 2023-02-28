import React, { useState } from "react";

import SudokuGrid from "./SudokuGrid";
import SudokuGridModel from "./models/SudokuGrid";
import SudokuCell from "./models/SudokuCell";

const SudokuGame: React.FC = () => {
    const [grid, setGrid] = useState<SudokuGridModel>(
        Array(9).fill(Array(9).fill(""))
    );

    const changeCellValue = (
        newCellValue: SudokuCell,
        cellRow: number,
        cellCol: number
    ) => {
        setGrid((prevGrid) =>
            prevGrid.map((col, colIndex) =>
                col.map((oldCellValue, cellIndex) => {
                    if (colIndex === cellCol && cellIndex === cellRow) {
                        return newCellValue;
                    }
                    return oldCellValue;
                })
            )
        );
    };

    return (
        <div>
            <h3>Sudoku Solver</h3>
            <SudokuGrid grid={grid} onCellChange={changeCellValue} />
        </div>
    );
};

export default SudokuGame;
