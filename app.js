// ------ PUZZLE PARAMETERS -----
// Scale shows the amount of pixels displayed for each inch
let scale = 51;
// The following values are in inches
let documentWidth = 8.27;
let documentHeight = 11.69;
let marginTop = 1;
let marginInside = 0.75;
let marginOutside = 0.75;
let marginBottom = 0.75;
let paddingLeft = 0.6;
let paddingRight = 0.6;
let paddingTop = 0.8;
let paddingBottom = 1.2;
// These values depend on page orientation
let marginRight = marginOutside;
let marginLeft = marginInside;
// These values are dimensionless ratios of various elements to the circle size
let gapVertical = 0.60; // gap between rows of circles
let gapHorizontal = 0.15; // gap between columns of circles
let gapPicture = 0.30; // gap between the picture and the circles
let pictureScale = 0.80;
let strokeThickness = 0.035;
// These values are countable numbers
let wordLength = 3;
let wordNumber = 4;
// Miscellaneous

/* Transform a number into a string that ends with 'px' */
function appendPx(n) {
    return `${n}px`
}

/* Update the height and width of the SVG with the global variable values */
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

/* Update the page margins in the SVG with the global variable values */
function updatePageMargins() {
    const topLine = document.getElementById('top-margin-line');
    const leftLine = document.getElementById('left-margin-line');
    const rightLine = document.getElementById('right-margin-line');
    const bottomLine = document.getElementById('bottom-margin-line');
    topLine.setAttribute("y1", marginTop * scale)
    topLine.setAttribute("y2", marginTop * scale)
    topLine.setAttribute("x1", 0)
    topLine.setAttribute("x2", documentWidth * scale)
    leftLine.setAttribute("x1", marginLeft * scale)
    leftLine.setAttribute("x2", marginLeft * scale)
    leftLine.setAttribute("y1", 0)
    leftLine.setAttribute("y2", documentHeight * scale)
    rightLine.setAttribute("x1", (documentWidth - marginRight) * scale)
    rightLine.setAttribute("x2", (documentWidth - marginRight) * scale)
    rightLine.setAttribute("y1", 0)
    rightLine.setAttribute("y2", documentHeight * scale)
    bottomLine.setAttribute("y1", (documentHeight - marginBottom) * scale)
    bottomLine.setAttribute("y2", (documentHeight - marginBottom) * scale)
    bottomLine.setAttribute("x1", 0)
    bottomLine.setAttribute("x2", documentWidth * scale)
}

/* Update the puzzle's geometry with the global variable values */
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
        const picture = document.getElementById(`picture-row${i}`);
        picture.setAttribute('x', (marginLeft + paddingLeft) * scale);
        picture.setAttribute('y', scale * (
            marginTop
            + paddingTop
            + i * (1+gapVertical) * circleSize
            + pictureScale * circleSize
        ));
        picture.style.fontSize = appendPx(circleSize * pictureScale * scale);
        for (let j = 0; j < wordLength; j++) {
            const circle = document.querySelector(
                `.circle-row${i}.circle-col${j}`);
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
    updateDocumentSize();
    updatePageMargins();
    updatePuzzleGeometry();

    // --- PUZZLE DYNAMIC CONTROLS --
    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        document.getElementById('current-page-svg')
            .style.backgroundColor = pickEvent.detail.color;
    })
})
