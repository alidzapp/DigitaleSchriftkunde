/**
 * @fileoverview Digitale Schriftkunde hover window.
 */

goog.provide('dsk.HoverWindow');



goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.NodeIterator');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.iter');
goog.require('goog.string');
goog.require('goog.style');
goog.require('dsk.Window');



dsk.HoverWindow = function(element, position, view, height) {

  goog.base(this, element, position, height);

  this.view_ = view;

  this.nodes_;

  this.highlight_ = [];

  this.p_;

  this.register_();
  this.initTei_();
};
goog.inherits(dsk.HoverWindow, dsk.Window);



dsk.HoverWindow.prototype.isHighlightingSituation = function(element) {
  return this.view_.isTilinking() && element.tagName && element.tagName.toLowerCase() === 'span';
};



dsk.HoverWindow.prototype.getHandnoteColor_ = function(span) {
  var e;
  var spanHandshift;
  var scribeId;
  for (var i = 0, len = this.nodes_.length; i < len; i++) {
    e = this.nodes_[i];
    if (e.tagName && e.tagName.toLowerCase() === 'span' && goog.dom.classes.has(e, 'tei_handShift')) {
      spanHandshift = e;
    };
    if (e === span) break;
  };
  spanHandshift ? scribeId = goog.dom.dataset.get(spanHandshift, 'scribe') : scribeId = undefined;
  return this.view_.getColorByScribeId(scribeId) || '#FF9900';
};



dsk.HoverWindow.prototype.highlight = function(span, active) {
  var color = !this.view_.isHandnotes() ? '#FF9900' : this.getHandnoteColor_(span);
  var self = this;
  var i = 0;
  var e;
  var found;
  var start;
  var end;
  var endId;
  for (var i = 0, len = this.nodes_.length; i < len; i++) {
    e = this.nodes_[i];
    if (e.id && goog.string.endsWith(e.id, '_start') &&
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
    this.view_.getWindowImage().showAnnotationById(endId.substr(0, endId.indexOf('_')), color);
  }
  goog.array.forEach(self.highlight_, function(e, i, a) {
     goog.style.setStyle(e, 'border-bottom', 'solid ' + color + ' 3px');
  });
  if (active) goog.style.scrollIntoContainerView(span, this.content_, true);
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
  this.highlight(e.target, false);
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



dsk.HoverWindow.prototype.initTeiLeftAdditions_ = function() {
  var max = 100;
  var leftAdditions = goog.dom.getElementsByTagNameAndClass('span', 'tei_add_left', self.element_);
  var hasAdditions = false;
  var longestWidth = 0;
  var longestAddition;
  var size = 0;
  goog.array.forEach(leftAdditions, function(e, i, a) {
    size = goog.style.getSize(leftAdditions[i]);
    if (goog.dom.getTextContent(leftAdditions[i]) !== '') hasAdditions = true;
    if (size.width > longestWidth) {
      longestWidth = size.width;
      longestAddition = e;
    }
  });
  longestWidth += 5;
  goog.array.forEach(leftAdditions, function(e, i, a) {
    goog.style.setStyle(e, 'display', 'inline-block');
    goog.style.setStyle(e, 'width', longestWidth + 'px');
  });
  return longestWidth;
};



dsk.HoverWindow.prototype.initTeiRightAdditions_ = function(add) {
  var rightAdditions = goog.dom.getElementsByTagNameAndClass('span', 'tei_add_right', self.element_);
  var hasAdditions = false;
  rightAdditions.length > 0 ? hasAdditions = true : hasAdditions = false;
  var mostRight = 0;
  var position;
  goog.array.forEach(rightAdditions, function(e, i, a) {
    position = goog.style.getClientPosition(e);
    if (position.x > mostRight) mostRight = position.x;
  });
  goog.array.forEach(rightAdditions, function(e, i, a) {
    position = goog.style.getClientPosition(e);
    goog.style.setStyle(e, 'position', 'absolute');
    goog.style.setPageOffset(e, mostRight + add, position.y);
  });
};



dsk.HoverWindow.prototype.initTei_ = function() {
  var add = this.initTeiLeftAdditions_();
  this.initTeiRightAdditions_(add);
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
  this.nodes_ = new goog.dom.NodeIterator(self.p_, false, false);
  this.nodes_ = goog.iter.toArray(self.nodes_);
  this.nodes_ = goog.array.filter(this.nodes_, function(e) {
    return e.tagName && (goog.dom.classes.has(e, 'tei_handShift') || e.id ||
        goog.dom.classes.has(e, 'hover-text'));
  });
};
