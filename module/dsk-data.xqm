xquery version "3.0";



module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data";



declare namespace tei="http://www.tei-c.org/ns/1.0";



import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
  at './dsk-conf.xqm';
import module namespace dsk-textgrid="http://semtonotes.github.io/SemToNotes/dsk-textgrid"
  at './dsk-textgrid.xqm';
import module namespace dsk-filter="http://semtonotes.github.io/SemToNotes/dsk-filter"
  at './dsk-filter.xqm';



declare variable $dsk-data:teis := $conf:db/tei:TEI;
declare variable $dsk-data:teis-firstpage := $dsk-data:teis[not(@corresp)];
declare variable $dsk-data:items := dsk-data:items();



declare function dsk-data:items() {
  <items>
  {
    for $item at $i in $dsk-data:teis-firstpage
    let $id := concat('_', $i)
    return
    element { $id } {
      <id>{ $id }</id>,
      element { $dsk-filter:DIFFICULTY } {
        dsk-filter:get-key-by-word($dsk-filter:difficulty-object, dsk-data:difficulty($item)) 
      },
      element { $dsk-filter:CATEGORY } {
        dsk-filter:get-key-by-word($dsk-filter:category-object, dsk-data:category($item))
      },
      element { $dsk-filter:CENTURY } {
        dsk-filter:get-key-by-word($dsk-filter:century-object, dsk-data:century($item))
      },
      element { $dsk-filter:ARCHIVE } {
        dsk-filter:get-key-by-word($dsk-filter:archive-object, dsk-data:archive($item))
      },
      element { $dsk-filter:LANGUAGE } {
        dsk-filter:get-key-by-word($dsk-filter:language-object, dsk-data:language($item))
      }
    }
  }
  </items>
};



declare function dsk-data:signature($tei as element(tei:TEI)) {
  $tei//tei:institution/text() || ', ' || $tei//tei:collection/text() || ' ' ||
      $tei//tei:idno/text()
};



declare function dsk-data:difficulty($tei as element(tei:TEI)) {
  $tei//tei:classCode/text()
};



declare function dsk-data:category($tei as element(tei:TEI)) {
  ($tei//tei:term)[1]/text()
};



declare function dsk-data:century($tei as element(tei:TEI)) {
  concat(dsk-data:century-from-date($tei//tei:date/@from/string()), '. Jh.')
};



declare function dsk-data:archive($tei as element(tei:TEI)) {
  $tei//tei:institution/text()
};



declare function dsk-data:language($tei as element(tei:TEI)) {
  if ($tei//tei:editor/text() = ('ullrich.lindemann@textgrid.de','katharina.wolff@textgrid.de')) then 'lateinische Schriftkunde'
  else 'deutsche Schriftkunde'
};



declare function dsk-data:century-from-date($date as xs:string) as xs:string {
  try {
    xs:string(floor(xs:integer(substring-before($date, '-')) div 100) + 1)
  } catch * {
    ''
  }
};
