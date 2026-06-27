document.addEventListener('DOMContentLoaded', () => {
    // Set up the color selector widget
    Coloris({
        alpha: false,
        theme: 'polaroid',
    })
    // Change page color when a new color is selected
    document.getElementById('bg-color').addEventListener('change', () => {
        let newColor = document.getElementById('bg-color').value;
        document.getElementById('current-page-svg')
            .style.backgroundColor = newColor;
    })
})
