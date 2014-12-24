// Regex for recognizing chords
var chordPattern = XRegExp('^(?<chord>[A-G](#|b)?)(?<suffix>(\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-|add)?\\d*\\)?)*)(\\/(?<bass>[A-G](#|b)?))?$');
var colours;

/**
 * Transposes text from one key to another.
 */
function transpose(text) { 

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
      
      symbol = chord + suffix + bass;
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

  $('#chordarea').val(rawText);
  $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
  $('#current-key').val(newKey);
}

/**
 * A semi-hack method that returns span HTML object with a certain
 * font colour.
 */
function chordSpan(text, colour) {
  return "<span class='chord' style='color: #" + colour + "'>" + text + "</span>";
}

function selectAll() {
  $('#chordarea').focus();
  $('#chordarea').select();
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


$(document).ready(function() {  
  colours = themes[0].colours;

  $('#print-button').click(function(){
    window.print();
  });

  $('#select-button').click(function(){
    selectAll();
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

