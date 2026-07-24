# Word Sphinx

Word Sphinx is a web application for creating educational puzzles for kids.
It provides various controls and options for the layout, contents, and
styling of the activity sheet, and allows you to download the resulting work
in a printable format.

<img width="1920" height="1080" alt="a screenshot of the application"
src="https://github.com/user-attachments/assets/637bbbea-9c1a-4761-8485-606ff7929801" />

## Installation

To install and run the software from your computer, follow these steps:

1. Clone the git repository
`git clone https://github.com/khachapuris/Word-Sphinx`
2. `cd Word-Sphinx`
3. Open the file `index.html` in your browser

## Setup

Word Sphinx is designed to create activity sheets using images *you* provide.
You can start with a minimal set of pictures (e.g. 4) and add more as you need
them. Begin with the following steps:

1. Create a directory called `pictures` in the base folder
2. Paste your pictures in PNG format into the created directory
    - Note that the application works best with
    square images on a transparent background
    - Name each image like this: `{word}.png`,
    where `{word}` is the word that will be used in the puzzles
3. Go back to the base directory
4. Create a file called `wordlist.js` and update it with all the pictures
you added:
    - Manually:
    ```js
    pathToPictures = "{full-path-to-the-pictures-folder}";
    allWords = ["{word1}", "{word2}", "{word3}"]
    ```
    - With bash:
    ```bash
    realpath pictures | sed 's/^\(.*\)$/pathToPictures = "\1";/' > wordlist.js
    ls pictures | sed 's/^\(.*\)\.png$/    "\1",/; 1s/^/allWords = [\n/; $s/$/\n]/' >> wordlist.js
    ```

After you open (reload) `index.html` in your browser and type one of the new
words into the field, the word and respective picture will appear in the
preview. If the image renders too high/low, ensure the image is square and
centered; if it is too big/small, consider enlarging/shrinking the transparent
margins.

Whenever you decide to add more images, put them into the `pictures` folder.
Do not forget add the corresponding words to `wordlist.js` (either manually,
or rerun the bash script above).

## Usage

To create an activity sheet, adjust the parameters on the webpage; your
editing will be accompanied by a real-time preview of the ready puzzle.
When you are finished, click `Download > as SVG` to download the work.
