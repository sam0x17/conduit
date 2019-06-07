// conduit main bootstrap file

function conduit_setHTML(target, html) {
  target.innerHTML = html;
  var scripts = target.getElementsByTagName('script');
  for(var i = 0; i < scripts.length; ++i) {
    eval(scripts[i].innerHTML);
  }
}
