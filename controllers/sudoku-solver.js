class Solver {
  static convertToGrid(puzzleString, divider = 9) {
    let grid = [];

    for (let i = 0; i < puzzleString.length; i += divider) {
      for (let j = 0; j < divider; j++) {
        grid.push(puzzleString.slice(i, i + divider).split(""));
        break;
      }
    }

    return grid;
  }

  static isValidPuzzleString(puzzleString) {
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }

    let regexSudoku = /[^1-9\.]/;
    let validationResult = regexSudoku.exec(puzzleString);

    if (validationResult) {
      return "Invalid characters in puzzle";
    }
    return true;
  }

  static argumentValidator(row, col, value) {
    let rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    const pattern = /^[1-9]$/;
    if (!pattern.exec(value)) {
      return "Invalid value";
    }

    if (!rowNames.includes(row)) {
      return "Invalid coordinate";
    }

    if (!pattern.exec(col)) {
      return "Invalid coordinate";
    }
    return true;
  }

  constructor(grid = []) {
    this.orginalGrid = grid;

    this.solved = false;
    this.grid = this.copyFromOriginalGrid();
  }

  copyFromOriginalGrid() {
    return Solver.convertToGrid(this.orginalGrid.flat().join(""));
  }

  getOriginalGrid() {
    return this.orginalGrid;
  }

  getGrid() {
    return this.grid;
  }

  isValid(row, col, k) {
    this.isValidResult = {};
    let conflictRow = false;
    let conflictCol = false;
    let conflictGrid = false;

    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);

      conflictRow = this.grid[row][i] == k && col != i;
      conflictCol = this.grid[i][col] == k && row != i;
      conflictGrid = this.grid[m][n] == k && col != i && row != i;

      if (conflictRow || conflictCol || conflictGrid) {
        return false;
      }
    }
    return true;
  }

  solve() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] == ".") {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(i, j, k)) {
              this.grid[i][j] = `${k}`;
              if (this.solve(this.grid)) {
                return true;
              } else {
                this.grid[i][j] = ".";
              }
            }
          }
          return false;
        }
      }
    }

    this.solved = true;
    return true;
  }

  getSolvedPuzzleString(refresh = false) {
    if (refresh) {
      this.solved = false;
      this.grid = this.copyFromOriginalGrid();
      this.isValidResult = {};
    }

    if (this.solved) {
      return this.grid.flat().join("");
    }

    if (this.solve()) {
      return this.getSolvedPuzzleString();
    }

    return "Something Error";
  }

  isRightValueViaCoordinate(rowName, col, value) {
    const rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let row = rowNames.indexOf(rowName);
    return this.isRightValue(row, col - 1, value);
  }

  isRightValue(row, col, value) {
    if (!this.solved) {
      this.solve();
    }

    this.isValidResult = {};
    let conflictRow = false;
    let conflictCol = false;
    let conflictGrid = false;

    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] == value && col != i) {
        conflictRow = true;
        break;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (this.grid[i][col] == value && row != i) {
        conflictCol = true;
        break;
      }
    }


    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);

      if (this.grid[m][n] == value && m != row && n != col - 1) {
        conflictGrid = true;
        break;
      }
    }

    if (conflictRow || conflictCol || conflictGrid) {
      this.isValidResult = {
        conflictRow: conflictRow,
        conflictCol: conflictCol,
        conflictGrid: conflictGrid,
      };
      return false;
    }

    return true;
  }
}

module.exports = Solver;
