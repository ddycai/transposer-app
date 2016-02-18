Chord Transposer
========

A Javascript library and a web app that transposes text containing chords from one key to another.
The text is allowed to containing non-chord text (for example, lyrics). Only chords will be
identified and transposed.

##The Library

The library depends on the XRegExp regex library. To use it, include `xregexp-min.js` and
`transposer-lib.min.js`.

Given some text containing chords, you can transpose it to any other key.

```javascript
// Transpose from C major to D major.
result = transposeToKey(text, 'D', {currentKey: 'C'});
// The result is an object containing the new text,
newText = result.text;
// the new key,
newKey = result.key;
// and the number of semitones transposed.
semitones = result.semitones:
```

You can also transpose up or down any number of semitones.

```javascript
// Transpose up 7 semitones from C major.
result = transposeSemitones(text, 7, {currentKey: 'C'});

// Transpose down 4 semitones from C major.
result = transposeSemitones(text, -4, {currentKey: 'C'});
```

You can choose not to pass in the current key to let the first chord of your text be the key signature.

```javascript
// Transpose to C major.
result = transposeToKey(text, 'C');

// Transpose down 4 semitones.
result = transposeSemitones(text, -4);
```

You can pass in a formatter to format the chord symbols. A formatter takes the chord symbol and an id and returns the formatted chord. The id is unique for each chord. For example, to make chord symbols bold:

```javascript
// Transpose to C major but bold the chords.
result = transposeToKey(text, 'Bb', {
    formatter: function(sym, id) {
      return '<b>' + sym + '</b>';
    }
});
```

##The Web App

The web app makes use of the transposer library to provide a UI for transposing chords. It is
written using jQuery and Twitter Bootstrap.

See the project website for a demo.
