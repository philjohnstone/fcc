/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
  });

  suite('Function visualOutput()', () => {
    /*
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are my favorite fruit.';
      const output = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
      const textArea = document.getElementById('text-input');
      textArea.value = input;
      const translateButton = document.getElementById('translate-btn');
      translateButton.click();
      const translatedDiv = document.getElementById('translated-sentence');
      assert.equal(translatedDiv.innerHTML, output, 'Translated sentence');
      const errorDiv = document.getElementById('error-msg');
      assert.equal(errorDiv.innerHTML, "", 'No errors');
      done();
    });

    /*
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are my favourite fruit.';
      const output = 'Everything looks good to me!';
      const textArea = document.getElementById('text-input');
      textArea.value = input;
      const translateButton = document.getElementById('translate-btn');
      translateButton.click();
      const translatedDiv = document.getElementById('translated-sentence');
      assert.equal(translatedDiv.innerHTML, output, 'Translated sentence');
      done();
    });

    /*
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const input = '';
      const output = 'Error: No text to translate.';
      const textArea = document.getElementById('text-input');
      textArea.value = input;
      const translateButton = document.getElementById('translate-btn');
      translateButton.click();
      const errorDiv = document.getElementById('error-msg');
      assert.equal(errorDiv.innerHTML, output, 'Translated sentence');
      const translatedDiv = document.getElementById('translated-sentence');
      assert.equal(translatedDiv.innerHTML, "", 'Nothing is translated');
      done();
    });

  });

  suite('Function ____()', () => {
    /*
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const textArea = document.getElementById('text-input');
      const translateButton = document.getElementById('translate-btn');
      const errorDiv = document.getElementById('error-msg');
      const clearButton = document.getElementById('clear-btn');
      const translatedDiv = document.getElementById('translated-sentence');

      var input = '';
      var output = 'Error: No text to translate.';
      textArea.value = input;
      translateButton.click();
      assert.equal(errorDiv.innerHTML, output, 'Error message');

      clearButton.click();
      assert.equal(errorDiv.innerHTML, "", 'Error message has been cleared');

      input = 'Mangoes are my favorite fruit.';
      output = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
      textArea.value = input;
      translateButton.click();
      assert.equal(translatedDiv.innerHTML, output, 'Translated sentence');

      clearButton.click();
      assert.equal(translatedDiv.innerHTML, "", 'Translated message has been cleared');
      assert.equal(textArea.value, "", 'Translated message has been cleared');

      done();
    });

  });

});

