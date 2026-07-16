// ------ PUZZLE PARAMETERS -----
// Scale shows the amount of pixels displayed for each inch
let previewScale = 60;
let smallScreensPreviewScale = 40;
let tinyScreensPreviewScale = 26;
let downloadScale = 600;
// The following values are in inches
let documentWidth = 8.27;
let documentHeight = 11.69;
let marginInside = 0.75;
let marginOutside = 0.5;
let paddingLeft = 0.5;
let paddingRight = 0.5;
let paddingTop = 0.5;
let paddingBottom = 0.5;
let letterRandomOffset = 0.01;
// These values are in degrees
let letterRandomRotation = 1;
// These values are dimensionless ratios of various elements to the circle size
let gapVertical = 0.60; // gap between rows of circles
let gapHorizontal = 0.15; // gap between columns of circles
let gapPicture = 1.00; // gap between the picture and the circles
let pictureScale = 1.80;
let letterScale = 0.80;
let strokeThickness = 0.035;
// These values are countable numbers
let wordLength = 3;
// These values are boolean
let insideIsLeft = true;
// These variables represent default values of data saved between sessions
let wordList = ['cat', 'hat', 'rat', 'bat'];
let bgColor = '#ffffff';
let letterColor = '#808080';
let documentSize = '8.27x11.69';

// ----- RESTORE CACHED DATA ----
let wordListStored = localStorage.getItem('wordList');
if (wordListStored !== null) {
    wordList = JSON.parse(wordListStored);
}
let bgColorStored = localStorage.getItem('bgColor');
if (bgColor !== null) {
    bgColor = bgColorStored;
}
let letterColorStored = localStorage.getItem('letterColor');
if (letterColor !== null) {
    letterColor = letterColorStored;
}
let documentSizeStored = localStorage.getItem('documentSize');
if (documentSizeStored !== null) {
    documentSize = documentSizeStored;
}
allWords = allWords.filter(word => word.length == wordLength);

// Assign page-orientation dependent values for easier use in calculations
let marginTop = marginOutside;
let marginBottom = marginOutside;
let marginRight;
let marginLeft;
if (insideIsLeft) {
    marginLeft = marginInside;
    marginRight = marginOutside;
} else {
    marginLeft = marginOutside;
    marginRight = marginInside;
}

// Unset global variables
let awesompleteList = [];

// ------ UTILITY FUNCTIONS -----
/* Shuffle an array randomly. */
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

/* Replace the first character of the given word with a space. */
function hideLetter(word) {
    return word.replace(/^./, ' ');
}

/* Transform a number into a string that ends with 'px'. */
function appendPx(n) {
    return `${n}px`
}

/* Create an SVG element by its name. */
function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

// ------ PUZZLE RENDERING ------
/* Class for rendering SVG puzzles based on the defined global variables. */
class Puzzle {
    page; // the HTML element used to display the page
    scale; // the scale of the puzzle in pixels per inch

    /* The constructor for the class. */
    constructor(page, scale) {
        this.page = page;
        this.scale = scale;
    }

    /* Update the height and width of the SVG with global variable values. */
    updateDocumentSize() {
        const pageSVG = this.page.querySelector('.svg');
        const backgroundFill = this.page.querySelector('.background-fill');
        this.page.style.width = appendPx(documentWidth * this.scale + 2);
        this.page.style.height = appendPx(documentHeight * this.scale + 2);
        pageSVG.style.width = appendPx(documentWidth * this.scale);
        pageSVG.style.height = appendPx(documentHeight * this.scale);
        pageSVG.setAttribute('width', documentWidth * this.scale);
        pageSVG.setAttribute('height', documentHeight * this.scale);
        backgroundFill.setAttribute('width', documentWidth * this.scale);
        backgroundFill.setAttribute('height', documentHeight * this.scale);
    }

