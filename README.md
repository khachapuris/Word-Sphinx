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

As the program does not include any images, you must provide it your own set
of pictures. To do so, go through the following steps:

1. Create a directory called `pictures` inside the base directory
2. Paste your pictures in PNG format into the created folder
    - Note that the application works best with square images on a transparent
    background
    - Name each image like this: `{word}.png`, where `{word}` is the name that
    will be used in the puzzle (e.g. `cat.png` for the word `cat`)
3. Go back with `cd ..`
4. Update the file `wordlist.js` with all the words you added:
    - Manually: `allWords = ["{word1}", "{word2}", "{word3}"]`
    - Using bash:
`ls pictures | sed 's/^\(.*\)\.png/    "\1",/; 1s/^/allWords = [\n/; $s/$/\n]/' > wordlist.js`

## Usage

The website's interface is self-explanatory. Simply adjust the puzzle
parameters and click `Download > as SVG` to download the work sheet.
