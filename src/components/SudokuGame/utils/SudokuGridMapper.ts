class SudokuGridMapper {
    /*
        The logic that calculates cells rows, columns and regions
        assumes that a cell number is assigned first top to bottom,
        then left to right. e.g.: First column has cells 0-8, second
        column has cells 9-17, and so on.
    */

    static getCellColumn = (cellNumber: number) => {
        return cellNumber % 9;
    };

    static getCellRow = (cellNumber: number) => {
        return Math.floor(cellNumber / 9);
    };

    static getCellRowAndColumn = (cellNumber: number) => {
        /*
            id is assigned as "cell-01",
            we're interested on the number.
        */
        return [this.getCellRow(cellNumber), this.getCellColumn(cellNumber)];
    };

     /* 
        There are 9 regions, each with a row and column.
    
          0  1  2  regionCol
        0 x  x  x
        1 x  x  x
        2 x  x  x
        regionRow
    */

    static getCellRegionRow = (cellNumber: number) => {
        const cellRow = this.getCellRow(cellNumber);
        return Math.floor(cellRow / 3);
    };

    static getCellRegionColumn = (cellNumber: number) => {
        const cellCol = this.getCellColumn(cellNumber);
        return Math.floor(cellCol / 3);
    };

    static getCellRegion = (cellNumber: number) => {
        return {
            row: this.getCellRegionRow(cellNumber),
            col: this.getCellRegionColumn(cellNumber),
        };
    };

    static getCellInfo = (cellNumber: number) => {
        return {
            row: this.getCellRow(cellNumber),
            col: this.getCellColumn(cellNumber),
            region: this.getCellRegion(cellNumber),
        };
    };
}

export default SudokuGridMapper;
