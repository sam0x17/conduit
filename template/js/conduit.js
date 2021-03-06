// conduit main bootstrap file

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function isFunction(v) { return !!(v instanceof Function); }

(function() {
  var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decode: function(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = Base64._utf8_decode(output);
      return output;
    },
    _utf8_decode: function(utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  }  
  function setHTML(target, html) {
    target.innerHTML = html;
    var scripts = target.getElementsByTagName('script');
    for(var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var src = script.src;
      eval(script.innerHTML);
      if(src) {
        var head = document.getElementsByTagName('head')[0];
        var scriptclone = document.createElement('script');
        scriptclone.src= src;
        head.appendChild(scriptclone);
      }
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

  function triggerOnload() {
    var evt = document.createEvent('Event');  
    evt.initEvent('load', false, false);  
    window.dispatchEvent(evt);
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
    if(format == "/*" || format == "*") return [];
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
      } else if(fpart.startsWith('#')) {
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
    //console.log(currentPath);
    if(redirecting) return;
    if(!virtualNavigation) savedRoutes.push([format, target, title, condition]);
    if(routed) return;
    var matchedParts = matchFormat(format);
    if(!matchedParts) return;
    if(!condition || condition(matchedParts, currentPath)) {
      routed = true;
      //console.log('routed to: ', target + ', title="' + title + '"');
      conduit.pathVariables = matchedParts;
      conduit.currentPath = currentPath;
      //console.log('path variables: ', conduit.pathVariables);
      if(isFunction(target)) {
        target = target(matchedParts, currentPath);
      }
      if(!title) title = defaultTitle;
      setTitle(title);
      var html = conduit.VIEWS[target];
      if(html === null || html === undefined) throw 'could not find pre-compiled template for "' + target + '"';
      html = Base64.decode(html);
      if(virtualNavigation) history.pushState(null, title, currentPath);
      setHTML(document.body, html);
      triggerOnload();
      window.scrollTo(0, 0);
      if(conduit.onNavigate) conduit.onNavigate();
    }
  }

  function redirect(srcPath, destPath) {
    if(currentPath == srcPath) {
      redirecting = true;
      navigate(destPath);
    }
  }

  function linkClickHandler(e) {
    var target = e.target;
    if(target.tagName == 'A' && target.host == window.location.host && e.which == 1) {
      navigate(target.href);
      return e.preventDefault();
    }
    return true;
  }

  function navigate(url) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    if(link.host == window.location.host) { // local
      currentPath = filterPath(link.pathname);
      cparts = currentPath.split('/');
      virtualNavigation = true;
      routed = false;
      for(var i = 0; i < savedRoutes.length; i++) {
        var args = savedRoutes[i];
        route(args[0], args[1], args[2], args[3]);
      }
      virtualNavigation = false;
    } else { // external
      window.location = url;
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

  function setDefaultTitle(title) {
    defaultTitle = title;
  }

  document.addEventListener('click', linkClickHandler);
  window.addEventListener('popstate', function(event) {
    // TODO: restore actual DOM state
    navigate(window.location);
  });
  var virtualNavigation = false;
  var routed = false;
  var redirecting = false;
  var currentPath = getCurrentPath();
  var cparts = currentPath.split('/');
  var savedRoutes = [];
  var defaultTitle = 'Conduit';
  window.conduit = {
    ajax: ajax,
    setHTML: setHTML,
    setMeta: setMeta,
    setTitle: setTitle,
    route: route,
    navigate: navigate,
    setCookie: setCookie,
    getCookie: getCookie,
    clearCookies: clearCookies,
    setDefaultTitle: setDefaultTitle,
    redirect: redirect,
    decode: Base64.decode
  };
})();
