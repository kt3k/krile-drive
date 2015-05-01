//
// global elements
//
var byId = function(id) {
    if (typeof id == 'string') {
        return document.getElementById(id);
    }
    return id;
};

var mixin = function(target, source) {
    for (var i in source) {
        target[i] = source[i];
    }
};

if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    }
}

/**
 * derive the descendant class from an already defined class.
 * it implements completely classical paradigmed inheritance
 * (not prototypal).
 * exmaple:
 * var Child = Parent.derive({
 *     someMethod: function() {
 *         some_process();
 *     }
 * });
 */
Function.prototype.derive = function(extension){
    var __super__ = this.prototype;
    var x, y;
    
    // 1. get extension
    var obj = (typeof extension === "function" ? extension(__super__) : extension);
    
    // 2. define proxy function
    x = function() {};
    x.prototype = __super__;
    
    // 3. set up the constructor
    y = obj && obj.hasOwnProperty("constructor") ? obj.constructor : function() {__super__.constructor.apply(this, arguments);};
    y.__super__ = __super__;
    y.prototype = new x;
    y.prototype.constructor = y;
    
    // 4. extend prototype
    mixin(y.prototype, obj);
    
    return y;
};

Function.prototype.mixin = function() {
    for (var i = 0; i < arguments.length; i++) {
        var ext = arguments[i];
        if (ext === undefined || ext.prototype === undefined) {
            continue;
        }
        for (var m in ext.prototype) {
            if (m === "constructor") {
                continue;
            }
            this.prototype[m] = ext.prototype[m];
        }
    }
}

/**
 * derive the descendant class from an already defined class.
 * it implements completely classical paradigmed inheritance
 * (not prototypal).
 * exmaple:
 * var Child = derive(Parent)(function(__super__){ return {
 *     someMethod: function() {
 *         someProcess();
 *         __super__.someOtherMethod.apply(this);
 *     }
 * };});
 */
var derive = function(__superclass__) {
    // 0. store super class's prototype in closure variable
    var __super__ = __superclass__.prototype;
    return function(extension) {
        var x, y;
        
        // 1. get class specific extention
        // if extention parameter given as function, then it is called with __super__ argument
        // and returned value is used as real extension
        var obj = (typeof extension === "function" ? extension(__super__) : extension);
        
        // 2. define proxy function
        x = function() {};
        x.prototype = __super__;
        
        // 3. set up the constructor
        // if not specified, the parent's constructor is used
        y = obj.hasOwnProperty("constructor") ? obj.constructor : function() {__super__.constructor.apply(this, arguments);};
        y.__super__ = __super__;
        y.prototype = new x;
        y.prototype.constructor = y;
        
        // 4. extend prototype
        mixin(y.prototype, obj);
        
        return y;
    }
};

function namespace(){
    return {__isNamespace__: true};
}

function namespaced() {
    var globals = (function(){
        return this;
    })();
    globals.__classes__ = [];
    for (var i in globals) {
        var namespace = globals[i];
        if (namespace != null && namespace.__isNamespace__) {
            for (var j in namespace) {
                var cls = namespace[j];
                if (typeof cls === "function") {
                    globals.__classes__.push(i + '.' + j);
                    cls.prototype.__name__ = j;
                    cls.prototype.__module__ = i;
                }
            }
        }
    }
}

console.logJ = function(a) {
    this.log(JSON.stringify(a));
}
