// ------ PUZZLE PARAMETERS -----
// Scale shows the amount of pixels displayed for each millimeter
let scale = 2;
// The following values are in mm
let documentWidth = 210;
let documentHeight = 297;
let marginTop = 25.4;
let marginInside = 19;
let marginOutside = 19;
let marginBottom = 19;

/* Transform a number into a string that ends with 'px' */
function appendPx(n) {
    return `${n}px`
}

/* Update the page margins in the SVG to the current values of the respective
 * global variables */
function updatePageMargins() {
    const topLine = document.getElementById('top-margin-line');
    const insideLine = document.getElementById('inside-margin-line');
    const outsideLine = document.getElementById('outside-margin-line');
    const bottomLine = document.getElementById('bottom-margin-line');
    topLine.setAttribute("y1", marginTop * scale)
    topLine.setAttribute("y2", marginTop * scale)
    topLine.setAttribute("x1", 0)
    topLine.setAttribute("x2", documentWidth * scale)
    insideLine.setAttribute("x1", marginInside * scale)
    insideLine.setAttribute("x2", marginInside * scale)
    insideLine.setAttribute("y1", 0)
    insideLine.setAttribute("y2", documentHeight * scale)
    outsideLine.setAttribute("x1", (documentWidth - marginOutside) * scale)
    outsideLine.setAttribute("x2", (documentWidth - marginOutside) * scale)
    outsideLine.setAttribute("y1", 0)
    outsideLine.setAttribute("y2", documentHeight * scale)
    bottomLine.setAttribute("y1", (documentHeight - marginBottom) * scale)
    bottomLine.setAttribute("y2", (documentHeight - marginBottom) * scale)
    bottomLine.setAttribute("x1", 0)
    bottomLine.setAttribute("x2", documentWidth * scale)
}

/* Update the height and width of the SVG preview to the current values of the
 * respective global variables */
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
    updatePageMargins();
    updateDocumentSize();

    // --- PUZZLE DYNAMIC CONTROLS --
    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        document.getElementById('current-page-svg')
            .style.backgroundColor = pickEvent.detail.color;
    })
})
