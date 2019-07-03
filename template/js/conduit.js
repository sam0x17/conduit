// conduit main bootstrap file

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

Object.prototype.forEachProp = function(callback) {
  Object.keys(this).forEach(function() { callback(prop, this[prop]); });
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
      if(!html) throw 'could not find pre-compiled template for "' + target + '"';
      html = Base64.decode(html);
      if(virtualNavigation) history.pushState(null, title, currentPath);
      setHTML(document.body, html);
      triggerOnload();
      if(window.performance && window.performance.navigation.type != 1) window.scrollTo(0, 0); 
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
    data.forEachProp(function(name, value) {
      formItems.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    });
    var url = '';
    if(formItems.length > 0) {
      url += '?' + formItems.join('&');
    }
    return url;
  }

  function ajax(method, url, form, callback) {
    var xhr = new XMLHttpRequest();
    url += stringifyForm(form);
    xhr.onreadystatechange = function() {
      if(this.readyState != 4) return;
      callback(this.status, this.responseText);
    };
    xhr.open(method, url, true);
    xhr.send();
  }

  function setDefaultTitle(title) {
    defaultTitle = title;
  }

  function defaultAjaxBindings(modelName) {
    var modelBaseUrl = baseApiUrl + modelName + '/';
    var obj = { type: 'ajax/json' };
    ACTIONS.forEach(function(action) {
      obj[action + 'Endpoint'] = { method: 'POST', url: modelBaseUrl + action };
    });
    return obj;
  }

  function hashSet(keys) {
    var obj = {};
    keys.forEach(function(key) { obj[key] = true; });
    rop(obj, 'contains', function(key) { return !!(this[key]); });
    rop(obj, 'remove', function(key) { delete this[key]; });
    rop(obj, 'add', function(key) { this[key] = true; });
    rop(obj, 'clear', function() { this.forEachProp(function(attr) { this.remove(attr); }); });
    return obj;
  }

  var ACTIONS = ['create', 'update', 'delete', 'load', 'enumerate'];
  var RESERVED = hashSet(['model', 'new', 'save', 'validate', 'isNew', 'attributes']);

  // readOnlyProp
  function rop(targetObject, propName, propValue) {
    Object.defineProperty(targetObject, propName, {
      value: propValue,
      enumerable: false,
      writable: false
    });
  }

  function model(name, attributes, validations, filters, triggers, bindings) {
    if(!attributes) attributes = {};
    var attrs = Object.keys(attributes);
    for(var i = 0; i < attrs.length; i++)
      if(RESERVED.contains(attrs[i])) throw attrs[i] + ' is an illegal attribute name';
    if(!validations) validations = {};
    if(!filters) filters = {};
    if(!triggers) triggers = {};
    if(!bindings) bindings = defaultAjaxBindings(name);
    var model = {};
    rop(model, 'name', name);
    rop(model, 'attributes', attributes);
    rop(model, 'validations', validations);
    rop(model, 'filters', filters);
    rop(model, 'triggers', triggers);
    rop(model, 'bindings', bindings);
    rop(model, 'filter', function(attribute, value) {
      if(value === undefined) value = null;
      if(!model.filters[attribute]) return value;
      return model.filters[attribute](value);
    });
    rop(model, 'new', function() {
      var obj = {};
      var dirty = hashSet([]);
      var isNew = true;
      var enableDirtyTracking = true;
      function withoutDirty(callback) { enableDirtyTracking = false; callback(); enableDirtyTracking = true; };
      function markDirty(attribute) { if(enableDirtyTracking) dirty.add(attribute); };
      function trigger(triggerName, p1, p2, p3, p4) { if(trigger = model.triggers[triggerName]) trigger.call(obj, p1, p2, p3, p4); };
      rop(obj, 'model', model);
      rop(obj, 'isNew', function() { return isNew; });
      rop(obj, 'attributes', function() {
        var form = {};
        this.forEachProp(function (attribute, value) {
          form[attribute] = value;
        });
        return form;
      });
      rop(obj, 'validate', function(callback) {
        trigger('beforeValidate');
        var foundFailure = false;
        var totalValidations = 0;
        model.validations.forEachProp(function(_attribute, valids) {
          if(!Array.isArray(valids)) totalValidations += 1;
          else totalValidations += valids.length;
        });
        var num = 0;
        model.validations.forEachProp(function(attribute, valids) {
          if(foundFailure) return;
          var value = obj[attribute];
          if(!Array.isArray(valids)) valids = [valids];
          valids.forEach(function(validation) {
            if(foundFailure) return;
            validation.call(obj, value, function(validity, reason) {
              num += 1;
              if(foundFailure) return;
              if(validity) {
                if(num == totalValidations) {
                  callback(true);
                  trigger('afterValidate', true);
                } else if(num > totalValidations) throw 'invalid state';
              } else {
                callback(validity, attribute, reason);
                trigger('afterValidate', validity, attribute, reason);
                foundFailure = true;
              }
            });
          });
        });
      });
      function create(callback) {
        trigger('beforeCreate');
        trigger('beforeSave');
        obj.validate(function(valid, invalidAttribute, invalidReason) {
          if(!valid) {
            trigger('onCreateFail', 'invalid', invalidAttribute, invalidReason);
            trigger('onSaveFail', 'invalid', invalidAttribute, invalidReason);
            callback(false);
            return;
          }
          if(model.bindings.type == 'ajax/json') {
            var binding = model.bindings.createEndpoint;
            ajax(binding.method, binding.url, obj.attributes(), function(status, response) {
              response ? response = JSON.parse(response) : {};
              if(status == 200) {
                withoutDirty(function() { response.forEachProp(function(attribute, value) { obj[attribute] = value; }); });
                dirty.clear();
                isNew = false;
              }
              callback(status == 200, status, response);
              if(status == 200) {
                trigger('afterCreate');
                trigger('afterSave');
              } else {
                trigger('onCreateFail', 'ajax', status, response);
                trigger('onSaveFail', 'ajax', status, response);
              }
            });
          } else throw 'unsupported model bindings type';
        });
      }
      function update(callback) {
        if(isNew) throw 'update should only be called when isNew is false';
        trigger('beforeUpdate');
        trigger('beforeSave');
        obj.validate(function(valid, invalidAttribute, invalidReason) {
          if(!valid) {
            trigger('onUpdateFail', 'invalid', invalidAttribute, invalidReason);
            trigger('onSaveFail', 'invalid', invalidAttribute, invalidReason);
            callback(false);
            return;
          }
          if(model.bindings.type == 'ajax/json') {
            var binding = model.bindings.updateEndpoint;
            ajax(binding.method, binding.url, obj.attributes(), function(status, response) {
              response ? response = JSON.parse(response) : {};
              if(status == 200) {
                withoutDirty(function() { response.forEachProp(function(attribute, value) { obj[attribute] = value; }); });
                dirty.clear();
                isNew = false;
              }
              callback(status == 200, status, response);
              if(status == 200) {
                trigger('afterUpdate');
                trigger('afterSave');
              } else {
                trigger('onUpdateFail', 'ajax', status, response);
                trigger('onSaveFail', 'ajax', status, response);
              }
            });
          } else throw 'unsupported model bindings type';
        });
      }
      rop(obj, 'save', function(callback) {
        if(isNew) create(callback);
        else update(callback);
      });
      model.attributes.forEachProp(function(attribute) {
        var attributeValue = null;
        Object.defineProperty(obj, attribute, {
          enumerable: true,
          writable: true,
          get: function() { return attributeValue; },
          set: function(v) {
            if(attributeValue === v) return;
            markDirty(attribute);
            trigger(attribute + 'Changed');
            attributeValue = v;
          }
        });
      });
    });
  }

  function setBaseApiUrl(url) {
    if(!url.endsWith('/')) url = url + '/';
    baseApiUrl = url;
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
  var baseApiUrl = 'https://api.example.com/';
  var models = [];
  window.conduit = {};
  rop(window.conduit, 'ajax', ajax);
  rop(window.conduit, 'setHTML', setHTML);
  rop(window.conduit, 'setMeta', setMeta);
  rop(window.conduit, 'setTitle', setTitle);
  rop(window.conduit, 'setDefaultTitle', setDefaultTitle);
  rop(window.conduit, 'route', route);
  rop(window.conduit, 'navigate', navigate);
  rop(window.conduit, 'setCookie', setCookie);
  rop(window.conduit, 'getCookie', getCookie);
  rop(window.conduit, 'clearCookies', clearCookies);
  rop(window.conduit, 'setBaseApiUrl', setBaseApiUrl);
  rop(window.conduit, 'models', models);
  rop(window.conduit, 'model', model);
  rop(window.conduit, 'hashSet', hashSet);
  rop(window.conduit, 'redirect', redirect);
  rop(window.conduit, 'decode', Base64.decode);
})();
