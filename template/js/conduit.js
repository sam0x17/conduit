// conduit main bootstrap file

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

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

  function setMeta(name, content) {
    var metas = document.head.getElementsByTagName('meta');
    for(var i = 0; i < metas.length; i++) {
      var tag = metas[i];
      if(tag.getAttribute('name') == name) {
        tag.setAttribute('content', content);
        return;
      }
    }
    var tag = document.createElement('meta');
    tag.setAttribute('name', name);
    tag.setAttribute('content', content);
    document.head.appendChild(tag);
  }

  function setTitle(title) {
    document.head.getElementsByTagName('title')[0].innerHTML = title;
  }

  function filterPath(path) {
    if(path.endsWith('/')) path = path.substr(0, path.length - 2);
    if(path == '') path = '/';
    return path;
  }

  function getCurrentPath() {
    var path = window.location.pathname;
    return filterPath(path);
  }

  function isDigits(str) {
    for(var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if(code < 48 || code > 57) return false;
    }
    return true;
  }

  function isAlphaName(str) {
    for(var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if(code == 45 || code == 95) continue;
      if(code >= 65 || code <= 90) continue;
      if(code >= 97 || code <= 122) continue;
      return false;
    }
    return true;
  }

  function matchFormat(format) {
    format = filterPath(format);
    var fparts = format.split('/');
    if(fparts.length != cparts.length) return false;
    var matchedParts = {};
    for(var i = 0; i < cparts.length; i++) {
      var cpart = cparts[i];
      var fpart = fparts[i];
      if(cpart == fpart) continue;
      if(fpart.startsWith(':') && isDigits(cpart)) {
        var label = fpart.substr(1, fpart.length - 1);
        matchedParts[label] = parseInt(cpart);
        continue;
      } else if(fpart.startsWith('#') && isAlphaName(cpart)) {
        var label = fpart.substr(1, fpart.length - 1);
        matchedParts[label] = cpart;
        continue;
      }
      return false;
    }
    return matchedParts
  }

  // e.g.: route('/users/:id/#otherpart/', 'blog/entry', 'my page title, function(parts) { return parts.id == 23; })
  function route(format, target, title, condition) {
    if(conduit.routed) return;
    var matchedParts = matchFormat(format);
    if(!matchedParts) return;
    if(!condition || condition(matchedParts, currentPath)) {
      conduit.routed = true;
      console.log('routed to: ', target + ', title="' + title + '"');
      conduit.pathVariables = matchedParts;
      conduit.currentPath = currentPath;
      console.log('path variables: ', conduit.pathVariables);
      document.head.getElementsByTagName('title')[0].innerHTML = title;
      var html = conduit.VIEWS[target];
      if(!html) throw 'could not find pre-compiled template for "' + target + '"';
      html = atob(html);
      setHTML(document.body, html);
    }
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function clearCookies(){
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++){   
      var spcook =  cookies[i].split("=");
      document.cookie = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";                                
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

  var currentPath = getCurrentPath();
  var cparts = currentPath.split('/');
  window.conduit = {
    ajax: ajax,
    setHTML: setHTML,
    setMeta: setMeta,
    setTitle: setTitle,
    route: route,
    setCookie: setCookie,
    getCookie: getCookie,
    clearCookies: clearCookies,
    routed: false
  };
})();
