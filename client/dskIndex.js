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
goog.require('xrx.mvc.Components');



/**
 * @constructor
 */
dsk.Index = function(element) {

  this.element_ = element;

  this.slider_;

  this.slide_ = 0;

  this.sliderLength_;

  this.imageHover_ = false;

  this.forward_ = true;

  this.create_();
};



dsk.Index.prototype.getForwardImage = function() {
  var next = this.slide_ + 1;
  return next > this.sliderLength_ - 1 ? 0 : next;
};



dsk.Index.prototype.getBackwardImage = function() {
  var next = this.slide_ - 1;
  return next < 0 ? this.sliderLength_ - 1 : next;
};



dsk.Index.prototype.slide = function() {
  if (this.imageHover_) return;
  var forwardImage = this.getForwardImage();
  var img1 = goog.dom.getChildren(this.slider_)[this.slide_];
  var img2 = goog.dom.getChildren(this.slider_)[forwardImage];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 5000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 7000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 5500);
  this.slide_ = forwardImage;
  this.forward_ = true;
};



dsk.Index.prototype.slideForward = function() {
  var forwardImage = this.getForwardImage();
  var img1 = goog.dom.getChildren(this.slider_)[this.slide_];
  var img2 = goog.dom.getChildren(this.slider_)[forwardImage];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 1000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 2000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 1200);
  this.slide_ = forwardImage;
  this.forward_ = true;
};



dsk.Index.prototype.slideBackward = function() {
  var backwardImage = this.getBackwardImage();
  var img1 = goog.dom.getChildren(this.slider_)[this.slide_];
  var img2 = goog.dom.getChildren(this.slider_)[backwardImage];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 1000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 2000);
  fadeIn.hide();
  window.setTimeout(function() {
    fadeIn.play();
  }, 1200);
  this.slide_ = backwardImage;
  this.forward_ = false;
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
