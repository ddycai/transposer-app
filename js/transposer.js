/**
 * From http://stackoverflow.com/a/9976077
 */
function selectElement(element) {
  if (window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      var range = document.createRange();
      range.selectNodeContents(element);
      sel.addRange(range);
  } else if (document.selection) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(element);
      textRange.select();
  }
}

var semitonesOffset = 0;

$(document).ready(function() {
  $('#transpose-button').click(function() {
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    var newKey = $("#new-key").val();
    var result = transposeToKey($("#chordarea").val(), currentKey, newKey, chordSpanFormatter);
    var newText = result[0];
    newKey = result[1];
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result[1]);
    semitonesOffset = result[2];
  });

  $('#transpose-up').click(function() {
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    // var semitones = parseInt($("#semitones").val());
    semitonesOffset++;
    var result = transposeSemitones($("#chordarea").val(), currentKey, semitonesOffset, chordSpanFormatter);
    var newText = result[0];
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result[1]);
  });

  $('#transpose-down').click(function() { 
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    // var semitones = -parseInt($("#semitones").val());
    semitonesOffset--;
    var result = transposeSemitones($("#chordarea").val(), currentKey, semitonesOffset, chordSpanFormatter);
    var newText = result[0];
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result[1]);
  });

  $('#example').click(function() {
    $('#chordarea').val($('#example-text').val());
  });

  $('#reset').click(function() {
    semitonesOffset = 0;
    $('#output').html('');
  });

  $('[data-toggle="tooltip"]').tooltip();
  for(var i = 0; i < themes.length; i++) {
    $('#themes').append('<option value="' + i + '">' + themes[i].name + '</option>');
  }

	$('#themes').change(function() {
		colours = themes[Number($('#themes option:selected').val())].colours;
	});

  $('#output').click(function() {
    selectElement($('#output')[0]);
  });
});

