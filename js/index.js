global.jQuery = require('jquery');
require('bootstrap');
var Transposer = require('chord-transposer');
var $ = jQuery;
var printf = require('printf');

var themes = require('./themes.js');
var colours = themes[0].colours;

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

function chordSpanFormatter(text, id) {
  var colour = colours[id % colours.length];
  return "<span class='chord' style='color: #" + colour + "'>" + text + "</span>";
}

var semitonesOffset = 0;

$(document).ready(function() {
  $('#transpose-button').click(function() {
    var text = $("#chordarea").val();
    var currentKey = $("#current-key").val();
    var newKey = $("#new-key").val();
    var result = Transposer.transpose(text).withFormatter(chordSpanFormatter);

    if (currentKey === "auto") {
      currentKey = result.down(0).key;
    }
    result = result.fromKey(currentKey).toKey(newKey);

    $('#output').html(result.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result.key);
    semitonesOffset = result.offset;
  });

  $('#transpose-up').click(function() {
    var text = $("#chordarea").val();
    var currentKey = $("#current-key").val();
    var result = Transposer.transpose(text).withFormatter(chordSpanFormatter);

    semitonesOffset++;
    if (currentKey !== "auto") {
      result = result.fromKey(currentKey).up(semitonesOffset);
    } else {
      result = result.up(semitonesOffset);
    } 
    $('#output').html(result.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    $('#new-key').val(result.key);
  });

  $('#transpose-down').click(function() { 
    var text = $("#chordarea").val();
    var currentKey = $("#current-key").val();
    var result = Transposer.transpose(text).withFormatter(chordSpanFormatter);

    semitonesOffset--;
    if (currentKey !== "auto") {
      result = result.fromKey(currentKey).down(semitonesOffset);
    } else {
      result = result.down(semitonesOffset);
    }  
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

  /* Create themes dropdown. */
  for (var i = 0; i < themes.length; i++) {
    $('#themes').append(
      printf('<option value="%s">%s</option>', i, themes[i].name));
  }

  /* Adds they key signatures to the given dropdown (jQuery object). */
  function addKeySignatures(dropdown) {
    for (var key in Transposer.keySignatures()) {
      dropdown.append(
        printf('<option value="%s">%s/%sm</option>',
          key, key, Transposer.getRelativeMinor(key)));
    }
  }
  addKeySignatures($('#current-key'));
  addKeySignatures($('#new-key'));

	$('#themes').change(function() {
		colours = themes[Number($('#themes option:selected').val())].colours;
	});

  $('#output').click(function() {
    selectElement($('#output')[0]);
  });
});
