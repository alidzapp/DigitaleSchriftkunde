/**
 * @fileoverview Digitale Schriftkunde index view.
 */

goog.provide('dsk.Index');



goog.require('goog.dom.DomHelper');
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

  this.create_();
};



dsk.Index.prototype.slide = function() {
  var self = this;
  var img1 = goog.dom.getChildren(self.slider_)[self.slideOut_];
  var img2 = goog.dom.getChildren(self.slider_)[self.slideIn_];
  var fadeOut = new goog.fx.dom.FadeOutAndHide(img1, 3000);
  fadeOut.play();
  var fadeIn = new goog.fx.dom.FadeInAndShow(img2, 4000);
  fadeIn.hide();
  setTimeout(function() {
    fadeIn.play();
  }, 3000);
  self.slideOut_ += 1;
  self.slideIn_ += 1;
  if (self.slideOut_ > self.sliderLength_ - 1) {
    self.slideOut_ = 0;
  }
  if (self.slideIn_ > self.sliderLength_ - 1) {
    self.slideIn_ = 0;
  }
};



dsk.Index.prototype.initSlider_ = function() {
  var self = this;
  var pos;
  self.slider_ = goog.dom.getElement('index-slider');
  self.sliderLength_ = goog.dom.getChildren(self.slider_).length; 
};



dsk.Index.prototype.create_ = function() {
  var self = this;
  self.initSlider_();
  setInterval(function() { self.slide() }, '10000');
};
