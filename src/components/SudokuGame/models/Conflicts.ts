type ConflictArray = number[][];

export interface Conflicts {
    rows: ConflictArray;
    cols: ConflictArray;
    regions: ConflictArray;
    cells: ConflictArray;
}

export const getConflictsArray = (): ConflictArray => {
    return [...Array(9)].map((_) => []);
};

export const getConflictsObject = (): Conflicts => ({
    rows: getConflictsArray(),
    cols: getConflictsArray(),
    regions: getConflictsArray(),
    cells: getConflictsArray(),
});