    /* Update the SVG elements of which the puzzle is composed.
     *
     * Note that this erases all geometry set on the puzzle, as all elements
     * are deleted and then created again. */
    rebuildPuzzleContents() {
        // First, erase all previous groups and objects
        this.page.querySelector('.page-content').remove();
        const pageContent = createSVGElement('g');
        pageContent.classList.add('page-content');
        this.page.querySelector('.svg').appendChild(pageContent);

        for (let i = 0; i < wordList.length; i++) {
            // Create a group for each row
            const row = createSVGElement('g');
            row.classList.add(`row${i}-group`);
            pageContent.appendChild(row);
            // Add a picture
            const picture = createSVGElement('image');
            picture.classList.add('picture', `row${i}`);
            picture.setAttribute('href',
                `${pathToPictures}/${wordList[i]}.png`);
            row.appendChild(picture);

            for (let j = 0; j < wordLength; j++) {
                // Make a circle for each letter of the word
                const circle = createSVGElement('circle');
                circle.setAttribute('stroke', 'black');
                circle.setAttribute('fill', 'white');
                circle.classList.add('circle', `row${i}`, `col${j}`);
                row.appendChild(circle)
                // Add pre-filled letters
                const letter = createSVGElement('text');
                letter.setAttribute('text-anchor', 'middle');
                letter.setAttribute('dominant-baseline', 'central');
                letter.classList.add('letter', `row${i}`, `col${j}`);
                letter.innerHTML = hideLetter(wordList[i])[j].toUpperCase();
                row.appendChild(letter);
            }
        }
    }

    /* Update the puzzle's geometry with the global variable values. */
    updatePuzzleGeometry() {
        const availableWidth = documentWidth
            - marginLeft
            - marginRight
            - paddingLeft
            - paddingRight
        const availableHeight = documentHeight
            - marginTop
            - marginBottom
            - paddingTop
            - paddingBottom;
        const circleHeight = availableHeight / (
            wordList.length + gapVertical * (wordList.length - 1)
        );
        const circleWidth = availableWidth / (
            1 + gapPicture + wordLength + gapHorizontal * (wordLength - 1)
        );
        const circleSize = Math.min(circleHeight, circleWidth);
        const circleRadius = circleSize / 2;

        // Update each picture and circle
        for (let i = 0; i < wordList.length; i++) {
            const picture = this.page.querySelector(`.picture.row${i}`);
            picture.setAttribute('x', (marginLeft + paddingLeft) * this.scale);
            picture.setAttribute('y', this.scale * (
                marginTop
                + paddingTop
                + i * (1+gapVertical) * circleSize
                + (1 - pictureScale) / 2 * circleSize
            ));
            picture.setAttribute('width',
                circleSize
                * pictureScale
                * this.scale);
            picture.setAttribute('height',
                circleSize
                * pictureScale
                * this.scale);
            for (let j = 0; j < wordLength; j++) {
                const circle = this.page
                    .querySelector(`.circle.row${i}.col${j}`);
                circle.setAttribute('cx', this.scale * (
                    marginLeft
                    + paddingLeft
                    + circleSize
                    + gapPicture * circleSize
                    + j * (1+gapHorizontal) * circleSize
                    + circleRadius
                ));
                circle.setAttribute('cy', this.scale * (
                    marginTop
                    + paddingTop
                    + i * (1+gapVertical) * circleSize
                    + circleRadius
                ));
                circle.setAttribute('r', this.scale * circleRadius);
                circle.setAttribute('stroke-width',
                    circleSize * strokeThickness * this.scale);
                const letter = this.page
                    .querySelector(`.letter.row${i}.col${j}`);
                letter.setAttribute('x', this.scale * (
                    marginLeft
                    + paddingLeft
                    + circleSize
                    + gapPicture * circleSize
                    + j * (1+gapHorizontal) * circleSize
                    + circleRadius
                ));
                letter.setAttribute('y', this.scale * (
                    marginTop
                    + paddingTop
                    + i * (1+gapVertical) * circleSize
                    + circleRadius
                    + (Math.random() * 2 - 1) * letterRandomOffset
                ));
                letter.style.fontSize = appendPx(
                    letterScale
                    * circleSize
                    * this.scale);
                letter.style.fontFamily = 'Short Stack';
                // Add a personal touch to each letter
                letter.setAttribute('rotate',
                    (Math.random() * 2 - 1) * letterRandomRotation);
            }
        }
    }

