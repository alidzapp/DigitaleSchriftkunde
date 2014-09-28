xquery version "3.0";



import module namespace dsk="http://semtonotes.github.io/SemToNotes/dsk"
  at '../module/dsk.xqm';
import module namespace dsk-about="http://semtonotes.github.io/SemToNotes/dsk-about"
  at '../module/dsk-about.xqm';
import module namespace dsk-list="http://semtonotes.github.io/SemToNotes/dsk-list"
  at '../module/dsk-list.xqm';
import module namespace dsk-view="http://semtonotes.github.io/SemToNotes/dsk-view"
  at '../module/dsk-view.xqm';
import module namespace dsk-textgrid="http://semtonotes.github.io/SemToNotes/dsk-textgrid"
  at '../module/dsk-textgrid.xqm';
import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
  at '../module/dsk-conf.xqm';
import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
  at '../module/dsk-data.xqm';
import module namespace dsk-filter="http://semtonotes.github.io/SemToNotes/dsk-filter"
  at '../module/dsk-filter.xqm';



declare namespace tei="http://www.tei-c.org/ns/1.0";



declare option exist:serialize "method=xml media-type=application/xml indent=yes";



declare variable $base := 'C:\wamp\www\GitHub\eXist\webapp\DigitaleSchriftkunde\';



declare function local:compile-html($element as element(), $path as xs:string) {
  let $serialized := util:string-to-binary(util:serialize($element, 'method=html5 media-type=text/html indent=no'))
  return
  system:as-user('admin', $conf:pswd, file:serialize-binary($serialized, concat($base, $path)))
};


declare function local:compile-json($element as element(), $path as xs:string) {
  let $serialized := util:string-to-binary(util:serialize($element, 'method=json media-type=text/javascript'))
  return
  system:as-user('admin', $conf:pswd, file:serialize-binary($serialized, concat($base, $path)))
};




let $teis := $conf:db/tei:TEI (:[.//tei:idno/text() = '770']:)
let $compile := 
(
  (: HTML pages :)
  local:compile-html(dsk:render(), 'index.html'),
  local:compile-html(dsk-about:render(), 'about.html'),
  for $sort at $n in $dsk-list:sort
  return
  local:compile-html(dsk-list:render($sort), $dsk-list:html-names[$n]),
  for $tei in $teis
  return
  local:compile-html(dsk-view:render($tei), dsk-textgrid:html-name($tei)),
  (: JSON objects :)
  local:compile-json($dsk-data:items, './json/liste.json'),
  for $tei in $teis
  return
  local:compile-json(dsk-view:annotations($tei), './json/' || dsk-textgrid:json-name($tei))
)
return
$teis
