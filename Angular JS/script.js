'use strict';


/*all the comments here are made just to make it easier for me 
to undesrstand  what is going on and what equiements are done*/


function Scope() {
  this.$$watchers=[];
  this.$$asyncQueue = [];
  this.$$postDigestQueue = [];
  this.$$phase= null; //was hesitating if it takes sense to change these names,the carry a lot  of sense
}

Scope.prototype.$beginPhase = function(phase) {
  if (this.$$phase) {
    throw this.$$phase + 'already in progress!'; //control functions apply and digest
  }
  this.$$phase = phase; //return tha phase of the functions
};

Scope.prototype.$clearPhase = function() {
  this.$$phase= null; //clear the phase after the functions completed
};

Scope.prototype.$watch = function (watchFn, ListenerFn,valueEq) {
  var control=this;
  var watcher = {
    watchFn:watchFn,
    ListenerFn:ListenerFn || function() { }, //logic OR
    valueEq: !!valueEq  //double negation
  };
  control.$$watchers.push(watcher); //save it in our empty array
  return function() {
    var index = control.$$watchers.indexOf(watcher);
    if (index >=0) {
      control.$$watchers.splice(index,1); // deletes 1 element starting from the position of index
    }
  };
};


Scope.prototype.$$areEqual = function(newV,oldV,valueEq){
  if (valueEq) {
    return _.isEqual(newV, oldV); // comparison, using lodash library
  } else {
    return newV === oldV || (
      typeof newV ==='number' && typeof oldV === isNaN(newV)&&isNaN(oldV));

  }
};

Scope.prototype.$$digestOnce = function() { // the function that continue checking untill the values will stop changing
  var control=this;
  var dirty;
  _.forEach(this.$$watchers, function(watch){
    try {
      var newV = watch.watchFn(control);
      var oldV = watch.last;
      if (!control.$$areEqual(newV,oldV,watch.valueEq)){
        watch.ListenerFn(newV,oldV,control);
        dirty = true;
      }
      watch.last = (watch.valueEq ? _.cloneDeep(newVa) : newVa);  /* if watch.valueEq = true 
      then we do dep cope,else we take newValue*/
     }
     catch (e){
      (console.error || console.log)(e); // searching for the mistakes
     }
  });
  return dirty;  //returns true/false
};


Scope.prototype.$digest = function() {
  var ttl=10;  //the quantity of allowed iterations
  var dirty;
  this.$beginPhase("$digest"); 
  do {
    while (this.$$asyncQueue.length) {
      try {
        var asyncTask = this.$$asyncQueue.shift(); //we push this element out or the array and asyncTask is now equal to this element
        this.$eval(asyncTask.expession); //takes the function as a parameter and immediately invokes it
      } catch (e){
        (console.error || console.log)(e);
      }
    }
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      this.$clearPhase();
      throw "You've reached 10 iterations";
    }
  } while (dirty);
  this.$clearPhase();
  while (this.$$postDigestQueue.length) {
    try {
      this.$$postDigestQueue.shift()();
    } catch (e) {
      (console.error || console.log)(e);
    }
  }
};

Scope.prototype.$eval = function(expr, locals){
  return exrp(this,locals); //immediatyly invoke the function which takes this function as a parameter.wtf
};


Scope.prototype.$apply = function(expr) {
  try {
    this.$beginPhase("$apply"); //returns 'apply already in progess'
    return this.$eval(expr);
  } finally { //digest is called in this block just to refresh dependencies even if there are exceptions in the function
    this.$clearPhase();
    this.$digest();
  }
};

Scope.prototype.$evalAsync = function(expr){ // takes the function and starts it later on
  var control=this;
  if (!control.$$phase && !control.$$asyncQueue.length){
    setTimeout(function(){ //we set the timeout
      if (control.$$asyncQueue.length){
        control.$digest();
      }
    },0);
  }
  control.$$asyncQueue.push({scope:control,expession:expr});
};

Scope.prototype.$$postDigest = function(fn){
  this.$$postDigestQueue.push(fn); //this function will run immediately after the previous digest will be over
};


var scope= new Scope();
scope.aValue="hello,world";
scope.counter=0;

var removeWatch = scope.$watch(
  function(scope){
    return scope.aValue;
  },
  function(newValue,oldValue,scope){
    scope.counter++;
  });

/*I didn't just copy-paste the example, a re-read it carefully several times, 
made some notes and then tried to understand it and make it work .*/ 
