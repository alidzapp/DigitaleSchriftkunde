/**
 * @fileoverview Digitale Schriftkunde window.
 */

goog.provide('dsk.Window');



goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Rect');
goog.require('goog.style');



dsk.Window = function(element, position, height) {

  this.element_ = element;

  this.hasFocus_ = false;

  this.zoom_;

  this.fontSize_;

  this.init_(position, height);
};



dsk.Window.IMAGE = 'window-image';



dsk.Window.COMMENT = 'window-comment';



dsk.Window.T1 = 'window-transcription1';



dsk.Window.T2 = 'window-transcription2';



dsk.Window.prototype.getElement = function() {
  return this.element_;
};



dsk.Window.prototype.show = function() {
  var self = this;
  goog.style.setStyle(self.element_, 'visibility', 'visible');
};



dsk.Window.prototype.hide = function() {
  var self = this;
  goog.style.setStyle(self.element_, 'visibility', 'hidden');
};



dsk.Window.prototype.focus = function(flag) {
  var self = this;
  this.hasFocus_ = flag;
  flag ? goog.style.setStyle(self.element_, 'z-index', '20') :
      goog.style.setStyle(self.element_, 'z-index', '10');
};



dsk.Window.prototype.setOptimalHeight = function() {
  var self = this;
  var p = goog.dom.getElementsByTagNameAndClass('div', 'p', self.element_)[0];
  var pSize = goog.style.getSize(p);
  pSize.height += 50;
  goog.style.setSize(self.element_, pSize);
};



dsk.Window.prototype.initStyle_ = function(pos, height) {
  var self = this;
  height = height || 0;
  var position = goog.style.getClientPosition(self.element_);
  position.y = position.y + (height + 10) * pos;
  goog.style.setStyle(self.element_, 'position', 'absolute');
  goog.style.setStyle(self.element_, 'z-index', '10');
  goog.style.setPageOffset(self.element_, position);
  this.focus(false);
  this.zoom_ = 1;
  var span = goog.dom.getElementsByTagNameAndClass('span', undefined, self.element_)[0];
  span ? this.fontSize_ = goog.style.getFontSize(span) : this.fontSize_ = 11;
};



dsk.Window.prototype.registerResizable = function() {
  var self = this;
  var resizable = goog.dom.getLastElementChild(this.element_);
  var d = new goog.fx.Dragger(resizable);
  goog.events.listen(resizable, goog.events.EventType.MOUSEOVER, function(e) {
    goog.style.setStyle(e.target, 'cursor', 'se-resize');
  });
  goog.events.listen(resizable, goog.events.EventType.MOUSEOUT, function(e) {
    goog.style.setStyle(e.target, 'cursor', 'default');
  });
  goog.events.listen(d, goog.events.EventType.DRAG, function(e) {
    goog.style.setSize(self.element_, d.deltaX, d.deltaY);
    if (self.drawing_) self.drawing_.handleResize();
  });
};



dsk.Window.prototype.registerDrag_ = function() {
  var self = this;
  var header = goog.dom.getElementsByTagNameAndClass('div', 'h1', self.element_)[0];
  goog.events.listen(header, goog.events.EventType.MOUSEOVER, function(e) {
    goog.style.setStyle(e.target, 'cursor', 'move');
  }, true);
  goog.events.listen(header, goog.events.EventType.MOUSEOUT, function(e) {
    goog.style.setStyle(e.target, 'cursor', 'default');
  }, true);
  new goog.fx.Dragger(self.element_, header);
};



dsk.Window.prototype.registerToolbar_ = function() {
  var self = this;
  var toolbar = goog.dom.getElementsByTagNameAndClass('div', 'toolbar', self.element_)[0];
  if (toolbar) {
    var iconZoomIn = goog.dom.getFirstElementChild(toolbar);
    var iconZoomOut = goog.dom.getNextElementSibling(iconZoomIn);
    var iconClose = goog.dom.getLastElementChild(toolbar);
    var checkbox = goog.dom.getElementsByTagNameAndClass('input', self.element_.id)[0];
    var content = goog.dom.getElementsByTagNameAndClass('div', 'content', self.element_)[0];
    goog.events.listen(self.element_, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(toolbar, 'display', 'block');
    });
    goog.events.listen(self.element_, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(toolbar, 'display', 'none');
    });
    goog.events.listen(iconZoomIn, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconZoomIn, 'cursor', 'pointer');
    });
    goog.events.listen(iconZoomIn, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconZoomIn, 'cursor', 'default');
    });
    goog.events.listen(iconZoomOut, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconZoomOut, 'cursor', 'pointer');
    });
    goog.events.listen(iconZoomOut, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconZoomOut, 'cursor', 'default');
    });
    goog.events.listen(iconClose, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconClose, 'cursor', 'pointer');
    });
    goog.events.listen(iconClose, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconClose, 'cursor', 'default');
    });
    goog.events.listen(iconZoomIn, goog.events.EventType.CLICK, function(e) {
      self.zoom_ += .1;
      goog.style.setStyle(content, 'font-size', self.zoom_ * self.fontSize_ + 'px');
      goog.style.setStyle(content, 'line-height', self.zoom_);
    });
    goog.events.listen(iconZoomOut, goog.events.EventType.CLICK, function(e) {
      self.zoom_ -= .1;
      goog.style.setStyle(content, 'font-size', self.zoom_ * self.fontSize_ + 'px');
      goog.style.setStyle(content, 'line-height', self.zoom_);
    });
    goog.events.listen(iconClose, goog.events.EventType.CLICK, function(e) {
      self.hide();
      //TODO: handle by toolbar class
      checkbox.checked = false;
    });
  }
};



dsk.Window.prototype.init_ = function(position, height) {
  this.initStyle_(position, height);
  this.registerResizable();
  this.registerDrag_();
  this.registerToolbar_();
};