    /* Set the background color of the puzzle to the given color. */
    setBackgroundColor() {
        this.page.style.setProperty('--bg-color', bgColor);
        this.page.querySelector('.background-fill')
            .setAttribute('fill', bgColor);
    }

    /* Set the color of pre-filled letters in the puzzle to the given color. */
    setLetterColor() {
        this.page.style.setProperty('--letter-color', letterColor);
        this.page.querySelectorAll('.letter').forEach(letter => {
            letter.setAttribute('fill', letterColor);
        })
    }

    /* Update the words and pictures in the puzzle to match the word list. */
    updatePuzzleWords() {
        for (let i = 0; i < wordList.length; i++) {
            const picture = this.page.querySelector(`.picture.row${i}`);
            picture.setAttribute('href',
                `${pathToPictures}/${wordList[i]}.png`);
            for (let j = 0; j < wordLength; j++) {
                const letter = this.page
                    .querySelector(`.letter.row${i}.col${j}`);
                letter.innerHTML = hideLetter(wordList[i])[j].toUpperCase();
            }
        }
    }

    /* Update the page margins in the SVG with the global variable values. */
    updatePageMargins() {
        const lines = [[
            this.page.querySelector('.margin-line.top'),
            this.page.querySelector('.margin-line.left'),
            this.page.querySelector('.margin-line.right'),
            this.page.querySelector('.margin-line.bottom'),
        ], [
            this.page.querySelector('.margin-hl-line.top'),
            this.page.querySelector('.margin-hl-line.left'),
            this.page.querySelector('.margin-hl-line.right'),
            this.page.querySelector('.margin-hl-line.bottom'),
        ]];
        for (const [topLine, leftLine, rightLine, bottomLine] of lines) {
            topLine.setAttribute('y1', marginTop * this.scale);
            topLine.setAttribute('y2', marginTop * this.scale);
            topLine.setAttribute('x1', 0);
            topLine.setAttribute('x2', documentWidth * this.scale);
            leftLine.setAttribute('x1', marginLeft * this.scale);
            leftLine.setAttribute('x2', marginLeft * this.scale);
            leftLine.setAttribute('y1', 0);
            leftLine.setAttribute('y2', documentHeight * this.scale);
            rightLine.setAttribute('x1',
                (documentWidth - marginRight) * this.scale);
            rightLine.setAttribute('x2',
                (documentWidth - marginRight) * this.scale);
            rightLine.setAttribute('y1', 0);
            rightLine.setAttribute('y2', documentHeight * this.scale);
            bottomLine.setAttribute('y1',
                (documentHeight - marginBottom) * this.scale);
            bottomLine.setAttribute('y2',
                (documentHeight - marginBottom) * this.scale);
            bottomLine.setAttribute('x1', 0);
            bottomLine.setAttribute('x2', documentWidth * this.scale);
        }
    }
}

/* Create and return an input for the word list dialog */
function createWordInput(i) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('list', `datalist-${i}`);
    input.setAttribute('autocomplete', 'off');
    input.classList.add(`row${i}`);
    input.classList.add('awesomecomplete');
    document.getElementById('word-list').appendChild(li);
    li.appendChild(input);
    // Provide autocompletion options for the word list inputs
    const awesomplete = new Awesomplete(input, {
        list: allWords,
        minChars: 1,
        maxItems: allWords.length,
    });
    awesomplete.list = allWords;
    awesompleteList[i] = awesomplete;
    // Select all text when an input is focused
    input.addEventListener('focus', () => input.select());
    // Return the created input element
    return input;
}

