/**
 * PicoTagEditor constructor function.
 * Initializes the tag editor, allowing users to add, edit, and remove tags.
 * The tag editor is created by transforming an existing input element into an interactive tag editor interface.
 *
 * @param {HTMLElement} input - The input element that will be transformed into a tag editor.
 * @param {Object} options - Optional settings to customize the behavior of the tag editor.
 * @param {boolean} options.debug - Flag to enable or disable debugging features.
 * @param {string|number} options.width - Width of the tag editor (supports both string and numeric values).
 * @param {string|number} options.height - Height of the tag editor (supports both string and numeric values).
 * @param {string|number} options.maxHeight - Maximum height for the tag editor (supports both string and numeric values).
 */
function PicoTagEditor(input, options) {
    /**
     * @type {Object} settings - The configuration settings for the tag editor.
     * @property {boolean} debug - Flag to enable or disable debugging features.
     * @property {string|number} width - Width of the tag editor container.
     * @property {string|number} height - Height of the tag editor container.
     * @property {string|number} maxHeight - Maximum height of the tag editor container.
     */
    this.settings = {
        debug: false,
        width: undefined,
        height: undefined,
        maxHeight: undefined
    };

    /**
     * @type {HTMLElement|null} containerElement - The main container element for the tag editor.
     */
    this.containerElement = null;

    /**
     * @type {string} name - The name attribute for the input field used for hidden input fields of tags.
     */
    this.name = '';

    /**
     * @type {boolean} mouseEnter - Flag to track if the mouse has entered the tag editor container.
     */
    this.mouseEnter = false;

    /**
     * Initializes the tag editor by creating the necessary HTML elements
     * and transferring attributes from the original input element to the new elements.
     *
     * @param {HTMLElement} input - The input element that will be transformed into the tag editor.
     */
    this.init = function(input) {
        // Get the required attributes from the input element
        const name = input.getAttribute('name');
        const id = input.getAttribute('id');
        const className = input.getAttribute('class');
        const placeholder = input.getAttribute('placeholder');

        // Create the outer container for the tag editor
        const tagEditorDiv = document.createElement('div');
        tagEditorDiv.classList.add('pico-tag-editor');

        // Create a new input field with the same attributes as the original input
        const newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        this.name = name; // Store the name attribute for later use
        if (id) {
            newInput.setAttribute('id', id);
        }
        newInput.setAttribute('class', className);
        if (placeholder) {
            newInput.setAttribute('placeholder', placeholder);
        }

        // Create a container for the tags
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');
        tagsContainer.style.display = 'none'; // Initially hide the tag container
        
        // Apply custom styles for width, height, and maxHeight if provided
        if (typeof this.settings.width != 'undefined') {
            let width = this.settings.width;
            if (this.isNumber(width)) {
                width += 'px';
            }
            tagsContainer.style.width = width;
        }
        if (typeof this.settings.height != 'undefined') {
            let height = this.settings.height;
            if (this.isNumber(height)) {
                height += 'px';
            }
            tagsContainer.style.height = height;
        }
        if (typeof this.settings.maxHeight != 'undefined') {
            let maxHeight = this.settings.maxHeight;
            if (this.isNumber(maxHeight)) {
                maxHeight += 'px';
            }
            tagsContainer.style.maxHeight = maxHeight;
        }

        // Append the new elements to the tag editor container
        tagEditorDiv.appendChild(newInput);
        tagEditorDiv.appendChild(tagsContainer);

        // Replace the original input element with the new tag editor
        input.replaceWith(tagEditorDiv);
        this.containerElement = tagEditorDiv; // Store a reference to the container
    }

    /**
     * Utility function to check if a string represents a valid number.
     *
     * @param {string} str - The string to check.
     * @returns {boolean} - True if the string is a valid number, false otherwise.
     */
    this.isNumber = function(str) {
        const regex = /^-?\d+(\.\d+)?$/;
        return regex.test(str);
    }

    /**
     * Adds event listeners to the tag editor input field for handling keypress, focus, and blur events.
     * Also, manages mouse enter and leave events for handling focus behavior.
     */
    this.addEvent = function() {
        // Add an event listener for the Enter key to add a tag
        this.containerElement.querySelector('.pico-tag-edit').addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && event.target.value.trim() !== '') {
                _this.addTag(_this.name, event.target.value);
                event.target.value = ''; // Reset the input field after adding a tag
            }
        });

        // Add an event listener for focus to set focus attribute
        this.containerElement.querySelector('.pico-tag-edit').addEventListener('focus', function(event) {
            _this.containerElement.setAttribute('data-focus', 'true');
        });

        // Add an event listener for blur to set focus attribute (debug mode check)
        this.containerElement.querySelector('.pico-tag-edit').addEventListener('blur', function(event) {
            _this.containerElement.setAttribute('data-focus', _this.settings.debug || _this.mouseEnter ? 'true' : 'false');
        });

        // Add event listeners for mouse enter and leave to track focus behavior
        this.containerElement.addEventListener('mouseenter', function(event){
            _this.mouseEnter = true;
        });

        this.containerElement.addEventListener('mouseleave', function(event){
            _this.mouseEnter = false;
        });
    }

    /**
     * Adds a new tag to the tag editor and appends it to the tags container.
     * Each tag is associated with a hidden input field to store its value.
     *
     * @param {string} name - The name attribute for the tag's hidden input field.
     * @param {string} tagText - The text value of the tag to be added.
     */
    this.addTag = function(name, tagText) {
        const tagContainer = this.containerElement.querySelector('.tags-container');

        // Create a new tag element
        const tag = document.createElement('div');
        tag.classList.add('pico-tag');
        tag.textContent = tagText;

        // Create a hidden input field to store the tag value
        let inputHidden = document.createElement('input');
        inputHidden.setAttribute('type', 'hidden');
        inputHidden.setAttribute('name', name + '[]');
        inputHidden.value = tagText;
        tag.appendChild(inputHidden);

        // Create a span to allow removing the tag
        const removeSpan = document.createElement('span');
        removeSpan.innerHTML = '&times;'; // '×' symbol for removing the tag
        removeSpan.addEventListener('click', (event) => {
            tagContainer.removeChild(tag); // Remove the tag when clicked
            _this.containerElement.querySelector('input[type="text"]').focus(); // Focus back on the input field
            if(tagContainer.querySelector('.pico-tag') == null)
            {
                tagContainer.style.display = 'none'; // Hide tag container if no tags are left
            }
        });

        tag.appendChild(removeSpan);
        tagContainer.appendChild(tag); // Append the tag to the container
        tagContainer.style.display = ''; // Ensure the tag container is visible
    }

    // Store reference to the current object
    let _this = this;

    // If options are provided, merge them with the default settings
    if (typeof options !== 'undefined') {
        this.settings = { ...this.settings, ...options };
    }

    // Initialize the editor and add event listeners
    this.init(input);
    this.addEvent();
}



const inputElements = document.querySelectorAll('input.pico-tag-edit');

// Iterasi melalui setiap elemen input yang ditemukan
inputElements.forEach(input => {
    new PicoTagEditor(input, {width:240, maxHeight: 120});//NOSONAR
});
