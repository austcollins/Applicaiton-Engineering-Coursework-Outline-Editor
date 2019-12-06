/*jshint esversion: 6 */

// returns selected outline item, returns null if none selected
function getCurrentOutlineItem() {
  let currentOutlineItems = document.getElementsByClassName('oi-selected');
  let currentOutlineItem = null;
  // make sure there's only one item selected
  if (currentOutlineItems.length === 1) {
    currentOutlineItem = currentOutlineItems[0];
  } else {
    // if two items selected somehow, deselect everything
    for (let elem of document.getElementsByClassName('oi-selected')) {
      elem.classList.remove('oi-selected');
    }
  }
  return currentOutlineItem;
}

// Manages clicks on the page
function selectorManager(event) {
  // unselect currentOutlineItem, ready to select a new one | unless user is selecting something in the toolbar
  let currentOutlineItem = getCurrentOutlineItem();
  if (currentOutlineItem && event.target.parentNode.id != "toolbar" && event.target.id != "toolbar") {
    currentOutlineItem.classList.remove('oi-selected');
    currentOutlineItem = '';
  }
  // if a new outline-item is clicked, select it
  if (event.target.classList.contains('outline-item')) {
    currentOutlineItem = event.target;
    currentOutlineItem.classList.add('oi-selected');
    // update toolbar settings to new item
    updateSelector();
  }
}
document.addEventListener("click", selectorManager);
// Can be called to update the selector
function updateSelector() {
  let currentOutlineItem = getCurrentOutlineItem();
  document.getElementById("level-selector").value = currentOutlineItem.dataset.level;
}

function increaseLevelButtonPushed() {
  let currentOutlineItem = getCurrentOutlineItem();
  if (currentOutlineItem) {
    increaseLevel(currentOutlineItem);
    updateSelector();
  }
}
function decreaseLevelButtonPushed() {
  let currentOutlineItem = getCurrentOutlineItem();
  if (currentOutlineItem) {
    decreaseLevel(currentOutlineItem);
    updateSelector();
  }
}

// Clear the default outline item when first clicked
document.getElementById('default').addEventListener("click", event => {
  event.target.id = '';
  event.target.innerText = '';
}, { once: true });

// handles what to do when a key is pressed while an outline-item is selected
function keyManager(event) {
  let currentOutlineItem = getCurrentOutlineItem();
  // if nothing selected, do nothing
  if (!currentOutlineItem) return;
  // decide what to do when a key is pressed.
  if (event.keyCode === 13) { // enter pressed
    event.preventDefault();
    // if enter is pressed on an empty outline item && item can be stepped down && user hasn't overidden, step down
    // this is designed to be like creating lists in microsoft word to be as intuitive as possible
    if (currentOutlineItem.innerText === '' && currentOutlineItem.dataset.level > 0 && !event.shiftKey) {
      decreaseLevel(currentOutlineItem);
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
        let prevOutlineItem = currentOutlineItem.previousElementSibling;
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
    if (event.shiftKey) {
      decreaseLevel(currentOutlineItem);
      // TODO: check child elements
    } else {
      increaseLevel(currentOutlineItem);
    }
    updateSelector();
  }
}
document.addEventListener("keydown", keyManager);

function decreaseLevel(outlineItem) {
  if (outlineItem.dataset.level > 0) {
    outlineItem.dataset.level--;
  }
  outlineItem.style.marginLeft = 50*outlineItem.dataset.level+"px";
}
function increaseLevel(outlineItem) {
  if (outlineItem.dataset.level < 5) { // limited to 6 (H1-6)
    outlineItem.dataset.level++;
  }
  outlineItem.style.marginLeft = 50*outlineItem.dataset.level+"px";
}
// handles using the dropdown level selector
function levelSelectorManager(event) {
  let currentOutlineItem = getCurrentOutlineItem();
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
  let currentOutlineItem = getCurrentOutlineItem();
  if (!currentOutlineItem) {
    currentOutlineItem = document.getElementById('outline-items').lastChild;
  }
  let newOutlineItem = document.createElement("span");
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
// -- oi acronym for outline item
//
let currentDraggingItem;
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
  for (let elem of document.getElementsByClassName('oi-drag-target')) {
    elem.classList.remove('oi-drag-target');
  }
}
addOutlineDragEvents(document.getElementById('default'));

//
// Saving/Loading
//
function loadOutline() {
  let saveName = "savedOutline";
  let outlineJSON = localStorage.getItem(saveName);
  if (outlineJSON) {
    console.log(outlineJSON);
    let outline = JSON.parse(outlineJSON);
    console.log(outline);
    if (outline.version === 1.0) {
      for (var outlineItem of outline.outlineItems) {
        createNewOutlineItem(outlineItem.content, outlineItem.level);
      }
      let defaultItem = document.getElementById('default');
      defaultItem.parentNode.removeChild(defaultItem);
      pushNotificaiton("Opened outline", "previous outline loaded...");
    } else {
      pushNotificaiton("Error", "Unable to load previous outline, saved from an old format.");
    }
  } else {
    pushNotificaiton("Unable to load previous outline", "No outline found.");
  }
}

function saveOutline() {
  let outlineItems = document.getElementById('outline-items').children;
  let saveName = "savedOutline";
  let outline = {
    name: saveName,
    version: 1.0, // version of save format
    outlineItems: []
  };
  for (let outlineItem of outlineItems) {
    if (outlineItem.classList.contains('outline-item')) {
      // needs fixing to save bold/underline/italic
      outline.outlineItems.push({level: outlineItem.dataset.level, content: outlineItem.textContent});
    }
  }
  let outlineJSON = JSON.stringify(outline);
  pushNotificaiton("Saved", `All changes have been saved.`);
  localStorage.setItem(saveName, outlineJSON);
}

//
// Exporting
//

// runs when the user requests to export
function startExport() {
  // show export options

}
function stopExport() {
  // hide export options
}
// export the outline as format (html|markup|plaintext)
function exportOutline(format) {
  if (format === "html") {

  } else if (format === "markup") {

  } else if (format === "plaintext") {

  }
}



//
// Notifications
//
// - Format of notification element shown below
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
}
// function to animate an element sliding off the right of the page
function fadeDeleteElement(element) {
  let fadeEffect = setInterval(function (element) {
        if (!element.style.opacity) { element.style.opacity = 1; }
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
            element.parentNode.removeChild(element);
        }
    }, 50, element);
}

//
// HELP PAGE
//

function main() {

}
main();
