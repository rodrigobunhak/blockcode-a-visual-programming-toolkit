// If dragging from script to menu, delete dragTarget (remove block from script).
// If dragging from script to script, move dragTarget (move an existing script block).
// If dragging from menu to script, copy dragTarget (insert new block in script).
// If dragging from menu to menu, do nothing.
var dragTarget = null; // Block we're dragging
var dragType = null; // Are we dragging from the menu or from the script?
var scriptBlocks = []; // block in the script, srted by position

function dragStart(evt) {
  if (!matches(evt.target, '.block')) {
    return;
  }
  if (matches(evt.target, '.menu .block')) {
    dragType = 'menu';
  } else {
    dragType = 'script';
  }
  evt.target.classList.add('dragging');
  dragTarget = evt.target;
  scriptBlocks = [].slice.call(document.querySelectorAll('.script .block:not(.dragging)'));
  // For dragging to take place in Firefox, we have to set this, even if
  // we don't use it
  evt.dataTransfer.setData('text/html', evt.target.outerHTML);
  if (matches(evt.target, '.menu .block')) {
    evt.dataTransfer.effectAllowed = 'copy';
  } else {
    evt.dataTransfer.effectAllowed = 'move';
  }
}

function dargOver(evt) {
  if (!matches(evt.target, '.menu, .menu *, .script, .script *, .content')) {
    return;
  }
  // Necessary. Allows us to drop.
  if (evt.preventDefault) {
    evt.preventDefault();
  }
  if (dragType === 'menu') {
    // See the section on the DataTransfer object.
    evt.dataTransfer.dropEffect = 'copy';
  } else {
    evt.dataTransfer.dropEffect = 'move';
  }
  return false;
}