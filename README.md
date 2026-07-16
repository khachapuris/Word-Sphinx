# Word Sphinx

Word Sphinx is a web application for creating educational puzzles for kids.
It provides various controls and options for the layout, contents, and
styling of the activity sheet, and allows you to download the resulting work
in a printable format.

## Installation

To install and run the software from your computer, follow these steps:

1. Clone the git repository
`git clone https://github.com/khachapuris/Word-Sphinx`
2. `cd Word-Sphinx`
3. Open the file `index.html` in your browser

## Setup

As the program distribution does not include any images, you must provide it
with your own set of pictures. To do this, go through the following steps:

1. Create a directory called `pictures` in the base folder
2. Paste your pictures in PNG format into the created directory
    - Note that the application works best with square images on a transparent
    background
    - Name each image like this: `{word}.png`, where `{word}` is the name that
    will be used in the puzzles
3. Go back with `cd ..`
4. Update the file `wordlist.js` with all the words you added:
    - Manually:
    ```
    pathToPictures = "{full-path-to-the-pictures-folder}";
    allWords = ["{word1}", "{word2}", "{word3}"]
    ```
    - Using bash:
    ```bash
    realpath pictures | sed 's/^\(.*\)$/pathToPictures = "\1";/' > wordlist.js
    ls pictures | sed 's/^\(.*\)\.png$/    "\1",/; 1s/^/allWords = [\n/; $s/$/\n]/' >> wordlist.js
    ```

After you're done, open `index.html` in your browser.

## Usage

To create an activity sheet, simply adjust the parameters on the webpage; your
editing will be accompanied by a real-time preview of the ready puzzle. When
you are finished, click `Download > as SVG` to download the work.
