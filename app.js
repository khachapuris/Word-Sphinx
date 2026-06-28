document.addEventListener('DOMContentLoaded', () => {
    // Set up the color selector widget
    Coloris({
        alpha: false,
        theme: 'polaroid',
    })

    // Set the page color to the color currently selected in the dialog
    document.getElementById('current-page-svg')
        .style.backgroundColor = document.getElementById('bg-color').value;

    // Change page color when a new color is selected
    document.addEventListener('coloris:pick', pickEvent => {
        document.getElementById('current-page-svg')
            .style.backgroundColor = pickEvent.detail.color;
    })
})
