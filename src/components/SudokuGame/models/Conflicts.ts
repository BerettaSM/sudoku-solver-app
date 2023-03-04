export interface Conflicts {
    rows: number[];
    cols: number[];
    regions: number[][];
    cells: string[];
}

export const getConflictsObject = (): Conflicts => ({
    rows: [],
    cols: [],
    regions: [[], [], []],
    cells: [],
});
