/**
 * Transposes the given text from the current key up/down the given number of
 * semitones.
 */
function transposeSemitones(text, currentKey, semitones) {
  return transpose(text, currentKey, semitoneMapper(semitones), chordSpanFormatter);
}

/**
 * Transposes the given text from the current key to a new key.
 */
function transposeToKey(text, currentKey, newKey) {
  return transpose(text, currentKey, 
    function(currentKey) {
      return newKey;
    },
    chordSpanFormatter
  );
}

/**
 * Returns a function that when given a key, will return the key the given
 * number of semitones higher/lower.
 */
function semitoneMapper(semitones) {
  return function(currentKey) {
    return transposeKey(currentKey, semitones);
  };
}

/**
 * Transposes text into another key which is given by the mapper function.
 *
 * The mapper function is a function that takes a key signature and gives the
 * target key signature to be transposed into.
 * If currentKey is given as null, we take the first chord encountered to be the
 * currentKey then pass it into mapper to get the target key.
 */
function transpose(text, currentKey, mapper, formatter) { 
  // If empty string don't do anything.
  if (!text) {
    return;
  }

  // split the text by parts
  var tokens = text.split(/(\s+)/g);

  // initialize the variables
  var newText = "", rawText = "", newKey;
  var colour, symbol, chord, suffix, bass;
  var curColour = 0;
  var parts;
  var transposition = {};
  var map;

  if (currentKey) {
    newKey = mapper(currentKey);
    map = transpositionMap(currentKey, newKey);
  }

  // iterate tokens
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] in transposition) {
      newText += formatter(transposition[tokens[i]]["symbol"], transposition[tokens[i]]["colour"]);
      rawText += transposition[tokens[i]]["symbol"];
    // if symbol is chord, transpose it
    } else if(chordPattern.test(tokens[i])) {
      parts = XRegExp.exec(tokens[i], chordPattern);
      // If current key is unknown, set the first seen chord to the current key
      if (!currentKey) {
        currentKey = parts.chord;
        newKey = mapper(currentKey);
        map = transpositionMap(currentKey, newKey);
      }

      try {
        chord = map[parts.chord];
        suffix = (parts.suffix === undefined) ? "" : parts.suffix;
        bass = (parts.bass === undefined) ? "" : map[parts.bass];
      } catch(err) {
        alert(err);
        return;
      }
      if (bass) {
        symbol = chord + suffix + "/" + bass;
      } else {
        symbol = chord + suffix;
      }
      colour = colours[(curColour++) % colours.length];

      newText += formatter(symbol, colour);
      rawText += symbol;

      transposition[tokens[i]] = {};
      transposition[tokens[i]]["symbol"] = symbol; 
      transposition[tokens[i]]["colour"] = colour;
    // if symbol is not chord, just add it
    } else {
      newText += tokens[i];
      rawText += tokens[i];
    }
  }

  return newText;
}

/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function transpositionMap(currentKey, newKey) {
  var map = {};
  // Get the number of semitones.
  semitones = keys[newKey]["index"] - keys[currentKey]["index"];

  // Find out whether new key is sharp of flat.
  if (keys[newKey]["flats"] > 0) {
    scale = flats;
  } else {
    scale = sharps;
  }

  for (var i = 0; i < N_KEYS; i++) {
    map[flats[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
    map[sharps[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
  }
  return map;
}

/**
 * Finds the key that is a specified number of semitones above/below the current key.
 */
function transposeKey(currentKey, semitones) {
  if(!(currentKey in keys)) {
    throw currentKey + " is not a valid key signature!";
  }
  var newInd = (keys[currentKey]["index"] + semitones + N_KEYS) % N_KEYS;
  for(var k in keys) {
    if(keys[k]["index"] == newInd) {
      return k;
    }
  }
  return null;
}

/**
 * A formatter that given a chord, text and its desired colour, returns the
 * chord formatted as a coloured span.
 */
function chordSpanFormatter(text, colour) {
  return "<span class='chord' style='color: #" + colour + "'>" + text + "</span>";
}

// Chord data.
var flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];
var sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var keys = {
  "C": { index: 0, sharps: 0, flats: 0, },
  "Db": { index: 1, sharps: 0, flats: 5, },
  "D": { index: 2, sharps: 2, flats: 0, },
  "Eb": { index: 3, sharps: 0, flats: 3, },
  "E": { index: 4, sharps: 4, flats: 0, },
  "F": { index: 5, sharps: 0, flats: 1, },
  "F#": { index: 6, sharps: 6, flats: 0, },
  "G": { index: 7, sharps: 1, flats: 0, },
  "Ab": { index: 8, sharps: 0, flats: 4, },
  "A": { index: 9, sharps: 3, flats: 0, },
  "Bb": { index: 10, sharps: 0, flats: 2, },
  "B": { index: 11, sharps: 5, flats: 0,},
};
var N_KEYS = 12;

// Regex for recognizing chords
var chordPattern = XRegExp('^(?<chord>[A-G](#|b)?)(?<suffix>(\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-|add)?\\d*\\)?)*)(\\/(?<bass>[A-G](#|b)?))?$');
var colours = themes[0].colours;
