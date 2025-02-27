/**
 * PicoTagEditor constructor function.
 * Initializes the tag editor, transforming an input element into an interactive tag manager.
 * Users can add, edit, and remove tags dynamically.
 *
 * @param {HTMLElement} input - The input element to be transformed into a tag editor.
 * @param {Object} [options={}] - Optional configuration settings.
 * @param {boolean} [options.debug=false] - Enables or disables debugging features.
 * @param {string|number} [options.width] - The width of the tag editor container.
 * @param {string|number} [options.height] - The height of the tag editor container.
 * @param {string|number} [options.maxHeight] - The maximum height of the tag editor container.
 * @param {boolean} [options.trimInput=false] - Flag to trim input.
 * @param {Function} [callback] - A function to execute after initialization.
 */
function PicoTagEditor(input, options, callback) {
    options = options || {};
    /**
     * Configuration settings for the tag editor.
     * @type {Object}
     * @property {boolean} debug - Debug mode status.
     * @property {string|number} width - Width of the tag editor.
     * @property {string|number} height - Height of the tag editor.
     * @property {string|number} maxHeight - Maximum height of the tag editor.
     */
    this.settings = {
        debug: false,
        width: undefined,
        height: undefined,
        maxHeight: undefined,
        trimInput: false,
        ...options // Merge user-defined options
    };

    /**
     * Main container element for the tag editor.
     * @type {HTMLElement|null}
     */
    this.containerElement = null;

    /**
     * Name attribute for hidden input fields storing tag values.
     * @type {string}
     */
    this.name = '';

    /**
     * Tracks mouse hover status over the tag editor container.
     * @type {boolean}
     */
    this.mouseEnter = false;

    /**
     * Input field for entering new tags.
     * @type {HTMLElement|null}
     */
    this.inputElement = null;

    /**
     * Initializes the tag editor, transforming the original input field into an interactive tag manager.
     *
     * @param {HTMLElement} input - The input element to transform.
     */
    this.init = function (input) {
        // Create the tag editor container
        const tagEditorDiv = document.createElement('div');
        tagEditorDiv.classList.add('pico-tag-editor');

        // Clone the original input field
        const newInput = input.cloneNode(true);

        // Create a container for tags
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');
        tagsContainer.style.display = 'none'; // Initially hidden

        // Apply custom styles if defined in settings
        if (this.settings.width) {
            tagsContainer.style.width = this.isNumber(this.settings.width) ? `${this.settings.width}px` : this.settings.width;
        }
        if (this.settings.height) {
            tagsContainer.style.height = this.isNumber(this.settings.height) ? `${this.settings.height}px` : this.settings.height;
        }
        if (this.settings.maxHeight) {
            tagsContainer.style.maxHeight = this.isNumber(this.settings.maxHeight) ? `${this.settings.maxHeight}px` : this.settings.maxHeight;
        }

        // Append elements to the tag editor container
        tagEditorDiv.appendChild(newInput);
        tagEditorDiv.appendChild(tagsContainer);

        // Replace the original input with the new tag editor
        input.replaceWith(tagEditorDiv);
        this.containerElement = tagEditorDiv;
        this.inputElement = newInput;
    };

    /**
     * Checks if a given value is a number.
     *
     * @param {string|number} value - The value to check.
     * @returns {boolean} True if the value is a valid number, otherwise false.
     */
    this.isNumber = function (value) {
        return /^-?\d+(\.\d+)?$/.test(value);
    };

    /**
     * Attaches event listeners for handling tag input and interaction.
     */
    this.addEvents = function () {
        const inputField = this.containerElement.querySelector('.pico-tag-edit');

        if (!inputField) return;

        // Handle "Enter" keypress to add a new tag
        inputField.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && event.target.value.trim() !== '') {
                let value = event.target.value;
                if(_this.settings.trimInput)
                {
                    value = value.trim();
                }
                _this.addTag(_this.name, value);
                event.target.value = ''; // Clear input field after adding tag
            }
        });

        // Handle focus state changes
        inputField.addEventListener('focus', function () {
            _this.containerElement.setAttribute('data-focus', 'true');
        });

        inputField.addEventListener('blur', function () {
            _this.containerElement.setAttribute('data-focus', _this.settings.debug || _this.mouseEnter ? 'true' : 'false');
        });

        // Track mouse enter and leave events for focus handling
        this.containerElement.addEventListener('mouseenter', function () {
            _this.mouseEnter = true;
        });

        this.containerElement.addEventListener('mouseleave', function () {
            _this.mouseEnter = false;
        });
    };

    /**
     * Adds a new tag to the tag editor.
     *
     * @param {string} name - The name attribute for the tag's hidden input field.
     * @param {string} tagText - The text content of the new tag.
     */
    this.addTag = function (name, tagText) {
        const tagContainer = this.containerElement.querySelector('.tags-container');

        // Create a new tag element
        const tag = document.createElement('div');
        tag.classList.add('pico-tag');
        tag.textContent = tagText;

        // Ensure the name format supports array-like inputs
        if (!name.includes('[')) {
            name += '[]';
        }

        // Create hidden input field to store the tag value
        const inputHidden = document.createElement('input');
        inputHidden.type = 'hidden';
        inputHidden.name = name;
        inputHidden.value = tagText;
        tag.appendChild(inputHidden);

        // Create a remove button for the tag
        const removeSpan = document.createElement('span');
        removeSpan.innerHTML = '&times;'; // "×" symbol for removing tags
        removeSpan.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            tagContainer.removeChild(tag); // Remove tag on click
            _this.containerElement.querySelector('.pico-tag-edit').focus(); // Refocus input

            // Hide container if no tags remain
            if (!tagContainer.querySelector('.pico-tag')) {
                tagContainer.style.display = 'none';
            }
        });

        tag.appendChild(removeSpan);
        tagContainer.appendChild(tag);
        tagContainer.style.display = ''; // Ensure the tag container is visible
    };

    // Store reference to the current instance
    let _this = this;

    // Initialize the editor, apply user settings, and bind events
    this.init(input);
    if (callback) {
        callback(this.inputElement);
    }
    this.addEvents();
}
