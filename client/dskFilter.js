/**
 * @fileoverview Digitale Schriftkunde filter class.
 */

goog.provide('dsk.Filter');
goog.provide('dsk.FilterCategory');
goog.provide('dsk.FilterFragment');



goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.Uri');



dsk.FilterFragment = function() {

  this.uri_ = new goog.Uri(window.location.href);

  this.category_ = {};

  this.init_()
};



dsk.FilterFragment.prototype.getCategory = function() {
  return this.category_;
};



dsk.FilterFragment.prototype.getNames = function() {
  var self = this;
  var names = [];
  goog.object.forEach(self.category_, function(e1, i1, o1) {
    goog.array.forEach(e1, function(e2, i2, o2) {
      names.push(i1 + '___' + e2);
    });
  });
  return names;
};



dsk.FilterFragment.prototype.addName = function(name) {
  var self = this;
  var tokens = name.split('___');
  var category = tokens[0];
  var value = tokens[1];
  if (this.category_[category]) this.category_[category].push(value);
  window.location.hash = this.toString();
};



dsk.FilterFragment.prototype.removeName = function(name) {
  var self = this;
  var tokens = name.split('___');
  var category = tokens[0];
  var value = tokens[1];
  if (this.category_[category]) goog.array.remove(this.category_[category], value);
  window.location.hash = this.toString();
};



dsk.FilterFragment.prototype.toString = function() {
  var self = this;
  var fragment = '';
  goog.object.forEach(self.category_, function(e, i, o) {
    fragment += '_' + i + '_';
    fragment += e.join('.');
  });
  return '#' + fragment;
};



dsk.FilterFragment.prototype.init_ = function() {
  var fragment = this.uri_.getFragment();
  var tokens = fragment.split('_');
  var token;
  for (var i = 0, len = tokens.length; i < len; i++) {
    token = tokens[i];
    if (token.match(/^[a-z]$/)) {
      this.category_[token] = [];
    } else if (token === '') {
    } else {
      this.category_[tokens[i - 1]] = token.split('.');
    }
  }
};



dsk.FilterCategory = function(element) {

  this.element_ = element;

  this.domCheckbox_;

  this.domLabel_;

  this.domCount_;

  this.domMax_;

  this.max_;

  this.count_;

  this.category_;

  this.value_;

  this.create_();
};



dsk.FilterCategory.prototype.getName = function() {
  return this.domCheckbox_.name;
};



dsk.FilterCategory.prototype.getTokens_ = function() {
  return this.domCheckbox_.name.split('___');
};



dsk.FilterCategory.prototype.getCategory = function() {
  return this.category_;
};



dsk.FilterCategory.prototype.getValue = function() {
  return this.value_;
};



dsk.FilterCategory.prototype.addCount = function(value) {
  this.count_ += value;
};



dsk.FilterCategory.prototype.updateCount = function() {
  var self = this;
  goog.dom.setTextContent(self.domCount_, '(' + this.count_ + ') ');
  if (this.count_ === 0) {
    goog.dom.classes.set(self.domLabel_, 'light-grey');
  } else {
    goog.dom.classes.remove(self.domLabel_, 'light-grey');
  }
};



dsk.FilterCategory.prototype.isChecked = function() {
  return !!this.domCheckbox_.checked;
};



dsk.FilterCategory.prototype.setChecked = function(flag) {
  this.domCheckbox_.checked = flag;
};



dsk.FilterCategory.prototype.create_ = function() {
  var self = this;
  this.domCheckbox_ = goog.dom.getFirstElementChild(self.element_);
  this.domLabel_ = goog.dom.getNextElementSibling(self.domCheckbox_, 1);
  this.domCount_ = goog.dom.getNextElementSibling(self.domLabel_, 2);
  this.domMax_ = goog.dom.getNextElementSibling(self.domCount_, 3);
  var text = goog.dom.getTextContent(self.domMax_);
  text = text.replace('(', '');
  text = text.replace(')', '');
  this.max_ = this.count_ = parseInt(text);
  this.category_ = this.getTokens_()[0];
  this.value_ = this.getTokens_()[1]; 
};



dsk.Filter = function(element, list) {

  this.firstload_ = true;

  this.element_ = element;

  this.list_ = list;

  this.data_ = {};

  this.category_ = {};

  this.selectAll_;

  this.fragment_ = new dsk.FilterFragment();

  this.create_();
};



dsk.Filter.prototype.setDateSelected = function(id, category, isSelected) {
 this.data_[id][category] = isSelected;
};



dsk.Filter.prototype.isDateDeselected = function(id) {
  var deselected = false;
  goog.object.forEach(this.data_[id], function(e){
    if (e === false) deselected = true;
  });
  return deselected;
};



dsk.Filter.prototype.isDateSelected = function(id) {
  var selected = true;
  goog.object.forEach(this.data_[id], function(e){
    if (e === false) selected = false;
  });
  return deselected;
};



dsk.Filter.prototype.isCategoryChecked = function(name) {
  return this.category_[name].isChecked();
};



dsk.Filter.prototype.handleSelectAll = function(input) {
  var self = this;
  var categories =
      goog.dom.getElementsByTagNameAndClass('input', input.name);
  goog.array.forEach(categories, function(e, i, a) {
    if (!e.checked === input.checked) {
      e.checked = input.checked;
      self.handleSelected(e);
    }
  });
};



