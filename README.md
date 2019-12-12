# Applicaiton-Engineering-Coursework-Outline-Editor
AppEng Coursework (2019): A web application which allows quick outline editing for taking lecture notes/preparing documents.

## How to use the application
The application is designed to be as intuitive as possible, but there are some simple key commands for shortcuts/advanced users.

### Getting started
1. When you first load the application a blank outline will load called 'Untitled Outline'.
2. You can click the title to change it.
2. Then click the default header to select it, as indicated on the page.
3. Enter your first header.

#### Creating a new header
Press <kbd>ENTER</kbd> to create a new header below the one currently selected.

If you do this and the header you have selected is empty it will move the current header down a level. This is designed to be like creating lists in Word or Google Forms. If you want to leave an empty header simply hold <kbd>TAB</kbd> and press <kbd>ENTER</kbd> to stay on the same level.

#### Moving up and down levels
There are two ways to move up and down levels:
- Keyboard shortcuts
  1. Select the item you want to move.
  2. Press <kbd>TAB</kbd> to increase the level.
  3. Press <kbd>SHIFT</kbd> + <kbd>TAB</kbd> to decrease the level.
- The toolbar
  1. Select the item you want to move.
  2. Select the desired level from the dropdown in the toolbar.
  3. Or use the arrows in the toolbar to step between levels.
  
#### Moving a header
1. You can move a header by dragging it with the green arrow.
2. As you drag the header, a space will open to indicate where you are about to drop it.
3. Drop the header when a space opens up to move it.
4. To cancel the drag just drag it to a place where it cannot be dropped.

#### Deleting a header
A header will be deleted if it has no content and the <kbd>BACKSPACE</kbd> key is pressed.

Pressing <kbd>SHIFT</kbd> + <kbd>BACKSPACE</kbd> will delete the header even if it has content.

#### Rich text editing
The text within your header can be styled using Bold, Italic, or Underline.

To do this:
1. Select the header.
2. Highlight the text you want to style.
3. Use the <kbd>B</kbd>, <kbd>U</kbd>, <kbd>I</kbd> buttons in the toolbar to apply/remove styles.

### Saving and Opening outlines
To save your outline click the <kbd>Save</kbd> button, a notificaiton will confirm if this was successful.

When you visit the applicaiton it will open your last edited outline, if one is saved. To open a different outline, click the open button and select the outline you wish to edit from the menu.

### Deleting an outline
To delete an outline:
1. Open the outline you wish to delete.
2. Click the <kbd>Delete</kbd> button.
A notification will confirm the outline was deleted. The application will automatically load another saved outline, or if no other outlines are saved a new outline will be loaded.



## Unfinished and future work
Below are some features I did not have time to implement into the application.

### Saving and Loading saved outlines to the users computer.
- The ability to export one or all of the saved outlines as JSON files so they can store them on a USB/Computer.
- The ability to open an outline from the users computer.
- The ability to drag a save file to the screen and open it.

### Exporting and Importing outlines to different formats.
- Using the current JSON save format as an intermediate, I wanted to create functions which could convert to and from different formats.
- This would mean the user could import a Markdown file, edit the contextual points and export as a word/html file if they wish.


