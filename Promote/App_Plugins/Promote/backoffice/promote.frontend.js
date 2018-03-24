(function() {
  'use strict';

  var n = document.querySelectorAll('promote-node');

  n && n.forEach(function (m) {
    var a = m.dataset.attach, t = document.querySelector(m.dataset.selector);

    if (t && a) {
      switch (a) {
        case 'first':
          t.insertBefore(m.children[0], t.firstChild);
          break;
        case 'last':
          t.appendChild(m.children[0]);
          break;
        case 'before':
          t.parentNode.insertBefore(m.children[0], t);
          break;
        default:
          t.parentNode.insertBefore(m.children[0], t.nextSibling);
      }
    }

    m.parentNode.removeChild(m);
  });  

}());