/**
 * @fileoverview Digitale Schriftkunde hover window.
 */

goog.provide('dsk.HoverWindow');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.NodeIterator');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.iter');
goog.require('goog.string');
goog.require('goog.style');
goog.require('dsk.Window');



dsk.HoverWindow = function(element, position, view) {

  goog.base(this, element, position);

  this.view_ = view;

  this.nodes_;

  this.highlight_ = [];

  this.p_;

  this.register_();
};
goog.inherits(dsk.HoverWindow, dsk.Window);



dsk.HoverWindow.prototype.isHighlightingSituation = function(element) {
  return this.view_.isTilinking() && element.tagName && element.tagName.toLowerCase() === 'span';
};



dsk.HoverWindow.prototype.highlight = function(span) {
  var self = this;
  var i = 0;
  var e;
  var found;
  var start;
  var end;
  var endId;
  for (var i = 0, len = this.nodes_.length; i < len; i++) {
    e = this.nodes_[i];
    if (e.tagName && e.tagName.toLowerCase() === 'span' && e.id && goog.string.endsWith(e.id, '_start') &&
        !found) {
      this.highlight_ = null;
      this.highlight_ = [];
      start = e;
      endId = e.id.replace('_start', '_end');
      end = null;
    }
    if (this.isHighlightingSituation(e)) this.highlight_.push(e);
    if (e == span) found = true;
    if (e.tagName && e.tagName.toLowerCase() === 'span' && e.id && e.id === endId &&
        found) {
      end = e;
      break;
    }
  };
  if (!end) {
    self.highlight_ = [];
  } else {
    this.view_.getWindowImage().showAnnotationById(endId.substr(0, endId.indexOf('_')));
  }
  goog.array.forEach(self.highlight_, function(e, i, a) {
    goog.style.setStyle(e, 'border-bottom', 'solid #FF9900 3px');
  });
};



dsk.HoverWindow.prototype.unhighlight = function() {
  var self = this;
  goog.array.forEach(self.highlight_, function(e, i, a) {
    goog.style.setStyle(e, 'border', 'none');
  });
  self.highlight_ = [];
};



dsk.HoverWindow.prototype.handleOver_ = function(e) {
  if (!this.isHighlightingSituation(e.target)) return;
  this.highlight(e.target);
};



dsk.HoverWindow.prototype.handleOut_ = function(e) {
  var self = this;
  var id;
  if (!this.isHighlightingSituation(e.target)) return;
  if (self.highlight_[0]) {
    id = self.highlight_[0].id
    id = id.substr(0, id.indexOf('_'));
    this.view_.getWindowImage().hideAnnotationById(id);
  }
  this.unhighlight();
};



dsk.HoverWindow.prototype.register_ = function() {
  var self = this;
  self.p_ = goog.dom.getElementsByTagNameAndClass('div', 'p', self.element_)[0];
  goog.events.listen(self.p_, goog.events.EventType.MOUSEOVER, function(e) {
    self.handleOver_(e, self);
  }, false, self);
  goog.events.listen(self.p_, goog.events.EventType.MOUSEOUT, function(e) {
    self.handleOut_(e);
  }, false, self);
  this.nodes_ = new goog.dom.NodeIterator(this.p_, false, false);
  this.nodes_ = goog.iter.toArray(this.nodes_);
};
