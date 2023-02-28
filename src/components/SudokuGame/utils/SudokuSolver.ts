class SudokuSolver {

    /*
        The logic that calculates cells rows, columns and regions
        assumes that a cell number is assigned first top to bottom,
        then left to right. e.g.: First column has cells 0-8, second
        column has cells 9-17, and so on.
    */

    getCellRow = (cellNumber: number) => {
        return cellNumber % 9;
    }

    getCellColumn = (cellNumber: number) => {
        return Math.floor(cellNumber / 9);
    }

    getCellRegion = (cellNumber: number) => {
        
    }

    getCellInfo = (cellNumber: number) => {
        if(cellNumber < 0 || cellNumber > 80) {
            throw new Error("Invalid cell number");
        }
        const rowNumber = this.getCellRow(cellNumber);
        const colNumber = this.getCellColumn(cellNumber);
        const regionNumber = this.getCellRegion(cellNumber);
    }    

}

export default SudokuSolver;