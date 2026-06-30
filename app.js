// ------ PUZZLE PARAMETERS -----
// Scale shows the amount of pixels displayed for each inch
let scale = 60;
// The following values are in inches
let documentWidth = 8.27;
let documentHeight = 11.69;
let marginInside = 0.75;
let marginOutside = 0.5;
let paddingLeft = 0.5;
let paddingRight = 0.5;
let paddingTop = 0.5;
let paddingBottom = 0.5;
// These values are dimensionless ratios of various elements to the circle size
let gapVertical = 0.60; // gap between rows of circles
let gapHorizontal = 0.15; // gap between columns of circles
let gapPicture = 0.30; // gap between the picture and the circles
let pictureScale = 0.80;
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
let wordList = [
    { word: ' at', emoji: '&#128049;' },
    { word: ' an', emoji: '&#128656;' },
    { word: ' at', emoji: '&#128000;' },
    { word: ' at', emoji: '&#129415;' },
];
let wordNumber = wordList.length;

/* Transform a number into a string that ends with 'px'. */
function appendPx(n) {
    return `${n}px`
}

/* Create an SVG element by its name */
function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/* Update the height and width of the SVG with the global variable values. */
function updateDocumentSize() {
    const pageDiv = document.getElementById('current-page');
    const pageSVG = document.getElementById('current-page-svg');
    pageDiv.style.width = appendPx(documentWidth * scale + 2);
    pageDiv.style.height = appendPx(documentHeight * scale + 2);
    pageSVG.style.width = appendPx(documentWidth * scale);
    pageSVG.style.height = appendPx(documentHeight * scale);
    pageSVG.setAttribute('width', documentWidth * scale);
    pageSVG.setAttribute('height', documentHeight * scale);
}

/* Update the page margins in the SVG with the global variable values. */
function updatePageMargins() {
    const lines = [[
        document.getElementById('top-margin-line'),
        document.getElementById('left-margin-line'),
        document.getElementById('right-margin-line'),
        document.getElementById('bottom-margin-line'),
    ], [
        document.getElementById('top-margin-hl-line'),
        document.getElementById('left-margin-hl-line'),
        document.getElementById('right-margin-hl-line'),
        document.getElementById('bottom-margin-hl-line'),
    ]];
    for (const [topLine, leftLine, rightLine, bottomLine] of lines) {
        topLine.setAttribute('y1', marginTop * scale)
        topLine.setAttribute('y2', marginTop * scale)
        topLine.setAttribute('x1', 0)
        topLine.setAttribute('x2', documentWidth * scale)
        leftLine.setAttribute('x1', marginLeft * scale)
        leftLine.setAttribute('x2', marginLeft * scale)
        leftLine.setAttribute('y1', 0)
        leftLine.setAttribute('y2', documentHeight * scale)
        rightLine.setAttribute('x1', (documentWidth - marginRight) * scale)
        rightLine.setAttribute('x2', (documentWidth - marginRight) * scale)
        rightLine.setAttribute('y1', 0)
        rightLine.setAttribute('y2', documentHeight * scale)
        bottomLine.setAttribute('y1', (documentHeight - marginBottom) * scale)
        bottomLine.setAttribute('y2', (documentHeight - marginBottom) * scale)
        bottomLine.setAttribute('x1', 0)
        bottomLine.setAttribute('x2', documentWidth * scale)
    }
}

/* Update the SVG elements of which the puzzle is composed.
 *
 * Note that this erases all geometry set on the puzzle, as all elements
 * are deleted and then created again. */
function updatePuzzleContents() {

    // First, erase all previous groups and objects
    document.getElementById('current-page-content').remove()
    const pageContent = createSVGElement('g');
    pageContent.id = 'current-page-content';
    document.getElementById('current-page-svg').appendChild(pageContent);

    for (let i = 0; i < wordNumber; i++) {
        // Create a group for each row
        const row = createSVGElement('g');
        row.id = `row${i}-group`;
        pageContent.appendChild(row);
        // Add a picture
        const picture = createSVGElement('text');
        picture.classList.add('picture', `row${i}`);
        picture.innerHTML = wordList[i]['emoji'];
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
            letter.innerHTML = wordList[i]['word'][j].toUpperCase();
            row.appendChild(letter);
        }
    }
}

/* Update the puzzle's geometry with the global variable values. */
function updatePuzzleGeometry() {
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
        wordNumber + gapVertical * (wordNumber - 1)
    );
    const circleWidth = availableWidth / (
        1 + gapPicture + wordLength + gapHorizontal * (wordLength - 1)
    );
    const circleSize = Math.min(circleHeight, circleWidth);
    const circleRadius = circleSize / 2;

    // Update each picture and circle
    for (let i = 0; i < wordNumber; i++) {
        const picture = document.querySelector(`.picture.row${i}`);
        picture.setAttribute('x', (marginLeft + paddingLeft) * scale);
        picture.setAttribute('y', scale * (
            marginTop
            + paddingTop
            + i * (1+gapVertical) * circleSize
            + pictureScale * circleSize
        ));
        picture.style.fontSize = appendPx(circleSize * pictureScale * scale);
        for (let j = 0; j < wordLength; j++) {
            const circle = document.querySelector(`.circle.row${i}.col${j}`);
            circle.setAttribute('cx', scale * (
                marginLeft
                + paddingLeft
                + circleSize
                + gapPicture * circleSize
                + j * (1+gapHorizontal) * circleSize
                + circleRadius
            ));
            circle.setAttribute('cy', scale * (
                marginTop
                + paddingTop
                + i * (1+gapVertical) * circleSize
                + circleRadius
            ));
            circle.setAttribute('r', scale * circleRadius);
            circle.setAttribute('stroke-width',
                circleSize * strokeThickness * scale);
            const letter = document.querySelector(`.letter.row${i}.col${j}`);
            letter.setAttribute('x', scale * (
                marginLeft
                + paddingLeft
                + circleSize
                + gapPicture * circleSize
                + j * (1+gapHorizontal) * circleSize
                + circleRadius
            ));
            letter.setAttribute('y', scale * (
                marginTop
                + paddingTop
                + i * (1+gapVertical) * circleSize
                + circleRadius
            ));
            letter.style.fontSize = appendPx(letterScale * circleSize * scale);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ------- GENERAL SET UP -------
    // Set up the color selector widget
    Coloris({
        alpha: false,
        theme: 'polaroid',
    })

    // ---- PUZZLE INITIAL VALUES ---
    // Set the page color to the color currently selected in the dialog
    document.getElementById('current-page-svg')
        .style.backgroundColor = document.getElementById('bg-color').value;
    // Update page dimensions
    const selectedValue = document.getElementById('document-size').value.split('x');
    const [selectedWidth, selectedHeight] = selectedValue;
    documentWidth = parseFloat(selectedWidth);
    documentHeight = parseFloat(selectedHeight);
    updateDocumentSize();
    updatePageMargins();
    updatePuzzleContents();
    updatePuzzleGeometry();

    // --- PUZZLE DYNAMIC CONTROLS --
    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        document.getElementById('current-page-svg')
            .style.backgroundColor = pickEvent.detail.color;
    })
    // Change page dimensions when a new format is selected
    document.getElementById('document-size').addEventListener('change', () => {
        const selectedValue = document.getElementById('document-size').value.split('x');
        const [selectedWidth, selectedHeight] = selectedValue;
        documentWidth = parseFloat(selectedWidth);
        documentHeight = parseFloat(selectedHeight);
        console.log(documentWidth, documentHeight);
        updateDocumentSize();
        updatePageMargins();
        updatePuzzleGeometry();
    })
})
