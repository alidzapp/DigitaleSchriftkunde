/**
 * @fileoverview Digitale Schriftkunde image window.
 */

goog.provide('dsk.ImageWindow');



goog.require('goog.array');
goog.require('goog.dom.dataset');
goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.userAgent');
goog.require('dsk.Window');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.State');
goog.require('xrx.drawing.tool.Magnifier');
goog.require('xrx.graphics.Engine');
goog.require('xrx.shape.Rect');



/**
 * @constructor
 */
dsk.ImageWindow = function(element, position, view) {

  goog.base(this, element, position);

  this.drawing_;

  this.view_ = view;

  this.data_;

  this.shapes_;

  this.mousePoint_ = new Array(2);

  this.highlighted_;

  this.create_();
};
goog.inherits(dsk.ImageWindow, dsk.Window);



dsk.ImageWindow.prototype.getShapeFromData = function(id) {
  var rect;
  var x, y, w, h;
  var coords = new Array(4);
  var tokens = this.data_[id].split(' ');

  x = (parseFloat(tokens[0]));
  y = (parseFloat(tokens[1]));
  w = (parseFloat(tokens[2]));
  h = (parseFloat(tokens[3]));

  coords[0] = [x, y];
  coords[1] = [x + w, y];
  coords[2] = [x + w, y + h];
  coords[3] = [x, y + h];

  rect = new xrx.shape.Rect(this.drawing_);
  rect.id = id;
  rect.setCoords(coords);
  rect.setStrokeWidth(0);
  rect.setStrokeColor('#FF9900');

  return rect;
};



dsk.ImageWindow.prototype.showAnnotation = function(shape) {
  if (shape) shape.setStrokeWidth(5);
  this.drawing_.draw();
};



dsk.ImageWindow.prototype.showAnnotationById = function(id) {
  this.showAnnotation(this.shapes_[id]);
  this.drawing_.draw();
};



dsk.ImageWindow.prototype.hideAnnotation = function(shape) {
  if (shape) shape.setStrokeWidth(0);
  this.drawing_.draw();
};



dsk.ImageWindow.prototype.hideAnnotationById = function(id) {
  this.hideAnnotation(this.shapes_[id]);
  this.drawing_.draw();
};



dsk.ImageWindow.prototype.initDrawing_ = function() {
  var imageInner = goog.dom.getFirstElementChild(this.element_);
  var content = goog.dom.getLastElementChild(imageInner);
  var url = goog.dom.getFirstElementChild(content).src;
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(9)) {
    this.drawing_ = new xrx.drawing.Drawing(imageInner, xrx.graphics.Engine.VML);
  } else {
    this.drawing_ = new xrx.drawing.Drawing(imageInner, xrx.graphics.Engine.CANVAS);
  }
  goog.dom.removeNode(content);
  this.drawing_.setModeView();
  this.drawing_.setBackgroundImage(url);
  this.drawing_.draw();
};



dsk.ImageWindow.prototype.initShapes_ = function() {
  var self = this;
  self.shapes_ = goog.object.createSet(self.data_);
  goog.object.forEach(self.data_, function(e, i, o) {
    self.shapes_[i] = self.getShapeFromData(i);
  });
  self.drawing_.getLayerShape().addShapes(goog.object.getValues(self.shapes_).slice(1));
  self.drawing_.draw();
  self.drawing_.getLayerShape().setLocked(false);
};



dsk.ImageWindow.prototype.handleHover_ = function(e) {
  if (!this.view_.isTilinking()) return;
  if (this.drawing_.getViewbox().state_ === xrx.drawing.State.DRAG) return;
  var self = this;
  var shape;
  var eventPoint = [e.offsetX, e.offsetY];
  self.drawing_.getViewbox().getCTM().createInverse().transform(eventPoint, 0,
      self.mousePoint_, 0, 1);
  shape = self.drawing_.getShapeSelected(self.mousePoint_);
  if (shape) {
    var span = goog.dom.getElement(shape.id + '_start');
    self.hideAnnotation(self.highlighted_);
    self.showAnnotation(shape);
    self.highlighted_ = shape;
    self.view_.getWindowTranscription1().unhighlight();
    self.view_.getWindowTranscription1().highlight(span);
  } else {
    self.hideAnnotation(self.highlighted_);
    self.highlighted_ = null;
    self.view_.getWindowTranscription1().unhighlight();
  }
};



