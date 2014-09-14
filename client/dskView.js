/**
 * @fileoverview Digitale Schriftkunde item view.
 */

goog.provide('dsk.View');



goog.require('dsk.HoverWindow');
goog.require('dsk.ImageWindow');
goog.require('dsk.Window');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.dom.DomHelper');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.Uri');



dsk.View = function(element) {

  this.element_ = element;

  this.window_ = {
    'window-image': null,
    'window-comment': null,
    'window-transcription1': null,
    'window-transcription2': null
  };

  this.tilinking_ = false;

  this.create_();
};



dsk.View.prototype.isTilinking = function() {
  return this.tilinking_
};



dsk.View.prototype.getWindowImage = function() {
  return this.window_[dsk.Window.IMAGE];
};



dsk.View.prototype.getWindowTranscription1 = function() {
  return this.window_[dsk.Window.T1];
};



dsk.View.prototype.initView_ = function() {
  this.window_[dsk.Window.IMAGE] = new dsk.ImageWindow(goog.dom.getElement(dsk.Window.IMAGE), 0, this);
  this.window_[dsk.Window.COMMENT] = new dsk.Window(goog.dom.getElement(dsk.Window.COMMENT), 0);
  this.window_[dsk.Window.COMMENT].setOptimalHeight();
  this.window_[dsk.Window.T1] = new dsk.HoverWindow(goog.dom.getElement(dsk.Window.T1), 1, this);
  this.window_[dsk.Window.T2] = new dsk.Window(goog.dom.getElement(dsk.Window.T2), 2);
  this.window_[dsk.Window.T1].hide();
  this.window_[dsk.Window.T2].hide();
};



dsk.View.prototype.initBacklink_ = function() {
  var uri = new goog.Uri(window.location.href);
  var viewHeader = goog.dom.getElement('view-header');
  var backlink = goog.dom.getElementsByTagNameAndClass('a', undefined, viewHeader)[0];
  var href = backlink.href + '#' + uri.getFragment();
  backlink.href = href;
};



dsk.View.prototype.handleShowWindow_ = function(e) {
  var self = this;
  var checkbox = e.target;
  var w = self.window_[checkbox.name];
  switch(checkbox.name) {
  case dsk.Window.IMAGE:
  case dsk.Window.COMMENT:
  case dsk.Window.T1:
  case dsk.Window.T2:
    if (checkbox.checked) {
      w.show();
      self.handleFocusWindow_(w);
    } else {
      w.hide();
    }
    break;
  default:
    break;
  };
};



dsk.View.prototype.registerShow_ = function() {
  var self = this;
  var options = goog.dom.getElement('options');
  var checkboxes = goog.dom.getElementsByTagNameAndClass('input', undefined,
      options);
  goog.array.forEach(checkboxes, function(e, i, a) {
    goog.events.listen(e, goog.events.EventType.CLICK, function(e) {
      self.handleShowWindow_(e);
    }, false, self)
  });
};



dsk.View.prototype.handleFocusWindow_ = function(win) {
  var self = this;
  goog.object.forEach(self.window_, function(e, i, o) {
    if (e === win) {
      e.focus(true);
    } else {
      e.focus(false);
    }
  });
};



dsk.View.prototype.registerFocus_ = function() {
  var self = this;
  goog.object.forEach(self.window_, function(e, i, o) {
    goog.events.listen(e.getElement(), goog.events.EventType.MOUSEDOWN, function(event) {
      self.handleFocusWindow_(e);
    }, false, self)
  });
};



dsk.View.prototype.registerTilinking_ = function() {
  var self = this;
  var options = goog.dom.getElement('options');
  var checkboxes = goog.dom.getElementsByTagNameAndClass('input', undefined, options);
  var checkbox = checkboxes[checkboxes.length - 1];

  goog.events.listen(checkbox, goog.events.EventType.CLICK, function(e) {
    checkbox.checked ? self.tilinking_ = true : self.tilinking_ = false;
  })
};



dsk.View.prototype.initNoscript_ = function() {
  var self = this;
  var elements = goog.dom.getElementsByTagNameAndClass(undefined, 'noscript-invisible',
      self.element_);
  goog.array.forEach(elements, function(e, i, a) {
    goog.style.setStyle(e, 'visibility', 'visible');
  })
};



dsk.View.prototype.create_ = function() {
  this.initView_();
  this.initBacklink_();
  this.registerShow_();
  this.registerFocus_();
  this.registerTilinking_();
  this.initNoscript_();
};
