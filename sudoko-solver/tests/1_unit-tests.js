/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);
    return JSDOM.fromFile('./views/index.html',{
      virtualConsole
    })
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Solver = require('../public/sudoku-solver.js');
      });
  });

  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function validateInput()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      var output = Solver.validateInput(input);
      assert.equal(output.length, input.length, 'Output array should have same length as input');
      for (var i = 0; i < input.length; i++) {
        assert.equal(output[i], input[i], 'Output [' + i + ']');
      }
      done();
    });

    // Invalid characters or numbers are not accepted
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      const expected = ['.', '.', '.', '.', '.', '0', '10', 0, '.'];
      var output = Solver.validateInput(input);
      assert.equal(output.length, expected.length, 'Output array should have same length as expected');
      for (var i = 0; i < expected.length; i++) {
        assert.equal(output[i], expected[i], 'Output [' + i + ']');
      }
      done();
    });
  });

  suite('Function loadPuzzleAsArray()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const expectedOutput =
      [[ '.','.','9','.','.','5','.','1','.' ],
       [ '8','5','.','4','.','.','.','.','2' ],
       [ '4','3','2','.','.','.','.','.','.' ],
       [ '1','.','.','.','6','9','.','8','3' ],
       [ '.','9','.','.','.','.','.','6','.' ],
       [ '6','2','.','7','1','.','.','.','9' ],
       [ '.','.','.','.','.','.','1','9','4' ],
       [ '5','.','.','.','.','4','.','3','7' ],
       [ '.','4','.','3','.','.','6','.','.' ]
      ];
      var expectedOutputKeys = Object.keys(expectedOutput);
      var output = Solver.loadPuzzleAsArray(input);
      assert.equal(output.length, expectedOutput.length, 'Number of rows in should be the same');
      for (var i = 0; i < expectedOutput.length; i++) {
        assert.equal(output[i].length, expectedOutput[i].length, 'Number of columns in row ' + i + ' should be the same');
        for (var j = 0; j < expectedOutput[i].length; j++) {
          if (expectedOutput[i][j] == '.') {
            assert.isTrue(Array.isArray(output[i][j]), 'Blank inputs should be given possibilities');
          } else {
            assert.equal(output[i][j], expectedOutput[i][j], 'Cell [' + i + ',' + j + '] should be the same');
          }
        }
      }
      done();
    });

    // Puzzles that are not 81 numbers/periods long show the message
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');

      // Test short puzzle
      Solver.loadPuzzleAsArray(shortStr);
      assert.equal(errorDiv.innerHTML, errorMsg, 'Puzzle is too short, error should be displayed');

      // Reset error and test long puzzle
      errorDiv.innerHTML = '';
      Solver.loadPuzzleAsArray(longStr);
      assert.equal(errorDiv.innerHTML, errorMsg, 'Puzzle is too long, error should be displayed');
      done();
    });
  });

  suite('Function validatePass()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.equal(true, Solver.validatePass(input));
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.equal(false, Solver.validatePass(input));
      done();
    });
  });


  suite('Function solve()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input =
      [[ '.','.','9','.','.','5','.','1','.' ],
       [ '8','5','.','4','.','.','.','.','2' ],
       [ '4','3','2','.','.','.','.','.','.' ],
       [ '1','.','.','.','6','9','.','8','3' ],
       [ '.','9','.','.','.','.','.','6','.' ],
       [ '6','2','.','7','1','.','.','.','9' ],
       [ '.','.','.','.','.','.','1','9','4' ],
       [ '5','.','.','.','.','4','.','3','7' ],
       [ '.','4','.','3','.','.','6','.','.' ]
      ];
      const expected =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      var output = Solver.solve(input);
      assert.equal(output.length, expected.length);
      for (var i = 0; i < expected.length; i++) {
        assert.equal(output[i].length, expected[i].length);
        for (var j = 0; j < expected[i].length; j++) {
          assert.equal(output[i][j], output[i][j]);
        }
      }
      done();
    });
  });

  suite('Helper Functions', () => {

    test('Row for', done => {
      const input =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      var expectedRow = [ '7','6','9','2','3','5','4','1','8' ];
      var row = Solver.rowFor(input, 0, 0);
      assert.equal(row.length, expectedRow.length);
      for (var i = 0; i < expectedRow.length; i++) {
        assert.equal(row[i], expectedRow[i]);
      }
      done();
    });

    test('Column for', done => {
      const input =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      var expectedColumn = [ '6','5','3','7','9','2','8','1','4' ];
      var column = Solver.columnFor(input, 1, 1);
      assert.equal(column.length, expectedColumn.length);
      for (var i = 0; i < expectedColumn.length; i++) {
        assert.equal(column[i], expectedColumn[i]);
      }
      done();
    });

    test('Subgrid for', done => {
      const input =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      var expectedSubgrid = [ '5','6','9','8','4','2','7','1','3' ];
      var subgrid = Solver.subgridFor(input, 4, 4);
      assert.equal(subgrid.length, expectedSubgrid.length);
      for (var i = 0; i < expectedSubgrid.length; i++) {
        assert.equal(subgrid[i], expectedSubgrid[i]);
      }
      done();
    });

    test('Find possibilities', done => {
      const input =
      [[ '.','.','9','2','3','5','4','1','8' ],
       [ '.','.','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','.','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','.' ],
       [ '3','9','5','.','.','2','.','6','1' ],
       [ '.','2','8','.','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','.','.','1','6','2','.' ]
      ];
      /*
      const input =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      */
      var expectedPossibilitiesForR0C0 = ['6', '7'];
      var expectedPossibilitiesForR4C4 = ['4', '7', '8'];
      var expectedPossibilitiesForR8C8 = ['5'];
      var possibilitiesForR0C0 = Solver.findPossibilities(input, 0, 0);
      var possibilitiesForR4C4 = Solver.findPossibilities(input, 4, 4);
      var possibilitiesForR8C8 = Solver.findPossibilities(input, 8, 8);
      assert.equal(possibilitiesForR0C0.length, expectedPossibilitiesForR0C0.length);
      for (var i = 0; i < expectedPossibilitiesForR0C0.length; i++) {
        assert.equal(possibilitiesForR0C0[i], expectedPossibilitiesForR0C0[i]);
      }
      assert.equal(possibilitiesForR4C4.length, expectedPossibilitiesForR4C4.length);
      for (var i = 0; i < expectedPossibilitiesForR4C4.length; i++) {
        assert.equal(possibilitiesForR4C4[i], expectedPossibilitiesForR4C4[i]);
      }
      assert.equal(possibilitiesForR8C8.length, expectedPossibilitiesForR8C8.length);
      for (var i = 0; i < expectedPossibilitiesForR8C8.length; i++) {
        assert.equal(possibilitiesForR8C8[i], expectedPossibilitiesForR8C8[i]);
      }
      done();
    });

    test('Flatten Puzzle Grid', done => {
      const input =
      [[ '7','6','9','2','3','5','4','1','8' ],
       [ '8','5','1','4','9','6','3','7','2' ],
       [ '4','3','2','1','7','8','9','5','6' ],
       [ '1','7','4','5','6','9','2','8','3' ],
       [ '3','9','5','8','4','2','7','6','1' ],
       [ '6','2','8','7','1','3','5','4','9' ],
       [ '2','8','3','6','5','7','1','9','4' ],
       [ '5','1','6','9','2','4','8','3','7' ],
       [ '9','4','7','3','8','1','6','2','5' ]
      ];
      var expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      var output = Solver.flattenPuzzleArray(input);
      assert.equal(output, expected);
      done();
    });

  })

});

