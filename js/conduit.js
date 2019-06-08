// conduit main bootstrap file

(function() {
  function setHTML(target, html) {
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
  
  function stringifyForm(data) {
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
  
  function ajax(method, url, form, successCallback, failureCallback) {
    if(!failureCallback) failureCallback = function(response) {
      console.error('AJAX request failed: ', response);
    };
    var xhr = new XMLHttpRequest();
    url += stringifyForm(form);
    xhr.onreadystatechange = function() {
      if(this.readyState != 4) return;
      if(this.status == 200) successCallback(this.responseText);
      else failureCallback(this);
    };
    xhr.open(method, url, true);
    xhr.send();
  }

  window.conduit = {
    ajax: ajax,
    setHTML: setHTML
  }
})();
