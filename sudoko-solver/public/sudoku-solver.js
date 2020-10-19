const clearButton = document.getElementById('clear-button');
const errorMsg = document.getElementById('error-msg');
const solveButton = document.getElementById('solve-button');
const textArea = document.getElementById('text-input');

// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  loadPuzzleToGrid(loadPuzzleAsArray(textArea.value));
});

var gridToTextInput = (event) => {
  var puzzleArray = loadGridToPuzzleArray();
  textArea.value = flattenPuzzleArray(puzzleArray);
};

for (var row = 0; row < 9; row++) {
  for (var column = 1; column <= 9; column++) {
    var key = String.fromCharCode(65 + row) + (column);
    var cell = document.getElementById(key);
    cell.addEventListener('change', gridToTextInput);
  }
}

clearButton.onclick = () => {
  textArea.value = '.................................................................................';
  loadPuzzleToGrid(loadPuzzleAsArray(textArea.value));
};

solveButton.onclick = () => {
  var puzzleArray = loadGridToPuzzleArray();
  puzzleArray = solve(puzzleArray);
  loadPuzzleToGrid(puzzleArray);
  textArea.value = flattenPuzzleArray(puzzleArray);
};

textArea.addEventListener('change', (event) => {
  loadPuzzleToGrid(loadPuzzleAsArray(textArea.value));
});

var solve = (puzzleArray) => {
  var possible = false;
  do {
    possible = false;
    for (var x = 0; x < puzzleArray.length; x++) {
      for (var y = 0; y < puzzleArray[x].length; y++) {
        if (Array.isArray(puzzleArray[x][y])) {
          if (puzzleArray[x][y].length == 1) {
            possible = true;
            puzzleArray[x][y] = puzzleArray[x][y][0];
            removeOldPossibilities(puzzleArray, x, y);
          }
        }
      }
    }
  } while (!validatePuzzleArrayPass(puzzleArray) && possible);
  return puzzleArray;
}

var removeOldPossibilities = (puzzleArray, cellRow, cellColumn) => {
  var newValue = puzzleArray[cellRow][cellColumn];
  // from row
  for (var x = 0; x < puzzleArray.length; x++) {
    if (x != cellRow && Array.isArray(puzzleArray[x][cellColumn])) {
      var index = puzzleArray[x][cellColumn].indexOf(newValue);
      if (index > -1) {
        puzzleArray[x][cellColumn].splice(index, 1);
      }
    }
  }

  // from column
  for (var y = 0; y < puzzleArray[cellRow].length; y++) {
    if (y != cellColumn && Array.isArray(puzzleArray[cellRow,y])) {
      var index = puzzleArray[cellRow][y].indexOf(newValue);
      if (index > -1) {
        puzzleArray[cellRow][y].splice(index, 1);
      }
    }
  }

  // from subgrid
  var top = cellColumn >= 6 ? 6 : cellColumn >= 3 ? 3 : 0;
  var left = cellRow >= 6 ? 6 : cellRow >= 3 ? 3 : 0;
  for (var x = left; x < left + 3; x++) {
    for (var y = top; y < top + 3; y++) {
      if (x != cellRow && y != cellColumn && Array.isArray(puzzleArray[x][y])) {
        var index = puzzleArray[x][y].indexOf(newValue);
        if (index > -1) {
          puzzleArray[x][y].splice(index, 1);
        }
      }
    }
  }

};

var loadPuzzleToGrid = (loadedPuzzle) => {
  for (var row = 0; row < loadedPuzzle.length; row++) {
    for (var column = 0; column < loadedPuzzle[row].length; column++) {
      var key = String.fromCharCode(65 + row) + (column + 1);
      if (Array.isArray(loadedPuzzle[row][column])) {
        document.getElementById(key).value = '';
        document.getElementById(key).title = loadedPuzzle[row][column];
      } else {
        document.getElementById(key).title = '';
        document.getElementById(key).value = loadedPuzzle[row][column];
      }
    }
  }
};

var loadGridToPuzzleArray = () => {
  var loadedPuzzle = '';
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      var key = String.fromCharCode(65 + row) + (column + 1);
      if (document.getElementById(key).value == '') {
        loadedPuzzle += '.';
      } else {
        loadedPuzzle += document.getElementById(key).value;
      }
    }
  }
  return loadPuzzleAsArray(loadedPuzzle);
}

