/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

var emitEvent = (eventName, recipient) => {
  var event = document.createEvent("Event")
  event.initEvent(eventName, true, true)
  recipient.dispatchEvent(event)
};

suite('Functional Tests', () => {

  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    Solver = require('../public/sudoku-solver.js');
    emitEvent("DOMContentLoaded", window.document);
  });

  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
        const textArea = document.getElementById('text-input');
        assert.equal(textArea.value, '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'Initially loaded puzzle');
        const a1Cell = document.getElementById('A1');
        assert.equal(a1Cell.value, '', 'A1 should be blank');

        textArea.value = '7.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        emitEvent("change", textArea);

        assert.equal(a1Cell.value, '7', 'A1 value should change');
        done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
        const a2Cell = document.getElementById('A2');
        assert.equal(a2Cell.value, '', 'A2 should be blank');
        const textArea = document.getElementById('text-input');
        assert.equal(textArea.value.split('')[1], '.', 'Initially loaded puzzle, second character');

        a2Cell.value = '6';
        emitEvent("change", a2Cell);

        assert.equal(textArea.value.split('')[1], '6', 'Initially loaded puzzle, second character');
      done();
    });
  });

  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku
    // grid and the text area
    test('Function clearInput()', done => {
        const textArea = document.getElementById('text-input');
        assert.equal(textArea.value.split('')[2], '9', 'Initially loaded puzzle, third character');
        const a3Cell = document.getElementById('A3');
        assert.equal(a3Cell.value, '9', 'A3 should be 9');
        const clearButton = document.getElementById('clear-button');

        clearButton.click();
        assert.equal(textArea.value, '.................................................................................', 'Loaded puzzle should be blank');
        assert.equal(a3Cell.value, '', 'A3 should be blank');

      done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      const textArea = document.getElementById('text-input');
      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      emitEvent("change", textArea);

      const solveButton = document.getElementById('solve-button');
      solveButton.click();

      const a1Cell = document.getElementById('A1');
      assert.equal(a1Cell.value, '7', 'A1 should be 7');
      done();
    });
  });
});

