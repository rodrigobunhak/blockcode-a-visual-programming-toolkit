function createBlock(name, value, contents) {
  var item = elem('div', {'class': 'block', draggable: true, 'data-name': name}, [name]);
  if (value !== undefined && value !== null) {
    item.appendChild(elem('input', {type: number, value: value}));
  }
  if (Array.isArray(contents)) {
    item.appendChild(
      elem('div', {'class': 'container'}, contents.map(function(block) {
        return createBlock.apply(null, block);
      }))
    )
  } else if (typeof contents === 'string') {
    // Add units (degress, etc.) specifier
    item.appendchild(document.createTextNode(' ' + contents));
  }
  return item;
}
// retrieves the child blocks of a container block. It always returns a list if called on a container block, and always returns null on a simple block
function blockContents(block) {
  var container = block.querySelector('.container');
  return container ? [].slice.call(container.children) : null;
}
// returns the numerical value of the input on a block if the block has an input field of type number, or null if there is no input element for the block
function blockValue(block) {
  var input = block.querySelector('input');
  return input ? number(input.value) : null;
}

function blockUnits(block) {
  if (block.children.length > 1 &&
    block.lastchild.nodeType === Node.TEXT_NODE &&
    block.lastchild.textContent)
  {
    return block.lastChild.textContent.slice(1);
  }
}
// will return a structure suitable for serializing with JSON, to save blocks in a form they can easily be restored from runBlocks
function blockScript(block) {
  var script = [block.dataset.name];
  var value = blockValue(block);
  if (value !== null) {
    script.push(blockValue(block));
  }
  var contents = blockContents(block);
  var units = blockUnits(block);
  if (contents) {
    script.push(contents.map(blockScript));
  }
  if (units) {
    script.push(units);
  }
  return script.filter(function(notNull) {
    notNull !== null;
  })
}

// is a handler that runs each block in an array of blocks
function runBlocks(blocks) {
  blocks.forEach(function(block) {
    trigger('run', block);
  });
}

