xquery version "3.0";



module namespace dsk="http://semtonotes.github.io/SemToNotes/dsk";



declare namespace tei="http://www.tei-c.org/ns/1.0";



import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
    at "./dsk-conf.xqm";
import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
    at "./dsk-data.xqm";
import module namespace dsk-filter="http://semtonotes.github.io/SemToNotes/dsk-filter"
    at "./dsk-filter.xqm";
import module namespace dsk-list="http://semtonotes.github.io/SemToNotes/dsk-list"
    at "./dsk-list.xqm";



(: word cloud :)
declare variable $dsk:f := 17;
declare variable $dsk:min := 10;
declare variable $dsk:max := count($conf:db/tei:TEI);

(: page :)
declare variable $dsk:link-to-list := './liste.html';



declare function dsk:size($count) {
  let $size := round( ($count + $dsk:min) div $dsk:max * 100 * $dsk:f)
  return 
  concat('font-size:', $size, '%;line-height:1em;')
};



declare function dsk:word-link($words as xs:string*, $category as xs:string) {
  let $word := conf:word($words[1])
  let $key := dsk-filter:get-key-by-word($dsk-filter:objects($category), $word)
  let $link := concat($dsk:link-to-list, '#', dsk-filter:url-fragment-complete($category, $key)) 
  return
  <span xmlns="http://www.w3.org/1999/xhtml"><a href="{ $link }">{ $word }</a><br/></span>
};



declare function dsk:word-links($elements as element()*, $category as xs:string) {
  let $words := $elements/text()
  let $distinct := distinct-values($words)
  for $d in $distinct
  order by $d
  return
  dsk:word-link($elements[./text() = $d], $category)
};



declare function dsk:century-links() {
  for $f in $dsk-filter:century-object/filter
  let $key := $f/key/text()
  let $word := $f/word/text()
  let $count := $f/count/text()
  let $link := concat($dsk:link-to-list, '#', dsk-filter:url-fragment-complete($dsk-filter:CENTURY, $key))
  order by xs:integer($key)
  return
  <span xmlns="http://www.w3.org/1999/xhtml"><a href="{ $link }">{ $word }</a><br/></span>
};



declare function dsk:word-cloud() {
  <div xmlns="http://www.w3.org/1999/xhtml">
    <span class="preselection">Vorauswahl<br/></span>
    <div class="right-block">{ dsk:century-links() }</div>
    <div class="right-block">{ dsk:word-links($conf:db//tei:term, $dsk-filter:CATEGORY) }</div>
    <div class="right-block">{ dsk:word-links($conf:db//tei:institution, $dsk-filter:ARCHIVE) }</div>
  </div>
};



declare function dsk:render() {

<html xmlns="http://www.w3.org/1999/xhtml">
{ conf:html-head() }
<body>
  <div id="container">
    <div class="wrapper">
      <header>
        <div id="head">
          <div id="title" class="center">
            <h1>Digitale Schriftkunde</h1>
          </div>
        </div>
      </header>
      <div id="main">
        <div id="index-wordcloud">{ dsk:word-cloud() }</div>
        <div id="index-image">
          <div id="index-slider">
            <a href="./1496_BayHStA_KU_Frauenchiemsee_88_03.html#_a__b__c__d__e_">
              <img src="./slider/1496_BayHStA_KU_Frauenchiemsee_88.jpg"/>
            </a>
            <a href="./18_Jh_BayHStA_KurbayernAeA_2160_Attenkofer_II.html#_a__b__c__d__e_" style="display:none">
              <img src="./slider/1529_BayHStA_Kurbayern-Aeußeres-Archiv_2160.jpg"/>
            </a>
            <a href="./1705_BayHStA_KL-Benediktbeuren_107-1-3_1.html#_a__b__c__d__e_" style="display:none">
              <img src="./slider/1705_BayHStA_KL-Benediktbeuren_107-1-3.jpg"/>
            </a>
            <a href="./1799_bayHStA_KL-Abensberg_8_fol_3r.html" style="display:none">
              <img src="./slider/1799_bayHStA_KL-Abensberg_8_fol_3r.jpg"/>
            </a>
            <a href="./1803_BayHStA_Kurbayern-Buecherzensurkollegium_770.html" style="display:none">
              <img src="./slider/1803_BayHStA_Kurbayern-Buecherzensurkollegium_770.jpg"/>
            </a>
          </div>
          <img id="index-arrowLeft" src="./res/arrowLeft.png" class="noscript"/>
          <img id="index-arrowRight" src="./res/arrowRight.png" class="noscript"/>
        </div>
        <div id="index-content">
          <p>Herzlich willkommen in der Digitalen Schriftkunde,  der Lese- und Übungsumgebung der Staatlichen Archive Bayerns!  Wir präsentieren hier ausgewählte Quellenbeispiele aus unseren Beständen, die wir mit Entzifferungshilfen und Transkriptionen aufbereitet haben. Wir wünschen Ihnen lehrreiche Lektüre und gewinnbringende Übungsstunden.</p>
          <p>&#160;</p>
          <p>Dieses Angebot wurde durch Mittel des Staatsministeriums für Bildung und Kultus, Wissenschaft und Kunst ermöglicht.</p>
        </div>
        <div id="index-link">
          <a class="large" href="{ $dsk:link-to-list }#{ dsk-filter:url-fragment-complete((), ()) }">Zu den Schriftbeispielen</a>
        </div>
        <div id="about-link">
          <a class="large" href="./about.html">Über dieses Angebot</a>
        </div>
        <div id="index-logo">
          <img src="./icon/bayhsta.gif"/>
        </div>
      </div>
      { conf:footer() }
    </div>
  </div>
  <script type="text/javascript"><!--
    dsk.installIndex();
  --></script>
</body>
</html>

};