dsk.ImageWindow.prototype.handleOut_ = function(e) {
  this.view_.getWindowTranscription1().unhighlight();
};



dsk.ImageWindow.prototype.registerHover_ = function() {
  var self = this;
  var canvas = this.drawing_.getCanvas().getElement();
  goog.events.listen(canvas, goog.events.EventType.MOUSEMOVE, function(e) {
    self.handleHover_(e);
  }, false, self);
  goog.events.listen(canvas, goog.events.EventType.MOUSEOUT, function(e) {
    self.hideAnnotation(self.highlighted_);
  }, false, self);
};



dsk.ImageWindow.prototype.registerToolbar_ = function() {
  var self = this;
  var toolbar = goog.dom.getElementsByTagNameAndClass('div', 'toolbar', self.element_)[0];
  if (toolbar) {
    var iconZoomIn = goog.dom.getFirstElementChild(toolbar);
    var iconZoomOut = goog.dom.getNextElementSibling(iconZoomIn);
    var iconRotateLeft = goog.dom.getNextElementSibling(iconZoomOut);
    var iconRotateRight = goog.dom.getNextElementSibling(iconRotateLeft);
    var iconMagnifier = goog.dom.getNextElementSibling(iconRotateRight);
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
    goog.events.listen(iconRotateLeft, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconRotateLeft, 'cursor', 'pointer');
    });
    goog.events.listen(iconRotateLeft, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconRotateLeft, 'cursor', 'default');
    });
    goog.events.listen(iconRotateRight, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconRotateRight, 'cursor', 'pointer');
    });
    goog.events.listen(iconRotateRight, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconRotateRight, 'cursor', 'default');
    });
    goog.events.listen(iconMagnifier, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconMagnifier, 'cursor', 'pointer');
    });
    goog.events.listen(iconMagnifier, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconMagnifier, 'cursor', 'default');
    });
    goog.events.listen(iconClose, goog.events.EventType.MOUSEOVER, function(e) {
      goog.style.setStyle(iconClose, 'cursor', 'pointer');
    });
    goog.events.listen(iconClose, goog.events.EventType.MOUSEOUT, function(e) {
      goog.style.setStyle(iconClose, 'cursor', 'default');
    });
    goog.events.listen(iconZoomIn, goog.events.EventType.CLICK, function(e) {
      self.drawing_.getViewbox().zoomIn();
      self.drawing_.draw();
    });
    goog.events.listen(iconZoomOut, goog.events.EventType.CLICK, function(e) {
      self.drawing_.getViewbox().zoomOut();
      self.drawing_.draw();
    });
    goog.events.listen(iconRotateLeft, goog.events.EventType.CLICK, function(e) {
      self.drawing_.getViewbox().rotateLeft();
      self.drawing_.draw();
    });
    goog.events.listen(iconRotateRight, goog.events.EventType.CLICK, function(e) {
      self.drawing_.getViewbox().rotateRight();
      self.drawing_.draw();
    });
    goog.events.listen(iconMagnifier, goog.events.EventType.CLICK, function(e) {
      self.drawing_.getLayerTool().toggleMagnifier();
      self.drawing_.draw();
    });
    goog.events.listen(iconClose, goog.events.EventType.CLICK, function(e) {
      self.hide();
      //TODO: handle by toolbar class
      checkbox.checked = false;
    });
  }
};



dsk.ImageWindow.prototype.registerOut_ = function() {
  var self = this;
  goog.events.listen(self.drawing_.getCanvas().getElement(), goog.events.EventType.MOUSEOUT, function(e) {
    self.handleOut_(e);
  }, false, self);
};



dsk.ImageWindow.prototype.create_ = function() {
  var self = this;
  var json = goog.dom.dataset.get(self.element_, 'json');
  goog.net.XhrIo.send(json, function(e) {
    self.data_ = e.target.getResponseJson();
    self.initDrawing_();
    self.initShapes_();
    self.registerHover_();
    self.registerOut_();
  });
};
