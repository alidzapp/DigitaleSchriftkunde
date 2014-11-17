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
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('dsk.Window');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.State');
goog.require('xrx.drawing.tool.Magnifier');
goog.require('xrx.engine.Engine');
goog.require('xrx.shape.Polygon');



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



dsk.ImageWindow.prototype.getCanvasHeight = function() {
  return this.drawing_.getLayerBackground().getImage().getHeight();
};



dsk.ImageWindow.prototype.getCanvasWidth = function() {
  return this.drawing_.getLayerBackground().getImage().getWidth();
};



dsk.ImageWindow.prototype.getShapeFromData = function(id) {
  var polygon;
  var x, y, w, h;
  var coords = [];
  var points = this.data_[id].split(' ');
  var point;
  var p;

  for(var i = 0, len = points.length; i < len; i++) {
    p = new Array(2);
    point = points[i].split(',');
    p[0] = parseFloat(point[0]);
    p[1] = parseFloat(point[1]);
    coords.push(p);
  }

  polygon = new xrx.shape.Polygon(this.drawing_);
  polygon.id = id;
  polygon.setCoords(coords);
  polygon.setStrokeWidth(0);
  polygon.setStrokeColor('');

  return polygon;
};



dsk.ImageWindow.prototype.getDrawing = function() {
  return this.drawing_;
};



dsk.ImageWindow.prototype.showAnnotation = function(shape) {
  if (shape) shape.setStrokeWidth(5);
  if (shape) shape.setStrokeColor('#FF9900');
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
  var self = this;
  var imageInner = goog.dom.getElement('window-image-inner');
  var content = goog.dom.getLastElementChild(imageInner);
  var img = goog.dom.getFirstElementChild(content);
  var url = img.src;
  var pos = goog.style.getPosition(content);
  goog.style.setPosition(content, pos.x, pos.y + 44);
  goog.style.setStyle(content, 'overflow', 'hidden');
  this.drawing_ = new xrx.drawing.Drawing(content);
  goog.dom.removeNode(img);
  this.drawing_.setModeView();
  this.drawing_.setBackgroundImage(url, function() {
    self.view_.initLayout();
    self.drawing_.draw();
  });
  if (xrx.engine.isOldIE()) {
    var span = goog.dom.createElement('span');
    goog.dom.setTextContent(span, 'Sie verwenden einen alten Internet Explorer. ' +
        'Verschieben sie das Bild nur langsam und nur außerhalb der Bild-Annotationen.');
    goog.style.setStyle(span, 'position', 'absolute');
    goog.style.setStyle(span, 'color', 'red');
    goog.style.setStyle(span, 'top', '0px');
    goog.style.setStyle(span, 'left', '0px');
    goog.style.setStyle(span, 'z-index', '999');
    goog.style.setStyle(span, 'background-color', 'white');
    goog.dom.insertChildAt(goog.dom.getDocument().body, span, 0);
  }
};



dsk.ImageWindow.prototype.initShapes_ = function() {
  var self = this;
  self.shapes_ = goog.object.createSet(self.data_);
  goog.object.forEach(self.data_, function(e, i, o) {
    self.shapes_[i] = self.getShapeFromData(i);
  });
  self.drawing_.getLayerShape().addShapes(goog.object.getValues(self.shapes_).slice(1));
  self.drawing_.getLayerShape().setLocked(false);
};



dsk.ImageWindow.prototype.handleHover_ = function(e) {
  if (!this.view_.isTilinking()) return;
  if (this.drawing_.getViewbox().state_ === xrx.drawing.State.DRAG) return;
  var self = this;
  var shape;
  var wPos = goog.style.getClientPosition(this.drawing_.getCanvas().getElement());
  var eventPoint = [e.clientX - wPos.x, e.clientY - wPos.y];
  self.drawing_.getViewbox().getCTM().createInverse().transform(eventPoint, 0,
      self.mousePoint_, 0, 1);
  shape = self.drawing_.getShapeSelected(self.mousePoint_);
  if (shape) {
    var span = goog.dom.getElement(shape.id + '_start');
    self.hideAnnotation(self.highlighted_);
    self.showAnnotation(shape);
    self.highlighted_ = shape;
    self.view_.getWindowTranscription1().unhighlight();
    self.view_.getWindowTranscription1().highlight(span, true);
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
  }, true, self);
  goog.events.listen(canvas, goog.events.EventType.MOUSEOUT, function(e) {
    self.hideAnnotation(self.highlighted_);
  }, true, self);
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
  goog.events.listen(self.element_, goog.events.EventType.MOUSEOUT, function(e) {
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