var validateInput = (arr) => {
  return arr.map((e) => {
    var parsedE = parseInt(e);
    if (isNaN(parsedE)) return '.';
    return parsedE.toString();
  });
};

var loadPuzzleAsArray = (puzzle) => {
  if (puzzle.length != 81) {
    errorMsg.innerHTML = 'Error: Expected puzzle to be 81 characters long.';
    return;
  } else {
    errorMsg.innerHTML = '';
  }
  var row = [];
  var loadedPuzzle = [];
  for (var i = 0; i < puzzle.length; i++) {
    row.push(puzzle[i]);
    if (row.length == 9) {
      loadedPuzzle.push(row);
      row = [];
    }
  }
  for (var x = 0; x < loadedPuzzle.length; x++) {
    for (var y = 0; y < loadedPuzzle[x].length; y++) {
      if (loadedPuzzle[x][y] == '.') {
        loadedPuzzle[x][y] = findPossibilities(loadedPuzzle, x, y);
      }
    }
  }
  return loadedPuzzle;
};

var findPossibilities = (puzzleArray, cellRow, cellColumn) => {
  var possibilities = [];

  var row = rowFor(puzzleArray, cellRow, cellColumn);
  var column = columnFor(puzzleArray, cellRow, cellColumn);
  var subgrid = subgridFor(puzzleArray, cellRow, cellColumn);

  for (var i = 1; i <= 9; i++) {
    if (row.indexOf(i.toString()) == -1 &&
        column.indexOf(i.toString()) == -1 &&
        subgrid.indexOf(i.toString()) == -1) {
      possibilities.push(i.toString());
    }
  }
  return possibilities;
};

var rowFor = (puzzleArray, cellRow, cellColumn) => {
  return puzzleArray[cellRow];
};

var columnFor = (puzzleArray, cellRow, cellColumn) => {
  var column = [];
  for (var i = 0; i < puzzleArray.length; i++) {
    column.push(puzzleArray[i][cellColumn]);
  }
  return column;
};

var subgridFor = (puzzleArray, cellRow, cellColumn) => {
  var subgrid = [];
  var top = cellColumn >= 6 ? 6 : cellColumn >= 3 ? 3 : 0;
  var left = cellRow >= 6 ? 6 : cellRow >= 3 ? 3 : 0;
  for (var x = left; x < left + 3; x++) {
    for (var y = top; y < top + 3; y++) {
      subgrid.push(puzzleArray[x][y]);
    }
  }
  return subgrid;
};

var validateGroup = (group) => {
  var groupSet = new Set(group);
  if (groupSet.size != 9 || groupSet.has('.') || group.filter((e) => Array.isArray(e)).length > 0) {
    return false;
  }
  return true;
};

var validatePass = (arr) => {
  var puzzleArray = loadPuzzleAsArray(arr);
  return validatePuzzleArrayPass(puzzleArray);
};

var validatePuzzleArrayPass = (puzzleArray) => {
  for (var i = 0; i < 9; i++) {
    if (!validateGroup(rowFor(puzzleArray, i, 0)) ||
        !validateGroup(columnFor(puzzleArray, 0, i))) {
      return false;
    }
  }
  for (var x = 0; x <= 6; x += 3) {
    for (var y = 0; y <= 6; y += 3) {
      if (!validateGroup(subgridFor(puzzleArray, x, y))) {
        return false;
      }
    }
  }
  return true;
};

var flattenPuzzleArray = (puzzleArray) => {
  var flattened = '';
  for (var x = 0; x < puzzleArray.length; x++) {
    for (var y = 0; y < puzzleArray[x].length; y++) {
      flattened += Array.isArray(puzzleArray[x][y]) ? '.' : puzzleArray[x][y];
    }
  }
  return flattened;
}

/*
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    validateInput,
    loadPuzzleAsArray,
    validatePass,
    findPossibilities,
    rowFor,
    columnFor,
    subgridFor,
    flattenPuzzleArray,
    solve
  }
} catch (e) {}

