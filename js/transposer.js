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

$(document).ready(function() {
  $('#transpose-button').click(function() {
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    var newKey = $("#new-key").val();
    var newText = transposeToKey($("#chordarea").val(), currentKey, newKey, chordSpanFormatter);
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
  });

  $('#transpose-up').click(function() {
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    var semitones = parseInt($("#semitones").val());
    var newText = transposeSemitones($("#chordarea").val(), currentKey, semitones, chordSpanFormatter);
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
  });

  $('#transpose-down').click(function() { 
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    var semitones = -parseInt($("#semitones").val());
    var newText = transposeSemitones($("#chordarea").val(), currentKey, semitones, chordSpanFormatter);
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
  });

  $('#example').click(function() {
    $('#chordarea').val($('#example-text').val());
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

