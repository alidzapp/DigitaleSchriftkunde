xquery version "3.0";



module namespace dsk-list="http://semtonotes.github.io/SemToNotes/dsk-list";



import module namespace dsk-textgrid="http://semtonotes.github.io/SemToNotes/dsk-textgrid"
  at './dsk-textgrid.xqm';
import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
  at './dsk-conf.xqm';
import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
    at "./dsk-data.xqm";
import module namespace dsk-filter="http://semtonotes.github.io/SemToNotes/dsk-filter"
    at "./dsk-filter.xqm";



declare namespace tei="http://www.tei-c.org/ns/1.0";
declare namespace file="http://exist-db.org/xquery/file";



declare variable $dsk-list:sort := ('default', 'date-ascending', 'date-descending', 'archive', 'category');
declare variable $dsk-list:html-names := ('liste.html', 'liste-nach-datum-aufsteigend.html', 'liste-nach-datum-absteigend.html',
   'liste-nach-archiv.html', 'liste-nach-archivaliengattung.html');



declare function dsk-list:filter-option($filter as element(filter), $category as xs:string) {
  <span class="h2">
    <input type="checkbox" checked="checked" name="{ $category }___{ $filter/key/text() }"/>
    <span>{ $filter/word/text() }&#160;</span>
    <span class="light-grey noscript">({ $filter/count/text() })&#160;</span>
    <span>({ $filter/count/text() })</span>
    <br/>
  </span>
};



declare function dsk-list:filter-options($filter-object as element(object)) {
  let $category := $filter-object/@category/string()
  for $filter in $filter-object/filter
  return
  dsk-list:filter-option($filter, $category)
};



declare function dsk-list:list-item($tei as element(tei:TEI), $id as xs:string) {
  let $signature := dsk-data:signature($tei)
  let $abstract := $tei//tei:abstract//text()
  let $date := $tei//tei:date/text()
  let $difficulty := $tei//tei:classCode/text()
  let $pattern := replace(xmldb:decode(util:document-name($tei)), '(.){6}\.\d\.xml$', '')
  let $file-name := $conf:data//file:file[starts-with(@name, $pattern) and ends-with(@name, 'jpg')]/@name/string()
  let $category := ($tei//tei:term)[1]/text()
  return
  <div class="list-item" id="{ $id }">
    <div class="thumb">
      <img src="./thumb/{ $file-name[1] }" title="{ $file-name[1] }"/>
    </div>
    <div class="abstract">
      <span><a href="./{ dsk-textgrid:html-name($tei) }">{ $signature }</a></span><br/>
      <span>{ $abstract } ({ $category })</span><br/>
      <span>{ $date }</span><br/>
      <span>{ $difficulty }</span>
    </div>
  </div>
};



declare function dsk-list:list-items($sort) {

  if ($sort = 'date-ascending') then
    for $tei at $pos in $dsk-data:teis
    order by $tei//tei:date/@from ascending
    return
    dsk-list:list-item($tei, ($dsk-data:items/*)[$pos]/name())
  else if ($sort = 'date-descending') then
    for $tei at $pos in $dsk-data:teis
    order by $tei//tei:date/@from descending
    return
    dsk-list:list-item($tei, ($dsk-data:items/*)[$pos]/name())
  else if ($sort = 'archive') then
    for $tei at $pos in $dsk-data:teis
    order by $tei//tei:institution/text()
    return
    dsk-list:list-item($tei, ($dsk-data:items/*)[$pos]/name())
  else if ($sort = 'category') then
    for $tei at $pos in $dsk-data:teis
    order by ($tei//tei:term)[1]/text()
    return
    dsk-list:list-item($tei, ($dsk-data:items/*)[$pos]/name())
  else 
    for $tei at $pos in $dsk-data:teis
    order by $tei//tei:date/@from ascending
    return
    dsk-list:list-item($tei, ($dsk-data:items/*)[$pos]/name())
};



declare function dsk-list:render($sort as xs:string) {

<html xmlns="http://www.w3.org/1999/xhtml">
{ conf:html-head() }
<body>
  <div id="container">
    <div class="wrapper">
      <header>
        <div id="head">
          <div id="title">
            <h1><a href="./index.html">&lt;</a> Digitale Schriftkunde</h1>
          </div>
        </div>
      </header>
      <div id="main">
        <div id="list-content">
          <div id="list-filter">
            <span>
              <span class="h1">Sortieren nach</span><br/>
              <span class="h2"><a href="./liste-nach-datum-aufsteigend.html">Datum (älteste zuerst)</a></span><br/>
              <span class="h2"><a href="./liste-nach-datum-absteigend.html">Datum (jüngste zuerst)</a></span><br/>
              <span class="h2"><a href="./liste-nach-archiv.html">Archiv</a></span><br/>
              <span class="h2"><a href="./liste-nach-archivaliengattung.html">Archivaliengattung</a></span><br/>
            </span>
            <span class="h1">Schwierigkeitsgrad</span><br/>
            { dsk-list:filter-options($dsk-filter:difficulty-object) }
            <span class="h1">Archivaliengattung</span><br/>
            { dsk-list:filter-options($dsk-filter:category-object) }
            <span class="h1">Jahrhundert</span><br/>
            { dsk-list:filter-options($dsk-filter:century-object) }
            <span class="h1">Archiv</span><br/>
            { dsk-list:filter-options($dsk-filter:archive-object) }
          </div>
          <div id="list">
            <div>{ dsk-list:list-items($sort) }</div>
          </div>
        </div>
      </div>
      { conf:footer() }
    </div>
  </div>
  <script type="text/javascript"><!--
    dsk.installList();
  --></script>
</body>
</html>

};
