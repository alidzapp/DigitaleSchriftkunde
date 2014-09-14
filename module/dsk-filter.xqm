xquery version "3.0";



module namespace dsk-filter="http://semtonotes.github.io/SemToNotes/dsk-filter";



declare namespace tei="http://www.tei-c.org/ns/1.0";



import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
    at "./dsk-data.xqm";


declare variable $dsk-filter:DIFFICULTY := 'a';
declare variable $dsk-filter:CATEGORY := 'b';
declare variable $dsk-filter:CENTURY := 'c';
declare variable $dsk-filter:ARCHIVE := 'd';
declare variable $dsk-filter:categories := ($dsk-filter:DIFFICULTY, $dsk-filter:CATEGORY,
    $dsk-filter:CENTURY, $dsk-filter:ARCHIVE);

declare variable $dsk-filter:difficulty-elements := $dsk-data:teis//tei:classCode;
declare variable $dsk-filter:difficulty-object := dsk-filter:make-mapping($dsk-filter:difficulty-elements,
    $dsk-filter:DIFFICULTY);

declare variable $dsk-filter:category-elements := $dsk-data:teis//tei:term[1];
declare variable $dsk-filter:category-object := dsk-filter:make-mapping($dsk-filter:category-elements,
    $dsk-filter:CATEGORY);

declare variable $dsk-filter:century-elements := $dsk-data:teis//tei:date;
declare variable $dsk-filter:century-object := dsk-filter:make-mapping-centuries($dsk-filter:century-elements,
    $dsk-filter:CENTURY);

declare variable $dsk-filter:archive-elements := $dsk-data:teis//tei:institution;
declare variable $dsk-filter:archive-object := dsk-filter:make-mapping($dsk-filter:archive-elements,
    $dsk-filter:ARCHIVE);

declare variable $dsk-filter:objects := map {
  $dsk-filter:DIFFICULTY := $dsk-filter:difficulty-object,
  $dsk-filter:CATEGORY := $dsk-filter:category-object,
  $dsk-filter:CENTURY := $dsk-filter:century-object,
  $dsk-filter:ARCHIVE := $dsk-filter:archive-object
};



declare function dsk-filter:make-mapping($elements as element()+, $category as xs:string) as element() {
  let $words := $elements/text()
  let $distinct := distinct-values($words)
  return
  <object category="{ $category }">
    {
    for $d at $key in $distinct
    return
    <filter>
      <word>{ $d }</word>
      <key>{ xs:string($key) }</key>
      <count>{ count($elements[./text() = $d]) }</count>
    </filter>
    }
  </object>
};



declare function dsk-filter:make-mapping-centuries($elements as element()+, $category as xs:string) as element() {
  let $words := $elements/@from/string()
  let $centuries := distinct-values(
    for $date in $words
    return
    if (contains($date, '?')) then ()
    else
      dsk-data:century-from-date($date)
  )
  return
  <object category="{ $category }">
    {
    for $century in $centuries
    order by $century 
    return
    <filter>
      <word>{ $century }. Jh.</word>
      <key>{ $century }</key>
      <count>{ count($elements[dsk-data:century-from-date(./@from) = $century]) }</count>
    </filter>
    }
  </object>
};



declare function dsk-filter:get-key-by-word($filter-object as element(object), $word as xs:string?) {
  $filter-object//filter[./word = $word]/key/text()
};



declare function dsk-filter:url-fragment-keys($category as xs:string, $deselect-key as xs:string?) as xs:string {
  let $tokens :=
    for $f in $dsk-filter:objects($category)//filter
    return
    if (empty($deselect-key)) then
      ()
    else if ($deselect-key = $f/key/text()) then
      ()
    else $f/key/text()
  return
  string-join($tokens, '.')
};



declare function dsk-filter:url-fragment-category($category as xs:string, $deselect-key as xs:string?) as xs:string {
  '_' || $category || '_' || dsk-filter:url-fragment-keys($category, $deselect-key)
};



declare function dsk-filter:url-fragment-complete($category as xs:string?, $deselect-key as xs:string?) as xs:string {
  let $tokens :=
    for $c in $dsk-filter:categories
    return
    if ($category = $c) then
      dsk-filter:url-fragment-category($c, $deselect-key)
    else
      dsk-filter:url-fragment-category($c, ())
  return
  string-join($tokens, '')
};

