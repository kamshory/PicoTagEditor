# PicoTagEditor

PicoTagEditor is a lightweight, customizable tag editor that allows users to add, edit, and remove tags in a user-friendly interface. It transforms a simple input element into a tag editor where tags can be created and removed dynamically. This editor is ideal for use in forms where multiple tags (such as categories, labels, or keywords) need to be added by the user.

## Features
- Add tags by typing and pressing "Enter"
- Remove tags by clicking the "×" button on each tag
- Customizable width, height, and maximum height for the editor
- Support for debugging mode to help with development
- Transforms a regular HTML input element into a tag editor

## Example

Add the following script tag to your HTML:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tag Editor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    
    <div class="input-bar">
        <input type="text" class="pico-tag-edit" name="customer1" placeholder="Add tag...">
        <input type="text" class="pico-tag-edit" name="customer2" placeholder="Add tag...">
        <input type="text" class="pico-tag-edit" name="customer3" placeholder="Add tag...">
    </div>
    <script src="script.js"></script>
</body>
</html>
```
