(function () {
  var callbacks = [];
  var loaded = false;

  //calls all registered functions once DOM is loaded
  document.addEventListener("DOMContentLoaded", function() {
    loaded = true;
    callbacks.forEach(function (fn) {
      fn();
    });
  });

  function registerCallback(callback) {
    if (loaded) {
      callback();
    } else {
      callbacks.push(callback);
    }
  };

  //converts selector into a domTree object
  window.$d = window.$d || function (selector) {
    if (typeof selector === "function") {
      registerCallback(selector);
    } else if (typeof selector === "object" && selector instanceof HTMLElement) {
      return new domTree([selector]);
    } else if (typeof selector === "string") {
      var elements = document.querySelectorAll(selector);
      elementsArray = [].slice.call(elements);
      return new domTree(elementsArray);
    }
  };

  function domTree(elements){
    this.htmlElements = elements;
  };

  domTree.prototype = {
    each: function (callback) {
      this.htmlElements.forEach(callback)
    },
    html: function (string) {
      if (string === undefined) {
        return this.htmlElements[0].innerHTML
      } else {
        this.each(function (el) {
          el.innerHTML = string
        })
      }
    },
    empty: function() {
      this.html('')
    },
    addClass: function (className) {
      this.alterClass(className, "add")
    },
    removeClass: function (className) {
      this.alterClass(className)
    },
    alterClass: function (className, action) {
      var classes = className.split(" ")
      for (var i = 0; i < classes.length; i++) {
        this.each(function(el){
          if (action === "add") {
            el.classList.add(classes[i])
          } else {
            el.classList.remove(classes[i])
          }
        })
      }
    },
    children: function (selector) {
      var progeny = []; kids = []
      this.each(function (el) {
        if (selector === undefined) {
          kids = [].slice.call(el.children);
        } else {
          kids = [].slice.call(el.querySelectorAll(selector))
        }
        progeny = progeny.concat(kids);
      });

      return new domTree(progeny)
    },
    parents: function () {
      var folks = []
      this.each(function(el){
        folks.push(el.parentNode)
      })
      return new domTree(folks)
    },
    remove: function () {
      this.each(function(el) {
        el.remove();
      })
    },
    
    append: function (string) {
      if (string === undefined) {
        return this.htmlElements[0].innerHTML
      } else {
        this.each(function(el) {
          el.innerHTML += string
        })
      }
    },

    attr: function (key, value) {
      if (value === undefined) {
        return this.htmlElements[0].getAttribute(key)
      } else {
        this.htmlElements[0].setAttribute(key, value)
      }
    },

    find: function (target) {
      var output = []
      this.each(function (el) {
        var temp = [].slice.call(el.querySelectorAll(target))
        output = output.concat(temp)
      })
      return new domTree(output)
    },

    on: function (event, fn) {
      this.each(function (el) {
        el.addEventListener(event, fn)
      })
    }

  }


}(this));
