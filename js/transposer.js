$(document).ready(function() {  

  $('#print-button').click(function() {
    window.print();
  });

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
});

