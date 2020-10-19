import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const textArea = document.getElementById('text-input');
const localeSelect = document.getElementById('locale-select');
const translateButton = document.getElementById('translate-btn');
const clearButton = document.getElementById('clear-btn');
const translatedDiv = document.getElementById('translated-sentence');
const errorDiv = document.getElementById('error-msg');

translateButton.onclick = () => {
  if (textArea.value.length == 0) {
    errorDiv.innerHTML = "Error: No text to translate.";
    translatedDiv.innerHTML = "";
  } else {
    var output = translate(textArea.value, localeSelect.value);
    errorDiv.innerHTML = "";
    translatedDiv.innerHTML = visualOutput(output);
  }
};

clearButton.onclick = () => {
  errorDiv.innerHTML = '';
  translatedDiv.innerHTML = "";
  textArea.value = '';
};

var britishToAmericanSpelling = {};
Object.keys(americanToBritishSpelling).forEach((key, index) => britishToAmericanSpelling[americanToBritishSpelling[key]] = key);
var britishToAmericanTitles = {};
Object.keys(americanToBritishTitles).forEach((key, index) => britishToAmericanTitles[americanToBritishTitles[key]] = key);

var matchCase = (original, replacement) => {
  if (original.substring(0, 1) == original.substring(0, 1).toUpperCase()) {
    return replacement.substring(0, 1).toUpperCase() + replacement.substring(1, replacement.length);
  }
  return replacement;
};

var aToBTime = (time) => {
  return time.substring(time.length == 5 ? time.length - 5 : time.length - 4, time.length - 3) + '.' + time.substring(time.length - 2, time.length);
};
var bToaTime = (time) => {
  return time.substring(time.length == 5 ? time.length - 5 : time.length - 4, time.length - 3) + ':' + time.substring(time.length - 2, time.length);
};

var translate = (input, locale) => {
  var lookups = locale == "american-to-british" ?
    [ americanOnly, americanToBritishSpelling, americanToBritishTitles ] :
    [ britishOnly, britishToAmericanSpelling, britishToAmericanTitles ];
  var timeRegex = locale == "american-to-british" ?
    [ /^\d{1,2}:\d{2}$/, aToBTime ] :
    [ /^\d{1,2}\.\d{2}$/, bToaTime ];
  var output = [];

  var possibilities = [];
  var start = 0;
  var end = start + 1;
  do {
    var current = input.substring(start, end);

    // If current 'word' is a time, convert it then continue from 'after'
    if (current.match(timeRegex[0])) {
      output.push([ current, timeRegex[1](current) ]);
      start += current.length;
      end = start + 1;
      continue;
    }


    for (var lookupIndex in lookups) {
      // If current 'word' exists in a lookup, it could be a possibility
      // Possibilities must end with a space or .
      if (lookups[lookupIndex].hasOwnProperty(current.toLowerCase()) &&
        (input.substring(end, end + 1) == " " || input.substring(end, end + 1) == ".")) {
        possibilities.push([ current, matchCase(current, lookups[lookupIndex][current.toLowerCase()]) ]);
        break;
      }
    }

    if (end == input.length) {
      if (possibilities.length > 0) {
        // Take the longest possibility
        output.push([ possibilities[possibilities.length - 1][0], possibilities[possibilities.length - 1][1] ]);
        start += possibilities[possibilities.length - 1][0].length;
        end = start + 1;
        possibilities = [];
      } else {
        // No possibilities exist, keep first character and continue search one character further
        output.push(input.substring(start, start + 1));
        start++;
        end = start + 1;
      }
    } else {
      // Keep looking for longer words
      end++;
    }

  } while (start < input.length);
  return output;
};

var flatten = (output) => {
  return output.reduce((sum, current) => {
    sum += Array.isArray(current) ? current[1] : current;
    return sum;
  }, '');
};

var visualOutput = (output) => {
  var visualOutput = output.reduce((sum, current) => {
    sum += Array.isArray(current) ? '<span class="highlight">' + current[1] + '</span>' : current;
    return sum;
  }, '');
  if (visualOutput.indexOf('<span class="highlight">') == -1) {
    return "Everything looks good to me!";
  }
  return visualOutput;
}

/*
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translate,
    flatten
  }
} catch (e) {}

