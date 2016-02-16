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
    var result = transposeToKey($("#chordarea").val(), newKey, {
      currentKey: currentKey,
      formatter: chordSpanFormatter
    });
    var newText = result.text;
    $('#output').html(newText.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result.key);
    semitonesOffset = result.semitones;
  });

  $('#transpose-up').click(function() {
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    // var semitones = parseInt($("#semitones").val());
    semitonesOffset++;
    var result = transposeSemitones($("#chordarea").val(), semitonesOffset, {
      currentKey: currentKey,
      formatter: chordSpanFormatter
    });
    //var newText = result.text;
    $('#output').html(result.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result.key);
  });

  $('#transpose-down').click(function() { 
    var currentKey = $("#current-key").val();
    if(currentKey == "auto") {
      currentKey = null;
    }
    // var semitones = -parseInt($("#semitones").val());
    semitonesOffset--;
    var result = transposeSemitones($("#chordarea").val(), semitonesOffset, {
      currentKey: currentKey,
      formatter: chordSpanFormatter
    });
    //var newText = result.text;
    $('#output').html(result.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result.key);
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