// Listen for clicks, if outline item is clicked, save reference to that item
var currentOutlineItem;
function selectorManager(event) {
  // Unselect currentOutline item if clicked elsewhere,
  // unless selecting something in the toolbar
  if (currentOutlineItem
      && event.target.parentNode.id != "toolbar"
      && event.target.id != "toolbar") {
    currentOutlineItem.classList.remove('selected');
    currentOutlineItem = '';
  }
  // if an outline-item is selected, select it
  if (event.target.classList.contains('outline-item')) {
    currentOutlineItem = event.target;
    currentOutlineItem.classList.add('selected');
    currentOutlineItem.addEventListener("keydown", keyManager);
    // update toolbar settings to new item
    document.getElementById("level-selector").value = currentOutlineItem.dataset.level;
  }
}
document.addEventListener("click", selectorManager);

// Clear the default outline item when first clicked
currentOutlineItem = document.getElementById('default');
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

  // decide what to do when a key is pressed.
  if (event.keyCode === 13) { // enter pressed
    event.preventDefault();
    if (currentOutlineItem.innerText === '' && currentOutlineItem.dataset.level > 0 && !event.shiftKey) {
      currentOutlineItem.dataset.level--;
      currentOutlineItem.style.marginLeft = 50*currentOutlineItem.dataset.level+"px";
    } else {
      createNewOutlineItem(null, currentOutlineItem.dataset.level);
    }
  } else if (event.keyCode === 8) { // backspace pressed
    // if empty and not the only outline item, delete it
    // holding the shift key allows you to delete even if full
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

// handles using the dropdown level selector
function levelSelectorManager(event) {
  if (currentOutlineItem) {
    currentOutlineItem.dataset.level = event.target.value;
    currentOutlineItem.style.marginLeft = 50*currentOutlineItem.dataset.level+"px";
  } else {
    // tell user to select an item
  }
}
document.getElementById('level-selector').addEventListener("change", levelSelectorManager);

// inserts a new outline item under the currentOutlineItem
function createNewOutlineItem(innerText, level) {
  var newOutlineItem = document.createElement("span");
  newOutlineItem.classList.add('outline-item');
  newOutlineItem.contentEditable = true;
  newOutlineItem.innerText = innerText;
  newOutlineItem.dataset.level = level;
  newOutlineItem.style.marginLeft = 50*newOutlineItem.dataset.level+"px";
  newOutlineItem.draggable=true;
  addOutlineDragEvents(newOutlineItem);
  // insert newOutlineItem after currentOutlineItem
  currentOutlineItem.parentNode.insertBefore(newOutlineItem, currentOutlineItem.nextSibling);

  // move to new item now it has been created
  newOutlineItem.focus();
  newOutlineItem.click();
  newOutlineItem.value = newOutlineItem.value;
}


//
// Dragging
//
//
var currentDraggingItem;
function addOutlineDragEvents(outlineItem) {
  outlineItem.addEventListener("dragstart", outlineOnDragManager);
  outlineItem.addEventListener("dragover", outlineDragOverManager);
  outlineItem.addEventListener("dragenter", outlineDragEnterManager);
  outlineItem.addEventListener("dragleave", outlineDragLeaveManager);
  outlineItem.addEventListener("drop", outlineOnDropManager);
}
function outlineOnDragManager(event) {
  if (event.target.classList.contains('outline-item')) {
    event.target.addEventListener("dragend", outlineDragEndManager);
    currentDraggingItem = event.target;
  }
}
function outlineDragOverManager(event) {
  if (event.target.classList.contains('outline-item')) {
    event.preventDefault();
  }
}
function outlineDragEnterManager(event) {
  if (event.target.classList.contains('outline-item')) {
    event.preventDefault();
    if (!event.target.classList.contains('oi-drag-target')) {
      event.target.classList.add('oi-drag-target');
    }
  }
}
function outlineDragLeaveManager(event) {
  if (event.target.classList.contains('outline-item')) {
    event.preventDefault();
    if (event.target.classList.contains('oi-drag-target')) {
      event.target.classList.remove('oi-drag-target');
    }
  }
}
function outlineOnDropManager(event) {
  if (event.target.classList.contains('outline-item')) {
    event.preventDefault();
    let targetOutlineItem = event.target;
    targetOutlineItem.parentNode.insertBefore(currentDraggingItem, targetOutlineItem.nextSibling);
  }
}
function outlineDragEndManager(event) {
  // removes .oi-drag-target if the element is dropped or the drag is cancelled
  for (elem of document.getElementsByClassName('oi-drag-target')) {
    elem.classList.remove('oi-drag-target');
  }
}
addOutlineDragEvents(document.getElementById('default'));


//
// Notifications
//
// - These are designed to give tips+tricks in an unintrusive way
//
// - Format of element shown below
// <div class="notification">
//  <span class="header">${header}</span>
//  <span class="content">${content}</span>
// </div>
//
// - Notificaitons will be shown for two seconds, and then are faded out and deleted.
//
function pushNotificaiton(header, content, displayTime = 2000){
  let notification = document.createElement("div");
  notification.classList.add('notification');
  let headerElem = document.createElement("span");
  headerElem.classList.add('header');
  headerElem.innerText = header;
  notification.appendChild(headerElem);
  let contentElem = document.createElement("span");
  contentElem.classList.add('content');
  contentElem.innerText = content;
  notification.appendChild(contentElem);
  document.getElementById('notifications').appendChild(notification);
  // manage timeout
  setTimeout(function(n) {
    fadeDeleteElement(n);
  }, displayTime, notification);
};
// function to animate an element sliding off the right of the page
function fadeDeleteElement(element) {
  var fadeEffect = setInterval(function (element) {
        if (!element.style.opacity) { element.style.opacity = 1; }
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
            element.parentNode.removeChild(element);
        }
    }, 50, element);
}



// For testing purposes
createNewOutlineItem("Cool Document by Ausin Collins", 0);
createNewOutlineItem("Whats in this document?", 1);
createNewOutlineItem("Cool things", 2);
createNewOutlineItem("Things I think are cool but probably aren't.", 2);
createNewOutlineItem("Reasons I think these things are cool", 3);
createNewOutlineItem("What's not in this document?", 1);
createNewOutlineItem("Things which aren't cool.", 2);
createNewOutlineItem("Things you think are cool but aren't.", 2);
createNewOutlineItem("Reasons they aren't cool.", 3);
createNewOutlineItem("Even more reaons", 4);
createNewOutlineItem("Anything useful.", 2);
// Delete default item after loading as it is used as a reference
let defaultItem = document.getElementById('default');
defaultItem.parentNode.removeChild(defaultItem);
pushNotificaiton("OutlineEditor", "Test outline loaded.");
