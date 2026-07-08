// ------ PUZZLE PARAMETERS -----
// Scale shows the amount of pixels displayed for each inch
let globalScale = 60;
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

// ------- PUZZLE CONTENT -------
let wordListJSON = localStorage.getItem('wordList');
let wordList = ['cat', 'hat', 'rat', 'bat'];
if (wordListJSON !== null) {
    wordList = JSON.parse(wordListJSON);
}

// ------ UTILITY FUNCTIONS -----
/* Shuffle an array randomly */
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

/* Replace the first character of the given word with a space */
function hideLetter(word) {
    return word.replace(/^./, ' ');
}

/* Transform a number into a string that ends with 'px'. */
function appendPx(n) {
    return `${n}px`
}

/* Create an SVG element by its name */
function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

class Puzzle {
    page;
    scale;

    /* The constructor for the class */
    constructor(page, scale) {
        this.page = page;
        this.scale = scale;
    }

    /* Update the height and width of the SVG with the global variable values. */
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
            picture.setAttribute('href', `pictures/${wordList[i]}.png`);
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
            picture.setAttribute('width', circleSize * pictureScale * this.scale);
            picture.setAttribute('height', circleSize * pictureScale * this.scale);
            for (let j = 0; j < wordLength; j++) {
                const circle = this.page.querySelector(`.circle.row${i}.col${j}`);
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
                const letter = this.page.querySelector(`.letter.row${i}.col${j}`);
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
                letter.style.fontSize = appendPx(letterScale * circleSize * this.scale);
                // Add a personal touch to each letter
                letter.setAttribute('rotate',
                    (Math.random() * 2 - 1) * letterRandomRotation);
            }
        }
    }

    /* Set the background color of the puzzle to the given color */
    setBackgroundColor(color) {
        this.page.querySelector('.background-fill').setAttribute('fill', color);
        this.page.style.setProperty('--bg-color', color);
    }

    /* Set the color of pre-filled letters in the puzzle to the given color */
    setLetterColor(color) {
        this.page.style.setProperty('--letter-color', color);
        this.page.querySelectorAll('.letter').forEach(letter => {
            letter.setAttribute('fill', color);
        })
    }

    /* Update the words and pictures in the puzzle to match the word list */
    updatePuzzleWords() {
        for (let i = 0; i < wordList.length; i++) {
            const picture = this.page.querySelector(`.picture.row${i}`);
            picture.setAttribute('href', `pictures/${wordList[i]}.png`);
            for (let j = 0; j < wordLength; j++) {
                const letter = this.page.querySelector(`.letter.row${i}.col${j}`);
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
            topLine.setAttribute('y1', marginTop * this.scale)
            topLine.setAttribute('y2', marginTop * this.scale)
            topLine.setAttribute('x1', 0)
            topLine.setAttribute('x2', documentWidth * this.scale)
            leftLine.setAttribute('x1', marginLeft * this.scale)
            leftLine.setAttribute('x2', marginLeft * this.scale)
            leftLine.setAttribute('y1', 0)
            leftLine.setAttribute('y2', documentHeight * this.scale)
            rightLine.setAttribute('x1', (documentWidth - marginRight) * this.scale)
            rightLine.setAttribute('x2', (documentWidth - marginRight) * this.scale)
            rightLine.setAttribute('y1', 0)
            rightLine.setAttribute('y2', documentHeight * this.scale)
            bottomLine.setAttribute('y1', (documentHeight - marginBottom) * this.scale)
            bottomLine.setAttribute('y2', (documentHeight - marginBottom) * this.scale)
            bottomLine.setAttribute('x1', 0)
            bottomLine.setAttribute('x2', documentWidth * this.scale)
        }
    }
}

