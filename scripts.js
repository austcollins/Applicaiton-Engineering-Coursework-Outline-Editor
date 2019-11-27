// Listen for clicks, if outline item is clicked, save reference to that item
var currentOutlineItem;
function selectorManager(event) {
  if (currentOutlineItem) {
    currentOutlineItem.classList.remove('selected');
    currentOutlineItem = '';
  }
  if (event.target.classList.contains('outline-item')) {
    currentOutlineItem = event.target;
    currentOutlineItem.classList.add('selected');
    currentOutlineItem.addEventListener("keydown", keyManager);
  }
}
document.addEventListener("click", selectorManager);

// Clear the default outline item when first clicked
document.getElementById('default').addEventListener("click", event => {
  event.target.id = '';
  event.target.innerText = '';
}, { once: true });

// handles what to do when a key is pressed while an outline-item is selected
function keyManager(event) {
  // reccomended as per the documentation
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  // decide what to do when a key is pressed
  if (event.keyCode === 13) { // enter pressed
    event.preventDefault();
    if (currentOutlineItem.innerText === '' && currentOutlineItem.dataset.level > 0 && !event.shiftKey) {
      currentOutlineItem.dataset.level--;
      currentOutlineItem.style.marginLeft = 50*currentOutlineItem.dataset.level+"px";
    } else {
      newOutlineItem();
    }
  } else if (event.keyCode === 8) { // backspace pressed
    // if empty and not the only outline item, delete it
    // holding the shift key allows you to delete even if full
    console.log('""'+currentOutlineItem.innerText+'""');
    if (!currentOutlineItem.innerText || event.shiftKey) {
      event.preventDefault();
      if (document.getElementsByClassName('outline-item').length > 1) {
        // Remove the outline item and move to the previous one
        var prevOutlineItem = currentOutlineItem.previousElementSibling;
        // if there is no previous outline item move to the next one
        if (currentOutlineItem.previousElementSibling == null) { // using == covers both null and undefined
          prevOutlineItem = currentOutlineItem.nextElementSibling;
        }
        currentOutlineItem.parentNode.removeChild(currentOutlineItem);
        currentOutlineItem = prevOutlineItem;
        currentOutlineItem.click();
        currentOutlineItem.focus();
        // Move cursor to the end of the element
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
      } else {
        // if last element, shift+delete will clear it
        currentOutlineItem.innerText = "";
      }
    }
  } else if (event.keyCode === 9) { // tab pressed
    event.preventDefault();
    if (event.shiftKey && currentOutlineItem.dataset.level > 0) {
      currentOutlineItem.dataset.level--;
      // TODO: check child elements
    } else if (currentOutlineItem.dataset.level < 5) { // limited to 6 (H1-6)
      currentOutlineItem.dataset.level++;
      // TODO: check child elements
    }
    currentOutlineItem.style.marginLeft = 50*currentOutlineItem.dataset.level+"px";
  }
}

// inserts a new outline item under the currentOutlineItem
function newOutlineItem() {
  var newOutlineItem = document.createElement("span");
  newOutlineItem.classList.add('outline-item');
  newOutlineItem.contentEditable = true;
  newOutlineItem.dataset.level = currentOutlineItem.dataset.level;
  newOutlineItem.style.marginLeft = 50*newOutlineItem.dataset.level+"px";
  newOutlineItem.draggable=true;
  // insert newOutlineItem after currentOutlineItem
  currentOutlineItem.parentNode.insertBefore(newOutlineItem, currentOutlineItem.nextSibling);

  // move to new item now it has been created
  newOutlineItem.focus();
  newOutlineItem.click();
  newOutlineItem.value = newOutlineItem.value;
}
