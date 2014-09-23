/**
 * @fileoverview Digitale Schriftkunde index view.
 */

goog.provide('dsk.Index');



goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.dom.FadeOutAndHide');
goog.require('goog.fx.dom.FadeInAndShow');
goog.require('goog.style');



/**
 * @constructor
 */
dsk.Index = function(element) {

  this.element_ = element;

  this.slider_;

  this.slideOut_ = 0;

  this.slideIn_ = 1;

  this.sliderLength_;

  this.imageHover_ = false;

  this.create_();
};



dsk.Index.prototype.slide = function() {
  if (this.imageHover_) return;
  var self = this;
  var img1 = goog.dom.getChildren(self.slider_)[self.slideOut_];
  var img2 = goog.dom.getChildren(self.slider_)[self.slideIn_];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 5000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 7000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 5500);
  self.slideOut_ += 1;
  self.slideIn_ += 1;
  if (self.slideOut_ > self.sliderLength_ - 1) {
    self.slideOut_ = 0;
  }
  if (self.slideIn_ > self.sliderLength_ - 1) {
    self.slideIn_ = 0;
  }
};



dsk.Index.prototype.slideForward = function() {
  var self = this;
  var img1 = goog.dom.getChildren(self.slider_)[self.slideOut_];
  var img2 = goog.dom.getChildren(self.slider_)[self.slideIn_];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 1000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 2000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 1200);
  self.slideOut_ += 1;
  self.slideIn_ += 1;
  if (self.slideOut_ > self.sliderLength_ - 1) {
    self.slideOut_ = 0;
  }
  if (self.slideIn_ > self.sliderLength_ - 1) {
    self.slideIn_ = 0;
  }
};



dsk.Index.prototype.slideBackward = function() {
  var self = this;
  var img1 = goog.dom.getChildren(self.slider_)[self.slideOut_];
  var img2 = goog.dom.getChildren(self.slider_)[self.slideIn_];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 1000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 2000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 1200);
  self.slideOut_ -= 1;
  self.slideIn_ -= 1;
  if (self.slideOut_ < 0) {
    self.slideOut_ = self.sliderLength_ - 1;
  }
  if (self.slideIn_ < 0) {
    self.slideIn_ = self.sliderLength_ - 1;
  }
};



dsk.Index.prototype.initSlider_ = function() {
  var self = this;
  var pos;
  self.slider_ = goog.dom.getElement('index-slider');
  self.sliderLength_ = goog.dom.getChildren(self.slider_).length; 
};


dsk.Index.prototype.registerNavigation_ = function() {
  var self = this;
  var indexImage = goog.dom.getElement('index-image');
  var arrowLeft = goog.dom.getElement('index-arrowLeft');
  var arrowRight = goog.dom.getElement('index-arrowRight');
  goog.events.listen(indexImage, goog.events.EventType.MOUSEOVER, function(e) {
    self.imageHover_ = true;
    goog.style.setStyle(arrowLeft, 'display', 'block');
    goog.style.setStyle(arrowRight, 'display', 'block');
  });
  goog.events.listen(indexImage, goog.events.EventType.MOUSEOUT, function(e) {
    self.imageHover_ = false;
    goog.style.setStyle(arrowLeft, 'display', 'none');
    goog.style.setStyle(arrowRight, 'display', 'none');
  });
  goog.events.listen(arrowLeft, goog.events.EventType.MOUSEOVER, function(e) {
    goog.style.setStyle(arrowLeft, 'cursor', 'pointer');
  });
  goog.events.listen(arrowLeft, goog.events.EventType.MOUSEOUT, function(e) {
    goog.style.setStyle(arrowLeft, 'cursor', 'default');
  });
  goog.events.listen(arrowRight, goog.events.EventType.MOUSEOVER, function(e) {
    goog.style.setStyle(arrowRight, 'cursor', 'pointer');
  });
  goog.events.listen(arrowRight, goog.events.EventType.MOUSEOUT, function(e) {
    goog.style.setStyle(arrowRight, 'cursor', 'default');
  });
  goog.events.listen(arrowLeft, goog.events.EventType.CLICK, function(e) {
    self.slideBackward();
  });
  goog.events.listen(arrowRight, goog.events.EventType.CLICK, function(e) {
    self.slideForward();
  });
};



dsk.Index.prototype.create_ = function() {
  var self = this;
  self.initSlider_();
  self.registerNavigation_();
  window.setInterval(function() { self.slide() }, '18000');
};
