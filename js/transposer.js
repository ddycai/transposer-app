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

// Regex for recognizing chords
var chordPattern = XRegExp('^(?<chord>[A-G](#|b)?)(?<suffix>(\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-|add)?\\d*\\)?)*)(\\/(?<bass>[A-G](#|b)?))?$');
var colours = themes[0].colours;

/**
 * Transposes text from one key to another.
 */
function transpose(text) { 

  // If empty string don't do anything
  if(!text) return;

  var currentKey = $("#current-key").val();
  if(currentKey == "auto") {
    currentKey = null;
  }
  var newKey = $("#new-key").val();

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
      if(!currentKey)
        currentKey = parts.chord;
      chord = transposeNote(parts.chord, currentKey, newKey);
      suffix = (parts.suffix === undefined) ? "" : parts.suffix;
      bass = (parts.bass === undefined) ? "" : transposeNote(parts.bass, currentKey, newKey);
     
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
 * Transposes a single note from one key to another.
 */
function transposeNote(note, currentKey, newKey) {
  if(!currentKey in keys || !newKey in keys) {
    throw "Specified keys do not exist!";
  }

  var distance = keys[newKey]["index"] - keys[currentKey]["index"];
  var noteInd = flats.indexOf(note);
  if(noteInd == -1) noteInd = sharps.indexOf(note);
  if(noteInd == -1) throw "Note (" + note + ") does not exist.";

  if(keys[newKey]["flats"] > 0) {
    return flats[(noteInd + flats.length + distance) % flats.length];
  } else {
    return sharps[(noteInd + sharps.length + distance) % sharps.length];
  }

}

/**
 * Transposes a single note up or down a certain number of semitones.
 */
function transposeNoteSemitone(note, currentKey, distance) {
  if(!currentKey in keys) {
    throw "Specified keys do not exist!";
  }

  var newInd = (keys.indexOf(currentKey) + n + keys.length) % keys.length;
  var newKey;
  for(k in keys) {
    if(k["index"] == newInd) {
      newKey = k;
      break;
    }
  }

  return transposeNote(note, currentKey, newKey);
}

$(document).ready(function() {  

  $('#print-button').click(function(){
    window.print();
  });

  $('#transpose-button').click(function(){
    transpose($("#chordarea").val());
  });

  $('[data-toggle="tooltip"]').tooltip();
  for(var i = 0; i < themes.length; i++) {
    $('#themes').append('<option value="' + i + '">' + themes[i].name + '</option>');
  }

	$('#themes').change(function() {
		colours = themes[Number($('#themes option:selected').val())].colours;
	});
});

