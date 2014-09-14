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
  this.category_[category].push(value);
  window.location.hash = this.toString();
};



dsk.FilterFragment.prototype.removeName = function(name) {
  var self = this;
  var tokens = name.split('___');
  var category = tokens[0];
  var value = tokens[1];
  goog.array.remove(this.category_[category], value);
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

  this.fragment_ = new dsk.FilterFragment();

  this.create_();
};



dsk.Filter.prototype.setDateSelected = function(id, category, isSelected) {
 this.data_[id][category] = isSelected;
};



dsk.Filter.prototype.isDateSelected = function(id, category) {
  return this.data_[id][category];
};



dsk.Filter.prototype.isCategoryChecked = function(name) {
  return this.category_[name].isChecked();
};



dsk.Filter.prototype.handleSelected = function(input) {
  var self = this;
  var tokens = input.name.split('___');
  var category = tokens[0];
  var value = tokens[1];
  goog.object.forEach(self.list_.getData(), function(e, i, o) {
    if (e[category] === value ) {
      !input.checked ? self.reduce(e, input) : self.increase(e, input);
    }
  });
  if (!this.firstload_) {
    input.checked ? self.fragment_.removeName(input.name) :
        self.fragment_.addName(input.name);
  }
  self.updateCounters();
};



dsk.Filter.prototype.reduce = function(obj, input) {
  var self = this;
  var item = goog.dom.getElement(obj.id);
  var name;
  goog.object.forEach(obj, function(e, i, o) {
    if (i !== 'id' && e) {
      // was the date deselected by another filter yet?
      if (self.isDateSelected(obj.id, i)) {
        name = i + '___' + e;
        self.category_[name].addCount(-1);
        self.setDateSelected(obj.id, i, false);
      }
    }
  });
  goog.style.setElementShown(item, false);
};



dsk.Filter.prototype.increase = function(obj, input) {
  var self = this;
  var item = goog.dom.getElement(obj.id);
  var name;
  var checked = true;
  goog.object.forEach(obj, function(e, i, o) {
    if (i !== 'id' && e) {
      name = i + '___' + e;
      // is the category currently unchecked?
      if (!self.isCategoryChecked(name)) checked = false;
      if (checked) {
        self.setDateSelected(obj.id, i, true);
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
  goog.object.forEach(self.list_.getData(), function(e1, i1, o1) {
    self.data_[i1] = goog.object.createSet(goog.object.getKeys(e1));
    self.data_[i1]['id'] = e1.id;
  });
};



dsk.Filter.prototype.initView_ = function() {
  var self = this;
  goog.object.forEach(self.category_, function(e, i, o) {
    if (goog.array.contains(self.fragment_.getNames(), e.getName())) {
      e.setChecked(false);
      self.handleSelected(e.domCheckbox_);
    }
  });
};



dsk.Filter.prototype.initNoscript_ = function() {
  goog.object.forEach(this.category_, function(e, i, a) {
    goog.style.setStyle(e.domCheckbox_, 'visibility', 'visible');
    goog.style.setStyle(e.domCount_, 'display', 'inline');
  });
};



dsk.Filter.prototype.create_ = function() {
  this.initCategories_();
  this.initLinks_();
  this.initData_();
  this.initView_();
  this.initNoscript_();
  this.firstload_ = false;
};
