/**
 * @fileoverview The SemToNotes main class.
 */

goog.provide('dsk');



goog.require('goog.dom.DomHelper');
goog.require('dsk.Index');
goog.require('dsk.List');
goog.require('dsk.View');
goog.require('xrx');



dsk.installIndex = function() {
  return new dsk.Index(goog.dom.getDocument());
};



dsk.installList = function() {
  return new dsk.List(goog.dom.getDocument());
};



dsk.installView = function() {
  return new dsk.View(goog.dom.getDocument());
};
