/**
 * Transposes the given text from the current key up/down the given number of
 * semitones.
 *
 * formatter is a function which takes (text, colourId) and is applied to each
 * chord. See chordSpanFormatter.
 */
function transposeSemitones(text, currentKey, semitones, formatter) {
  if (formatter === undefined) {
    formatter = defaultFormatter;
  }
  return transpose(text, currentKey, semitoneMapper(semitones), formatter);
}

/**
 * Transposes the given text from the current key to a new key.
 *
 * formatter is a function which takes (text, colourId) and is applied to each
 * chord. See chordSpanFormatter.
 */
function transposeToKey(text, currentKey, newKey, formatter) {
  if (formatter === undefined) {
    formatter = defaultFormatter;
  }

  return transpose(text, currentKey,
    function(currentKey) {
      return newKey;
    },
    formatter);
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
 * currentKey then pass it into mapper to get the target key. The mapper
 * function is needed because of the possibility of the current key being
 * unknown so we defer the process of finding the new key signature.
 */
function transpose(text, currentKey, mapper, formatter) {
  // initialize the variables.
  var newText = "",
    newKey, curColour = 0,
    parts, table = {},
    map;

  /**
   * Transposes the token given its parts.
   */
  function transposeToken(parts) {
    try {
      chord = map[parts.chord];
      suffix = (parts.suffix === undefined) ? "" : parts.suffix;
      bass = (parts.bass === undefined) ? "" : map[parts.bass];
    } catch (err) {
      alert(err);
      return "";
    }
    if (bass) {
      symbol = chord + suffix + "/" + bass;
    } else {
      symbol = chord + suffix;
    }
    return symbol;
  }

  /**
   * Saves the given symbol in the table.
   */
  function cacheSymbol(symbol, colourId) {
    table[tokens[i]] = {};
    table[tokens[i]]["symbol"] = symbol;
    table[tokens[i]]["colour"] = colourId;
  }

  // Split the text by parts.
  var lines = text.split("\n");

  // If current key is known, generate map.
  if (currentKey) {
    newKey = mapper(currentKey);
    map = transpositionMap(currentKey, newKey);
  }

  // Iterate lines.
  for (k = 0; k < lines.length; k++) {
    var newLine = "",
      chordCount = 0,
      tokenCount = 0;
    var tokens = lines[k].split(/(\s+)/g);

    for (var i = 0; i < tokens.length; i++) {
      // Check for all whitespace.
      if ($.trim(tokens[i]) === '') {
        newLine += tokens[i];
      } else if (tokens[i] in table) {
        newLine += formatter(table[tokens[i]]["symbol"], table[tokens[i]]["colour"]);
        chordCount++;
        // If symbol is chord, transpose it.
      } else if (chordPattern.test(tokens[i])) {
        parts = XRegExp.exec(tokens[i], chordPattern);
        // If current key is unknown, set the first seen chord to the current key.
        if (!currentKey) {
          // If the first chord is minor, find its major equivalent.
          if (parts.suffix == 'm' || parts.suffix == 'min') {
            currentKey = minors[parts.chord];
          } else {
            currentKey = parts.chord;
          }
          newKey = mapper(currentKey);
          map = transpositionMap(currentKey, newKey);
        }
        var symbol = transposeToken(parts);
        cacheSymbol(symbol, curColour);
        newLine += formatter(symbol, curColour);
        curColour++;
        chordCount++;
        // If symbol is not chord, just add it.
      } else {
        newLine += tokens[i];
        tokenCount++;
      }
    }
    if (chordCount > tokenCount / 2) {
      newText += newLine;
    } else {
      newText += lines[k];
    }
    newText += "\n";
  }
  return [newText, newKey, semitonesBetween(currentKey, newKey)];
}

/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function transpositionMap(currentKey, newKey) {
  var map = {};
  // Get the number of semitones.
  semitones = semitonesBetween(currentKey, newKey);

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

function semitonesBetween(a, b) {
  if (!(a in keys)) {
    throw a + " is not a valid key signature!";
  }
  if (!(b in keys)) {
    throw b + " is not a valid key signature!";
  }
  return keys[b]["index"] - keys[a]["index"];
}

/**
 * Finds the key that is a specified number of semitones above/below the current key.
 */
function transposeKey(currentKey, semitones) {
  if (!(currentKey in keys)) {
    throw currentKey + " is not a valid key signature!";
  }
  var newInd = (keys[currentKey]["index"] + semitones + N_KEYS) % N_KEYS;
  for (var k in keys) {
    if (keys[k]["index"] == newInd) {
      return k;
    }
  }
  return null;
}

/**
 * A formatter that given a chord, text and its desired colour, returns the
 * chord formatted as a coloured span.
 */
function chordSpanFormatter(text, colourId) {
  colour = colours[(colourId) % colours.length];
  return "<span class='chord' style='color: #" + colour + "'>" + text + "</span>";
}

function defaultFormatter(text, colourId) {
  return text;
}

// List of chords using flats.
var flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];

// List of chords using sharps.
var sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// List of key signatures and some data about each.
var keys = {
  "C": {
    index: 0,
    sharps: 0,
    flats: 0
  },
  "Db": {
    index: 1,
    sharps: 0,
    flats: 5
  },
  "D": {
    index: 2,
    sharps: 2,
    flats: 0
  },
  "Eb": {
    index: 3,
    sharps: 0,
    flats: 3
  },
  "E": {
    index: 4,
    sharps: 4,
    flats: 0
  },
  "F": {
    index: 5,
    sharps: 0,
    flats: 1
  },
  "F#": {
    index: 6,
    sharps: 6,
    flats: 0
  },
  "G": {
    index: 7,
    sharps: 1,
    flats: 0
  },
  "Ab": {
    index: 8,
    sharps: 0,
    flats: 4
  },
  "A": {
    index: 9,
    sharps: 3,
    flats: 0
  },
  "Bb": {
    index: 10,
    sharps: 0,
    flats: 2
  },
  "B": {
    index: 11,
    sharps: 5,
    flats: 0
  }
};

// Maps each minor key to its major equivalent.
var minors = {
  "C": "Eb",
  "Db": "F",
  "D": "F",
  "Eb": "Gb",
  "E": "G",
  "F": "Ab",
  "F#": "A",
  "G": "Bb",
  "Ab": "Cb",
  "A": "C",
  "Bb": "Db",
  "B": "D"
};

var N_KEYS = 12;

// Regex for recognizing chords
var chordPattern = XRegExp('^(?<chord>[A-G](#|b)?)(?<suffix>(\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-|add)?\\d*\\)?)*)(\\/(?<bass>[A-G](#|b)?))?$');
var colours = themes[0].colours;
