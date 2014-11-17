/**
 * @fileoverview Digitale Schriftkunde list view.
 */

goog.provide('dsk.List');



goog.require('dsk.Filter');
goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.style');



dsk.List = function(element) {

  this.element_ = element;

  this.domList_;

  this.filter_;

  this.domFilter_;

  this.data_;

  this.create_();  
};



dsk.List.prototype.getData = function() {
  return this.data_;
};



dsk.List.prototype.install_ = function() {
  var self = this;
  this.domList_ = goog.dom.getElement('list');
  this.domFilter_ = goog.dom.getElement('list-filter');
  this.filter_ = new dsk.Filter(self.domFilter_, self);
};



dsk.List.prototype.registerEvents_ = function() {
  var self = this;
  goog.events.listen(self.domFilter_, goog.events.EventType.CLICK, function(e) {
    switch (e.target.tagName.toLowerCase()) {
    case 'input':
        if (e.target.getAttribute('class') == 'select-all') {
          self.filter_.handleSelectAll(e.target);
        } else {
          self.filter_.handleSelected(e.target);
        }
      break;
    default:
      break;
    };
  }, false, self)
};



dsk.List.prototype.create_ = function() {
  var self = this;
  goog.net.XhrIo.send('./json/liste.json', function(e) {
    self.data_ = e.target.getResponseJson();
    self.install_();
    self.registerEvents_();
  });
};
