(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;

  /* 
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
  */

  insort = function(a, x, lo, hi) {
    var mid;
    if (lo == null) lo = 0;
    if (lo < 0) throw new Error('lo must be non-negative');
    if (hi == null) hi = a.length;
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (x < a[mid]) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };

  /* 
  Default comparison function to be used
  */

  defaultCmp = function(x, y) {
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  };

  /*
  Push item onto heap, maintaining the heap invariant.
  */

  heappush = function(array, item, cmp) {
    if (cmp == null) cmp = defaultCmp;
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };

  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
  */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) cmp = defaultCmp;
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };

  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be 
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
  */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) cmp = defaultCmp;
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };

  /*
  Fast version of a heappush followed by a heappop.
  */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) cmp = defaultCmp;
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };

  /*
  Transform list into a heap, in-place, in O(array.length) time.
  */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref2, _results, _results2;
    if (cmp == null) cmp = defaultCmp;
    _ref2 = (function() {
      _results2 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results2.push(_j); }
      return _results2;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      i = _ref2[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };

  /*
  Find the n largest elements in a dataset.
  */

  nlargest = function(n, array, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) cmp = defaultCmp;
    result = array.slice(0, n);
    if (!result.length) return result;
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };

  /*
  Find the n smallest elements in a dataset.
  */

  nsmallest = function(n, array, cmp) {
    var elem, i, los, result, _i, _len, _ref, _results;
    if (cmp == null) cmp = defaultCmp;
    if (n * 10 <= array.length) {
      result = array.slice(0, n + 1 || 9e9).sort();
      if (!result.length) return result;
      los = result[result.length - 1];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        elem = array[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = 0, _ref = min(n, array.length); 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) cmp = defaultCmp;
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) cmp = defaultCmp;
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {

    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.data = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.data, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.data, this.cmp);
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.data, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.data, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.data, this.cmp);
    };

    Heap.prototype.empty = function() {
      return this.data.length === 0;
    };

    Heap.prototype.size = function() {
      return this.data.length;
    };

    Heap.prototype.toArray = function() {
      return this.data.slice();
    };

    return Heap;

  })();

  ((typeof module !== "undefined" && module !== null ? module.exports : void 0) || window).Heap = Heap;

}).call(this);