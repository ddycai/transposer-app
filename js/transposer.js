// Chord symbol data

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

/**
 * Transposes text from one key to another.
 */
function transpose(text, currentKey, newKey, semitones) { 

  // If empty string don't do anything
  if(!text) return;

  // split the text by parts
  var tokens = text.split(/(\s+)/g);

  // initialize the variables
  var newText = "", rawText = "";
  var colour, symbol, chord, suffix, bass;
  var curColour = 0;
  var parts;
  var transposition = {};

  // iterate tokens
  for(var i = 0; i < tokens.length; i++) {
    // if symbol is cached, output it
    if(tokens[i] in transposition) {
      newText += chordSpan(transposition[tokens[i]]["symbol"], transposition[tokens[i]]["colour"]);
      rawText += transposition[tokens[i]]["symbol"];
    // if symbol is chord, transpose it
    } else if(chordPattern.test(tokens[i])) {
      parts = XRegExp.exec(tokens[i], chordPattern);
      // If current key is unknown, set the first seen chord
      // to the current key
      if(!currentKey)
        currentKey = parts.chord;

      try {
        chord = transposeNote(parts.chord, currentKey, newKey, semitones);
        suffix = (parts.suffix === undefined) ? "" : parts.suffix;
        bass = (parts.bass === undefined) ? "" : transposeNote(parts.bass, currentKey, newKey, semitones);
      } catch(err) {
        alert(err);
        return;
      }
      if(bass) 
        symbol = chord + suffix + "/" + bass;
      else
        symbol = chord + suffix;
      colour = colours[(curColour++) % colours.length];

      newText += chordSpan(symbol, colour);
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

  if($("#replace-original").is(":checked")) {
    $('#chordarea').val(rawText);
    $('#current-key').val(newKey);
  }

  $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
}

/**
 * A semi-hack method that returns span HTML object with a certain
 * font colour.
 */
function chordSpan(text, colour) {
  return "<span class='chord' style='color: #" + colour + "'>" + text + "</span>";
}

/**
 * Transposes a single note from one key to another or
 * up a specified number of semitones.
 * If semitones is null, transposes to newKey.
 * If newKey is null, transposes up/down semitones.
 * If both are null, throws an error.
 */
function transposeNote(note, currentKey, newKey, semitones) {
  if(!(currentKey in keys)) {
    throw currentKey + " is not a valid key signature!";
  }

  if(newKey && !(newKey in keys)) {
    throw newKey + " is not a valid key signature!";
  }

  console.log(newKey);
  console.log(semitones);

  if(!newKey && semitones)
    newKey = transposeKey(currentKey, semitones);
  else if(newKey && !semitones)
    semitones = keys[newKey]["index"] - keys[currentKey]["index"];
  else
    throw "Either new key or number of semitones must be given."

  var noteInd = flats.indexOf(note);
  if(noteInd == -1) noteInd = sharps.indexOf(note);
  if(noteInd == -1) throw "Note (" + note + ") does not exist.";

  if(keys[newKey]["flats"] > 0) {
    return flats[(noteInd + flats.length + semitones) % flats.length];
  } else {
    return sharps[(noteInd + sharps.length + semitones) % sharps.length];
  }

}

/**
 * Finds the key that is a specified number of semitones 
 * above/below the current key.
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

$(document).ready(function() {  

  $('#print-button').click(function(){
    window.print();
  });

  $('#transpose-button').click(function(){
    var currentKey = $("#current-key").val();
    if(currentKey == "auto")
      currentKey = null;
    var newKey = $("#new-key").val();
    transpose($("#chordarea").val(), currentKey, newKey, null);
  });

  $('#transpose-up').click(function(){
    var currentKey = $("#current-key").val();
    if(currentKey == "auto")
      currentKey = null;
    var semitones = parseInt($("#semitones").val());
    transpose($("#chordarea").val(), currentKey, null, semitones);
  });

  $('#transpose-down').click(function(){ 
    var currentKey = $("#current-key").val();
    if(currentKey == "auto")
      currentKey = null;
    var semitones = -parseInt($("#semitones").val());
    transpose($("#chordarea").val(), currentKey, null, semitones);
  });

  $('[data-toggle="tooltip"]').tooltip();
  for(var i = 0; i < themes.length; i++) {
    $('#themes').append('<option value="' + i + '">' + themes[i].name + '</option>');
  }

	$('#themes').change(function() {
		colours = themes[Number($('#themes option:selected').val())].colours;
	});
});

