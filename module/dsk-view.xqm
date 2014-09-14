xquery version "3.0";



module namespace dsk-view="http://semtonotes.github.io/SemToNotes/dsk-view";



import module namespace dsk-textgrid="http://semtonotes.github.io/SemToNotes/dsk-textgrid"
    at "./dsk-textgrid.xqm";
import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
    at "./dsk-conf.xqm";
import module namespace dsk-t="http://semtonotes.github.io/SemToNotes/dsk-transcription"
    at "./dsk-transcription.xqm";
import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
    at "./dsk-data.xqm";



declare namespace tei="http://www.tei-c.org/ns/1.0";
declare namespace file="http://exist-db.org/xquery/file";
declare namespace svg="http://www.w3.org/2000/svg";



declare function dsk-view:coordinates($shape as element(svg:rect), $tgl) as xs:string {

  let $image := $tgl//svg:image
  let $width := xs:integer($image/@width/string())
  let $height := xs:integer($image/@height/string())

  let $xs := substring-before($shape/@x/string(), '%')
  let $ys := substring-before($shape/@y/string(), '%')
  let $ws := substring-before($shape/@width/string(), '%')
  let $hs := substring-before($shape/@height/string(), '%')

  let $xp := if ($xs != '') then xs:double($xs) else 0
  let $yp := if ($ys != '') then xs:double($ys) else 0
  let $wp := if ($ws != '') then xs:double($ws) else 0
  let $hp := if ($hs != '') then xs:double($hs) else 0

  let $x := ($width * $xp) div 100
  let $y := ($height * $yp) div 100
  let $w := ($width * $wp) div 100
  let $h := ($height * $hp) div 100
  return

  string-join(($x, $y, $w, $h), ' ')
};



declare function dsk-view:annotations($tei as element(tei:TEI)) {
  let $pattern := replace(xmldb:decode(util:document-name($tei)), '(.){6}\.\d\.xml$', '')
  let $file-name := $conf:textgrid-tgl-file-names//file:file[starts-with(@name, $pattern) and ends-with(@name, 'tgl')]/@name/string()
  let $tgl := util:parse(util:binary-to-string(util:binary-doc('xmldb:exist://db/Export/' || $file-name[1])))
  return
  <annotations>
    {
    let $shapes := $tgl//svg:rect
    let $links := $tgl//tei:link
    for $link at $pos in $links
    let $targets := tokenize($link/@targets/string(), ' ')
    let $anchor := substring-before(substring-after($targets[2], '#'), '_start')
    let $shape-id := substring-after($targets[1], '#')
    let $shape := $shapes[@id=$shape-id]
    return
      if ($anchor != '' and not(empty($shape))) then
        element { $anchor } {
          dsk-view:coordinates($shape, $tgl)
        }
      else ()
    }
  </annotations>
};



declare function dsk-view:render($tei as element(tei:TEI)) {

let $params :=
<parameters>
  <param name="image-url" value="{ util:document-name($tei) }"/>
</parameters>

let $toolbar := 
<div class="toolbar">
  <img src="./res/zoomIn.png" title="Schrift vergrößern"/>
  <img src="./res/zoomOut.png" title="Schrift verkleinern"/>
  <img src="./res/delete.png" title="Fenster schließen"/>
</div>

return

<html xmlns="http://www.w3.org/1999/xhtml">
{ conf:html-head() }
<body>
  <div id="view-header">
    <div id="title">
      <h1><a href="./liste.html">&lt;</a> Digitale Schriftkunde</h1>
      <div id="options" class="noscript-invisible">
        <span>Bild </span>
        <input type="checkbox" class="window-image" name="window-image" checked="checked"/>
        <span> | </span>
        <span>Kommentar </span>
        <input type="checkbox" class="window-comment" name="window-comment" checked="checked"/>
        <span> | </span>
        <span>Entzifferung </span>
        <input type="checkbox" class="window-transcription1" name="window-transcription1"/>
        <span> | </span>
        <span>Transkription </span>
        <input type="checkbox" class="window-transcription2" name="window-transcription2"/>
        <span> | </span>
        <span>Text-Bild-Verknüpfung </span>
        <input type="checkbox" name="text-image-linking"/>
      </div>
    </div>
  </div>
  <div id="view-main">
    <div id="window-image" data-json="./json/{ dsk-textgrid:json-name($tei) }">
      <div id="window-image-inner">
        <div class="h1">
          <span>{ dsk-data:signature($tei) }</span>
          <div class="toolbar">
            <img src="./res/zoomIn.png" title="Bild vergrößern"/>
            <img src="./res/zoomOut.png" title="Bild verkleinern"/>
            <img src="./res/rotateLeft.png" title="Bild nach links drehen"/>
            <img src="./res/rotateRight.png" title="Bild nach rechts drehen"/>
            <img src="./res/delete.png" title="Fenster schließen"/>
          </div>
        </div>
        <div class="content">
          <img src="./img/{ dsk-textgrid:image-name($tei) }"/>
        </div>
      </div>
      <div class="resizable"></div>
    </div>
    <div id="view-text">
      <div id="view-text-inner">
        <div id="window-comment">
          <div class="h1">
            <span>Kommentar</span>
            { $toolbar }
          </div>
          <div class="content">
            <div class="p">{ dsk-t:metadata($tei) }</div>
          </div>
          <div class="resizable"></div>
        </div>
        <div id="window-transcription1">
          <div class="h1">
            <span>Entzifferung</span>
            { $toolbar }
          </div>
          <div class="content">
            <div class="p">{ dsk-t:transcription($tei, 'orig') }</div>
          </div>
          <div class="resizable"></div>
        </div>
        <div id="window-transcription2">
          <div class="h1">
            <span>Transkription</span>
            { $toolbar }
          </div>
          <div class="content">
            <div class="p">{ dsk-t:transcription($tei, 'reg') }</div>
          </div>
          <div class="resizable"></div>
        </div>
      </div>
    </div>
  </div>
  <script type="text/javascript"><!--
    dsk.installView();
  --></script>
</body>
</html>

};
