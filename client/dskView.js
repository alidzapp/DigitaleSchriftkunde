/**
 * @fileoverview Digitale Schriftkunde item view.
 */

goog.provide('dsk.View');



goog.require('dsk.HoverWindow');
goog.require('dsk.ImageWindow');
goog.require('dsk.Window');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.dom.DomHelper');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.Uri');



dsk.View = function(element) {

  this.element_ = element;

  this.window_ = {
    'window-image': null,
    'window-comment': null,
    'window-transcription1': null,
    'window-transcription2': null
  };

  this.tilinking_ = true;

  this.create_();
};



dsk.View.prototype.isTilinking = function() {
  return this.tilinking_
};



dsk.View.prototype.getWindowImage = function() {
  return this.window_[dsk.Window.IMAGE];
};



dsk.View.prototype.getWindowTranscription1 = function() {
  return this.window_[dsk.Window.T1];
};



dsk.View.prototype.initView_ = function() {
  var image = goog.dom.getElement(dsk.Window.IMAGE);
  var comment = goog.dom.getElement(dsk.Window.COMMENT);
  var t1 = goog.dom.getElement(dsk.Window.T1);
  var t2 = goog.dom.getElement(dsk.Window.T2);
  var height = goog.style.getSize(comment).height;
  this.window_[dsk.Window.IMAGE] = new dsk.ImageWindow(image, 0, this);
  this.window_[dsk.Window.COMMENT] = new dsk.Window(comment, 0);
  //this.window_[dsk.Window.COMMENT].setOptimalHeight();
  this.window_[dsk.Window.T1] = new dsk.HoverWindow(t1, 1, this, height);
  this.window_[dsk.Window.T2] = new dsk.Window(t2, 2, height);
  this.window_[dsk.Window.T2].hide();
  var viewMain = goog.dom.getElement('view-main');
  var viewText = goog.dom.getElement('view-text');
  var viewTextInner = goog.dom.getElement('view-text-inner');
  goog.style.setStyle(viewMain, 'z-index', '15');
  goog.style.setStyle(viewText, 'z-index', '15');
  goog.style.setStyle(viewTextInner, 'z-index', '15');
};



dsk.View.prototype.isPanelFormat = function() {
  return this.window_[dsk.Window.IMAGE].getCanvasHeight() >=
      this.window_[dsk.Window.IMAGE].getCanvasWidth();
};



dsk.View.prototype.isLandscapeFormat = function() {
  return !this.isPanelFormat() &&
      (this.window_[dsk.Window.IMAGE].getCanvasWidth() /
          this.window_[dsk.Window.IMAGE].getCanvasHeight()) <= 1.3;
};



dsk.View.prototype.isExtremeLandscapeFormat = function() {
  return !this.isPanelFormat() && !this.isLandscapeFormat();
};



dsk.View.prototype.initLayout = function() {
  // the windows
  var wImage = this.window_[dsk.Window.IMAGE];
  var wComment = this.window_[dsk.Window.COMMENT];
  var wT1 = this.window_[dsk.Window.T1];
  var wT2 = this.window_[dsk.Window.T2];

  var pos = goog.style.getClientPosition(wImage.getElement());
  var size = goog.style.getSize(wImage.getElement());
  var title = goog.dom.getElement('title');
  var titlePos = goog.style.getClientPosition(title);
  var titleSize = goog.style.getSize(title);

  var moveWindowToRight = function(w, height, top) {
    var x = titlePos.x + titleSize.width - (size.width * 2 / 3);
    goog.style.setSize(w.getElement(), size.width * 2 / 3, height);
    goog.style.setPageOffset(w.getElement(), x, top);
  };
  if (this.isPanelFormat()) {
    wImage.getDrawing().getViewbox().setOptimalHeight();
  } else if (this.isLandscapeFormat()) {
    // flatten the wrapping text divs 
    var divText = goog.dom.getElement('view-text');
    var divTextInner = goog.dom.getElement('view-text-inner');
    goog.dom.flattenElement(divText);
    goog.dom.flattenElement(divTextInner);

    goog.style.setSize(wImage.getElement(), size.width * 4 / 3, size.height);
    moveWindowToRight(wComment, (size.height * 37 / 100), pos.y);
    moveWindowToRight(wT1, (size.height * 37 / 100), pos.y + (size.height * 37 / 100) + 10);
    moveWindowToRight(wT2, (size.height * 25 / 100), pos.y + (size.height * 37 / 100 * 2) + 20);
    wImage.getDrawing().handleResize();
    wImage.getDrawing().getViewbox().setOptimalWidth();
  } else {
    // flatten the wrapping text divs 
    var divText = goog.dom.getElement('view-text');
    var divTextInner = goog.dom.getElement('view-text-inner');
    goog.dom.flattenElement(divText);
    goog.dom.flattenElement(divTextInner);

    var factor = 2 / 3; // height

    // image window
    goog.style.setSize(wImage.getElement(), size.width * 4 / 3, size.height * factor - 10);

    // comment window
    goog.style.setPageOffset(wComment.getElement(), pos.x + size.width * 4 / 3 + 18, pos.y);
    goog.style.setSize(wComment.getElement(), size.width * 2 / 3, size.height * factor - 10);

    // transcription 1
    goog.style.setPageOffset(wT1.getElement(), pos.x, pos.y + size.height * factor);
    goog.style.setSize(wT1.getElement(), size.width * 4 / 3, size.height * 1 / 3);

    // transcription 2
    var s = goog.style.getSize(wT2.getElement());
    var p = goog.style.getPosition(wT2.getElement());
    var cp = goog.style.getClientPosition(wComment.getElement());
    goog.style.setSize(wT2.getElement(), size.width * 2 / 3, size.height * 1 / 3);
    goog.style.setPageOffset(wT2.getElement(), cp.x, pos.y + size.height * factor);
    wImage.getDrawing().handleResize();
    wImage.getDrawing().getViewbox().setOptimalWidth();
  }
};



