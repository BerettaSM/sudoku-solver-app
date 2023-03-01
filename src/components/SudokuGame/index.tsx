import React, { useState } from "react";

import SudokuGrid from "./SudokuGrid";
import SudokuGridModel from "./models/SudokuGrid";
import SudokuCell from "./models/SudokuCell";

import SudokuGridMapper from "./utils/SudokuGridMapper";

const SudokuGame: React.FC = () => {
    const [grid, setGrid] = useState<SudokuGridModel>(
        Array(9).fill(Array(9).fill(""))
    );

    const changeCellValue = (newCellValue: SudokuCell, cellNumber: number) => {
        const [row, col] = SudokuGridMapper.getCellRowAndColumn(cellNumber);
        setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((row) => [...row]);
            updatedGrid[row][col] = newCellValue;
            return updatedGrid;
        });
    };

    return (
        <div>
            <h3>Sudoku Solver</h3>
            <SudokuGrid grid={grid} onCellChange={changeCellValue} />

            {/*
            <button>Clear</button><br/>
            <button>Generate</button><br/>
            <button>Solve puzzle</button><br/>
             */}
            {/* Game must be evaluated for conflicts after every input */}
        </div>
    );
};

export default SudokuGame;