dsk.Filter.prototype.handleSelected = function(input) {
  var self = this;
  var tokens = input.name.split('___');
  var category = tokens[0];
  var value = tokens[1];

  goog.object.forEach(self.list_.getData(), function(e, i, o) {
    if (e[category] === value ) {
      !input.checked ? self.reduce(e, category) : self.increase(e, category);
    }
  });
  if (!this.firstload_) {
    input.checked ? self.fragment_.removeName(input.name) :
        self.fragment_.addName(input.name);
  }
  self.updateCounters();

  // set height of main DIV
  var divMain = goog.dom.getElement('main');
  var divList = goog.dom.getElement('list');
  var height = goog.style.getSize(divList).height;
  goog.style.setStyle(divMain, 'height', height + 'px');
};



dsk.Filter.prototype.reduce = function(obj, category) {
  var self = this;
  var item = goog.dom.getElement(obj.id);
  var name;
  goog.object.forEach(obj, function(e, i, o) {
    if (i !== 'id' && e) {
      name = i + '___' + e;
      // was the date deselected by another filter yet?
      if (!self.isDateDeselected(obj.id)) {
        self.category_[name].addCount(-1);
      }
    }
  });
  self.setDateSelected(obj.id, category, false);
  goog.style.setElementShown(item, false);
};



dsk.Filter.prototype.increase = function(obj, category) {
  var self = this;
  var item = goog.dom.getElement(obj.id);
  var name;
  self.setDateSelected(obj.id, category, true);
  goog.object.forEach(obj, function(e, i, o) {
    if (i !== 'id' && e) {
      name = i + '___' + e;
      // is the date currently deselected by another filter?
      if (!self.isDateDeselected(obj.id)) {
        self.category_[name].addCount(1);
        goog.style.setElementShown(item, true);
      }
    }
  });
};



dsk.Filter.prototype.updateCounters = function() {
  goog.object.forEach(this.category_, function(e, i, o) {
    e.updateCount();
  });  
};



dsk.Filter.prototype.initCategories_ = function() {
  var self = this;
  var spans = goog.dom.getElementsByTagNameAndClass('span', 'h2', self.element_);
  var category;
  goog.array.forEach(spans, function(e, i, a) {
    if (i > 3) { //TODO: replace with class name in filter spans
      category = new dsk.FilterCategory(e);
      self.category_[category.getName()] = category;
    }
  });
};



dsk.Filter.prototype.initSelectAll_ = function() {
  var self = this;
  var className;
  var categories;
  this.selectAll_ = goog.dom.getElementsByTagNameAndClass('input', 'select-all');

  var allChecked = function(cs) {
    var all = true;
    goog.array.forEach(cs, function(e, i, a) {
      if (!e.checked || e.checked == false) all = false;
    });
    return all;
  };

  goog.array.forEach(this.selectAll_, function(e, i, a) {
    className = e.getAttribute('name');
    categories = goog.dom.getElementsByTagNameAndClass('input', className);
    if (!allChecked(categories)) e.checked = false;
  });
};



dsk.Filter.prototype.initLinks_ = function() {
  var self = this;
  var spans = goog.dom.getElementsByTagNameAndClass('span', 'h2', self.element_);
  goog.array.forEach(spans, function(e, i, a) {
    if (i <= 3) { //TODO: replace with class name in filter spans
      var link = goog.dom.getFirstElementChild(e);
      goog.events.listen(link, goog.events.EventType.CLICK, function(event) {
        event.preventDefault();
        window.location.href = link.href + self.fragment_.toString();
      })
    }
  });
  var list = goog.dom.getElement('list');
  var links = goog.dom.getElementsByTagNameAndClass('a', undefined, list);
  goog.array.forEach(links, function(e, i, a) {
    goog.events.listen(e, goog.events.EventType.CLICK, function(event) {
      event.preventDefault();
      window.location.href = e.href + self.fragment_.toString();
    })
  });
};



dsk.Filter.prototype.initData_ = function() {
  var self = this;
  var keys;
  goog.object.forEach(self.list_.getData(), function(e, i, o) {
    self.data_[i] = goog.object.createSet(goog.object.getKeys(e));
  });
};



dsk.Filter.prototype.initView_ = function() {
  var self = this;
  var names = self.fragment_.getNames();
  goog.object.forEach(self.category_, function(e, i, o) {
    if (goog.array.contains(names, e.getName())) {
      e.setChecked(false);
      self.handleSelected(e.domCheckbox_);
    }
  });

  // initialize the height of the main DIV
  var divList = goog.dom.getElement('list');
  var divListFilter = goog.dom.getElement('list-filter');
  var divMain = goog.dom.getElement('main');
  var minHeight = goog.style.getSize(divListFilter).height;
  var height = goog.style.getSize(divList).height;
  goog.style.setStyle(divMain, 'min-height', minHeight + 'px');
  if (height > minHeight) {
    goog.style.setStyle(divMain, 'height', height + 'px');
  } else {
    goog.style.setStyle(divMain, 'height', minHeight + 'px');
  }
};



dsk.Filter.prototype.initNoscript_ = function() {
  goog.object.forEach(this.category_, function(e, i, a) {
    goog.style.setStyle(e.domCheckbox_, 'visibility', 'visible');
    goog.style.setStyle(e.domCount_, 'display', 'inline');
  });
  goog.array.forEach(this.selectAll_, function(e, i, a) {
    goog.style.setStyle(e, 'display', 'inline');
  });
  var elements = goog.dom.getElementsByTagNameAndClass(undefined, 'noscript-invisible',
      self.element_);
  goog.array.forEach(elements, function(e, i, a) {
    goog.style.setStyle(e, 'visibility', 'visible');
  })
};



dsk.Filter.prototype.create_ = function() {
  var uri = new goog.Uri(window.location.href);
  var fragment = uri.getFragment();
  if (fragment === '') window.location.hash = '_a__b__c__d__e_';
  this.initCategories_();
  this.initLinks_();
  this.initData_();
  this.initView_();
  this.initSelectAll_();
  this.initNoscript_();
  this.firstload_ = false;
};