dsk.View.prototype.initBacklink_ = function() {
  var href;
  var uri = new goog.Uri(window.location.href);

  // header
  var viewHeader = goog.dom.getElement('view-header');
  var backlink = goog.dom.getElementsByTagNameAndClass('a', undefined, viewHeader)[0];
  href = backlink.href + '#' + uri.getFragment();
  backlink.href = href;

  // pages
  var viewPages = goog.dom.getElement('view-pages');
  var backlinks = goog.dom.getElementsByTagNameAndClass('a', undefined, viewPages);
  for(var i = 0, len = backlinks.length; i < len; i++) {
    href = backlinks[i].href + '#' + uri.getFragment();
    backlinks[i].href = href;
  }
};



dsk.View.prototype.handleShowWindow_ = function(e) {
  var self = this;
  var checkbox = e.target;
  var w = self.window_[checkbox.name.substring(1)];
  switch(checkbox.name.substring(1)) {
  case dsk.Window.IMAGE:
  case dsk.Window.COMMENT:
  case dsk.Window.T1:
  case dsk.Window.T2:
    if (checkbox.checked) {
      w.show();
      self.handleFocusWindow_(w);
    } else {
      w.hide();
    }
    break;
  default:
    break;
  };
};



dsk.View.prototype.registerShow_ = function() {
  var self = this;
  var options = goog.dom.getElement('options');
  var checkboxes = goog.dom.getElementsByTagNameAndClass('input', undefined,
      options);
  goog.array.forEach(checkboxes, function(e, i, a) {
    goog.events.listen(e, goog.events.EventType.CLICK, function(e) {
      self.handleShowWindow_(e);
    }, false, self)
  });
};



dsk.View.prototype.handleFocusWindow_ = function(win) {
  var self = this;
  goog.object.forEach(self.window_, function(e, i, o) {
    if (e === win) {
      e.focus(true);
    } else {
      e.focus(false);
    }
  });
};



dsk.View.prototype.registerFocus_ = function() {
  var self = this;
  goog.object.forEach(self.window_, function(e, i, o) {
    goog.events.listen(e.getElement(), goog.events.EventType.MOUSEDOWN, function(event) {
      self.handleFocusWindow_(e);
    }, false, self)
  });
};



dsk.View.prototype.registerOut_ = function() {
  var viewMain = goog.dom.getElement('view-main');
  var toolbars = goog.dom.getElementsByTagNameAndClass('div', 'toolbar');
  goog.events.listen(viewMain, goog.events.EventType.MOUSEOVER, function(e) {
    e.preventDefault();
    e.stopPropagation();
    for (var i = 0, len = toolbars.length; i < len; i++) {
      goog.style.setStyle(toolbars[i], 'display', 'none');
    }
  }, true, this);
};



dsk.View.prototype.registerTilinking_ = function() {
  var self = this;
  var options = goog.dom.getElement('options');
  var checkboxes = goog.dom.getElementsByTagNameAndClass('input', undefined, options);
  var checkbox = checkboxes[checkboxes.length - 1];

  goog.events.listen(checkbox, goog.events.EventType.CLICK, function(e) {
    checkbox.checked ? self.tilinking_ = true : self.tilinking_ = false;
  })
};



dsk.View.prototype.initNoscript_ = function() {
  var self = this;
  var elements = goog.dom.getElementsByTagNameAndClass(undefined, 'noscript-invisible',
      self.element_);
  goog.array.forEach(elements, function(e, i, a) {
    goog.style.setStyle(e, 'visibility', 'visible');
  })
};



dsk.View.prototype.create_ = function() {
  this.initView_();
  this.initBacklink_();
  this.registerShow_();
  this.registerFocus_();
  this.registerTilinking_();
  this.initNoscript_();
};
