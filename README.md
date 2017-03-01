Chord Transposer
========

A web app that transposes text containing chords from one key to another with
colorful highlighting.

The text is allowed to containing non-chord text (for example, lyrics). Only
chords will be identified and transposed.

## Building the Code

The code is bundled using webpack. To install the required dependencies, make
sure you have `npm` and `webpack` installed and run:

```
$ npm install
```

Then build the `bundle.js` with webpack:

```
$ webpack
```

You can find the color schemes in `js/themes.js`.

See the project website to try it out!

The library used for transposing chords is
[chord-transposer](https://github.com/frigidrain/chord-transposer).

