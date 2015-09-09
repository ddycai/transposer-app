Chord Transposer
========

A Javascript library and a web app that transposes text containing chords from one key to another.
The text is allowed to containing non-chord text (for example, lyrics). Only chords will be
identified and transposed.

##The Library

The library depends on XRegExp regex library. To use it, include `xregexp-min.js` and
`transposer-lib.min.js`.

Given some text containing chords, you can transpose it to any other key.

```javascript
// Transpose from C major to D major.
result = transposeToKey(text, 'C', 'D');
// The result is an array with the new text at index 0.
newText = result[0];
// The new key at index 1.
newKey = result[1];
// And the number of semitones transposed at index 2.
semitones = result[2]:
```

You can also transpose up or down any number of semitones.

```javascript
// Transpose up 7 semitones.
result = transposeSemitones(text, 'C', 7);

// Transpose down 4 semitones.
result = transposeSemitones(text, 'C', -4);
```

If you don't know the key signature of your text, you can pass in null for the current key and the
transposer let the first chord it encounters be the key signture.

```javascript
// Transpose to C major.
result = transposeToKey(text, null, 'C');

// Transpose down 4 semitones.
result = transposeSemitones(text, null, -4);
```

##The Web App

The web app makes use of the transposer library to provide a UI for transposing chords. It is
written using jQuery and Twitter Bootstrap.

See the project website for a demo.