/* Create a callback for editing a word in the word list. */
function createWordCallbackFunction(puzzle) {

    function callback(changeEvent) {
        // Get the current index of the element
        const i = parseInt(Array.from(changeEvent.target.classList)
            .find(className => className.startsWith('row'))
            .substring(3));
        const input = document.querySelector(`#word-list input.row${i}`);
        const wordNumber = wordList.length;
        if (i == wordNumber && allWords.includes(input.value)) {
            // Add an element
            wordList.push(input.value);
            puzzle.rebuildPuzzleContents();
            puzzle.updatePuzzleGeometry();
            puzzle.setLetterColor();
            const newInput = createWordInput(i + 1);
            newInput.addEventListener('change', callback);
            // Present the input as valid
            input.classList.remove('invalid');
            // Focus the next input
            document.querySelector(`#word-list input.row${i + 1}`).focus();
        } else if (i < wordNumber && input.value.length === 0) {
            // Remove an element
            wordList.splice(i, 1);
            document.querySelector(`#word-list li:has(input.row${i})`)
                .remove();
            awesompleteList[i].destroy();
            // Shift all list item indices after the removed element one down
            for (let shift = i + 1; shift <= wordNumber; shift++) {
                const shiftInput = document.querySelector(
                    `#word-list input.row${shift}`);
                shiftInput.classList.remove(`row${shift}`);
                shiftInput.classList.add(`row${shift - 1}`);
            }
            puzzle.rebuildPuzzleContents();
            puzzle.updatePuzzleGeometry();
            puzzle.setLetterColor();
            // Present the input as valid
            input.classList.remove('invalid');
            // Focus the previous input
            document.querySelector(`#word-list input.row${i - 1}`).focus();
        } else if (allWords.includes(input.value)) {
            // Change an element
            wordList[i] = input.value;
            puzzle.updatePuzzleWords();
            // Present the input as valid
            input.classList.remove('invalid');
            // Focus the next input
            // document.querySelector(`#word-list input.row${i + 1}`).focus();
        } else {
            // Present the input as invalid
            input.classList.add('invalid');
        }
        console.log(wordList);
        localStorage.setItem('wordList', JSON.stringify(wordList));
    }

    return callback;
}

