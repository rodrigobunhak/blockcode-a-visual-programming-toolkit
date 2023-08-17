var menu = document.querySelector('.menu');
var script = document.querySelector('.script');
var scriptRegistry = {};
var scriptDirty = false;

function runSoon() {
  scriptDirty = true;
}

function run() {
  if (scriptDirty) {
    scriptDirty = false;
    Block.trigger('beforeRun', script);
    var blocks = [].slice.call(document.querySelectorAll('.script > .block'));
    Block.run(blocks);
    Block.trigger('afterRun', script);
  } else {
    Block.trigger('everyFrame', script);
  }
  requestAnimationFrame(run);
}
requestAnimationFrame(run);

function runEach(evt) {
  var elem = evt.target;
  if (!matches(elem, '.script .block')) return;
  if (elem.dataset.name === 'Define block') return;
  elem.classList.add('running');
  scriptRegistry[elem.dataset.name](elem);
  elem.classList.remove('running');
}