/* Create a callback for editing a word in the word list */
function createWordCallbackFunction(puzzle) {

    function callback(changeEvent) {
        // Get the current index of the element
        const i = parseInt(Array.from(changeEvent.target.classList)
            .find(className => className.startsWith('row'))
            .substring(3));
        const input = document.querySelector(`#word-list input.row${i}`);
        const wordNumber = wordList.length;
        if (i == wordNumber) {
            // Add an element
            wordList.push(input.value);
            puzzle.rebuildPuzzleContents();
            puzzle.updatePuzzleGeometry();
            const newLi = document.createElement('li');
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.classList.add(`row${i + 1}`);
            newInput.addEventListener('change', callback);
            document.getElementById('word-list').appendChild(newLi);
            newLi.appendChild(newInput);
        } else if (i < wordNumber && input.value.length < 1) {
            // Remove an element
            wordList.splice(i, 1);
            console.log(wordList);
            document.querySelector(`#word-list li:has(input.row${i})`).remove();
            // Shift all list item indices after the removed element one down
            for (let shift = i + 1; shift <= wordNumber; shift++) {
                const shiftInput = document.querySelector(
                    `#word-list input.row${shift}`);
                shiftInput.classList.remove(`row${shift}`);
                shiftInput.classList.add(`row${shift - 1}`);
            }
            puzzle.rebuildPuzzleContents();
            puzzle.updatePuzzleGeometry();
        } else {
            // Change an element
            wordList[i] = input.value;
            puzzle.updatePuzzleWords();
        }
        localStorage.setItem('wordList', JSON.stringify(wordList));
    }

    return callback;
}

document.addEventListener('DOMContentLoaded', () => {
    // ------- GENERAL SET UP -------
    const currentPage = document.getElementById('current-page');
    const preview = new Puzzle(currentPage, globalScale);
    const editWordCallback = createWordCallbackFunction(preview);

    // Set up the color selector widget
    Coloris({
        alpha: false,
        theme: 'polaroid',
    })

    // ---- PUZZLE INITIAL VALUES ---
    // Set the page color to the color currently selected in the dialog
    preview.setBackgroundColor(document.getElementById('bg-color').value);
    // Update the inputs to match the restored word list
    for (let i = 0; i <= wordList.length; i++) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.classList.add(`row${i}`);
        document.getElementById('word-list').appendChild(li);
        li.appendChild(input);
        if (i < wordList.length) {
            input.value = wordList[i];
        }
    }
    console.log(wordList);
    // Update page dimensions
    const selectedValue = document.getElementById('document-size')
        .value.split('x');
    const [selectedWidth, selectedHeight] = selectedValue;
    documentWidth = parseFloat(selectedWidth);
    documentHeight = parseFloat(selectedHeight);
    preview.updateDocumentSize();
    preview.updatePageMargins();
    preview.rebuildPuzzleContents();
    preview.updatePuzzleGeometry();
    preview.setLetterColor(document.getElementById('letter-color').value);

    // --- PUZZLE DYNAMIC CONTROLS --
    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        switch (pickEvent.detail.currentEl.id) {
            case 'bg-color':
                preview.setBackgroundColor(pickEvent.detail.color);
                break;
            case 'letter-color':
                preview.setLetterColor(pickEvent.detail.color);
                break;
        }
    })
    // Change page dimensions when a new format is selected
    document.getElementById('document-size').addEventListener('change', () => {
        const selectedValue = document.getElementById('document-size')
            .value.split('x');
        const [selectedWidth, selectedHeight] = selectedValue;
        documentWidth = parseFloat(selectedWidth);
        documentHeight = parseFloat(selectedHeight);
        console.log(documentWidth, documentHeight);
        preview.updateDocumentSize();
        preview.updatePageMargins();
        preview.updatePuzzleGeometry();
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
        }
        preview.updatePuzzleWords();
        localStorage.setItem('wordList', JSON.stringify(wordList));
    });
    // ----- DOWNLOAD SVG IMAGE -----
    document.getElementById('download').addEventListener('click', () => {
        const svgElement = currentPage.querySelector('svg');
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