document.addEventListener('DOMContentLoaded', () => {
    // ------- GENERAL SET UP -------
    const currentPage = document.getElementById('current-page');
    const preview = new Puzzle(currentPage, previewScale);
    const editWordCallback = createWordCallbackFunction(preview);
    const smallScreens = window.matchMedia('(width < 1100px)');
    const tinyScreens = window.matchMedia('(width < 510px)');

    // Set up the color selector widget
    Coloris({
        alpha: false,
        theme: 'polaroid',
    });

    /* Resize the puzzle according to the screen size */
    function adjustPreviewScale() {
        if (tinyScreens.matches) {
            preview.scale = tinyScreensPreviewScale;
        } else if (smallScreens.matches) {
            preview.scale = smallScreensPreviewScale;
        } else {
            preview.scale = previewScale;
        }
    }

    // ---- PUZZLE INITIAL VALUES ---
    // Set up the color dialogs' selected colors
    console.log(bgColor, letterColor);
    const bgColorInput = document.getElementById('bg-color');
    const letterColorInput = document.getElementById('letter-color');
    bgColorInput.value = bgColor;
    letterColorInput.value = letterColor;
    bgColorInput.dispatchEvent(new Event('input', { bubbles: true }));
    letterColorInput.dispatchEvent(new Event('input', { bubbles: true }));
    // Update the inputs to match the restored word list
    for (let i = 0; i <= wordList.length; i++) {
        const input = createWordInput(i);
        if (i < wordList.length) {
            input.value = wordList[i];
        }
    }
    console.log(wordList);
    // Update page dimensions
    document.getElementById('document-size').value = documentSize;
    const selectedValue = documentSize.split('x');
    const [selectedWidth, selectedHeight] = selectedValue;
    documentWidth = parseFloat(selectedWidth);
    documentHeight = parseFloat(selectedHeight);
    preview.setBackgroundColor();
    preview.updateDocumentSize();
    preview.updatePageMargins();
    preview.rebuildPuzzleContents();
    preview.updatePuzzleGeometry();
    preview.setLetterColor();

    // --- PUZZLE DYNAMIC CONTROLS --
    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        switch (pickEvent.detail.currentEl.id) {
            case 'bg-color':
                bgColor = pickEvent.detail.color;
                preview.setBackgroundColor();
                localStorage.setItem('bgColor', bgColor);
                break;
            case 'letter-color':
                letterColor = pickEvent.detail.color;
                preview.setLetterColor();
                localStorage.setItem('letterColor', letterColor);
                break;
        }
    })
    // Change page dimensions when a new format is selected
    document.getElementById('document-size').addEventListener('change', () => {
        documentSize = document.getElementById('document-size').value;
        const [selectedWidth, selectedHeight] = documentSize.split('x');
        documentWidth = parseFloat(selectedWidth);
        documentHeight = parseFloat(selectedHeight);
        console.log(documentWidth, documentHeight);
        preview.updateDocumentSize();
        preview.updatePageMargins();
        preview.updatePuzzleGeometry();
        localStorage.setItem('documentSize', documentSize);
    })
    // Edit the word list interactively
    for (let i = 0; i <= wordList.length; i++) {
        const input = document.querySelector(`#word-list input.row${i}`);
        input.addEventListener('change', editWordCallback);
    }
    // Shuffle button functinality
    document.getElementById('shuffle-words').addEventListener('click', () => {
        shuffle(wordList);
        for (let i = 0; i < wordList.length; i++) {
            const input = document.querySelector(`#word-list input.row${i}`);
            input.value = wordList[i];
            input.classList.remove('invalid');
        }
        preview.updatePuzzleWords();
        localStorage.setItem('wordList', JSON.stringify(wordList));
    });
    // Update the puzzle & close popup when picking an autocomplete option
    document.addEventListener('awesomplete-selectcomplete', (selectEvent) => {
        console.log(selectEvent);
        console.log(awesompleteList);
        // Get the current index of the element
        const i = parseInt(Array.from(selectEvent.target.classList)
            .find(className => className.startsWith('row'))
            .substring(3));
        awesompleteList[i].close();
        selectEvent.target.dispatchEvent(new Event('change'));
    });

    // ------ RESPONSIVE DESIGN -----
    smallScreens.addEventListener('change', () => {
        adjustPreviewScale();
        preview.updateDocumentSize();
        preview.updatePageMargins();
        preview.updatePuzzleGeometry();
    });
    tinyScreens.addEventListener('change', () => {
        adjustPreviewScale();
        preview.updateDocumentSize();
        preview.updatePageMargins();
        preview.updatePuzzleGeometry();
    });

    // ----- DOWNLOAD SVG IMAGE -----
    document.getElementById('download').addEventListener('click', () => {
        // Create a separate puzzle suitable for download
        const readyPage = document.getElementById('ready-page');
        const readyPuzzle = new Puzzle(readyPage, downloadScale);
        readyPuzzle.setBackgroundColor();
        readyPuzzle.updateDocumentSize();
        readyPuzzle.rebuildPuzzleContents();
        readyPuzzle.updatePuzzleGeometry();
        readyPuzzle.setLetterColor();
        // Get the generated SVG element
        const svgElement = readyPage.querySelector('svg');
        // Get the source text of the SVG element using XML serializer
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);
        // Add an XML declaration for the SVG to be readable as a separate file
        source = '<?xml version="1.0" encoding="UTF-8"?>' + source;
        // Use a blob URL to download the image
        const blob = new Blob([source], {
            type: "image/svg",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.innerText = 'Download the image as SVG';
        link.download = 'puzzle.svg'
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
})
