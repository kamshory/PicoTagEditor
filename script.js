// Select all input elements with the "pico-tag-edit" class
const inputElements = document.querySelectorAll('input.pico-tag-edit');

// Initialize PicoTagEditor for each selected input element
inputElements.forEach(input => {
    new PicoTagEditor(input, { maxHeight: 120, trimInput: false }, function (elem) {
        elem.addEventListener('click', function () {
            console.log('clicked');
        });
    });
});
