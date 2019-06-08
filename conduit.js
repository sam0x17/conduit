// conduit main bootstrap file

function conduit_setHTML(target, html) {
  target.innerHTML = html;
  var scripts = target.getElementsByTagName('script');
  for(var i = 0; i < scripts.length; ++i) {
    var script = scripts[i];
    var src = script.src;
    var innerHTML = script.innerHTML;
    var parentNode = script.parentNode;
    parentNode.removeChild(script);
    script = document.createElement('script');
    if(src != '') script.src = src;
    script.innerHTML = innerHTML;
    parentNode.appendChild(script);
  }
}

function conduit_stringifyForm(data) {
  var formItems = [];
  for(var prop in data) {
    if(!form.hasOwnProperty(prop)) continue;
    formItems.push(encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]));
  }
  var url = '';
  if(formItems.length > 0) {
    url += '?' + formItems.join('&');
  }
  return url;
}

function conduit_ajax(method, url, form, successCallback, failureCallback) {
  var xhr = new XMLHttpRequest();
  url += conduit_stringifyForm(form);
  xhr.onreadystatechange = function() {
    if(this.readyState != 4) return;
    if(this.status == 200) successCallback(this.responseText);
    else failureCallback(this);
  };
  xhr.open(method, url, true);
  xhr.send();
}
