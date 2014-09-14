xquery version "3.0";



module namespace dsk-textgrid="http://semtonotes.github.io/SemToNotes/dsk-textgrid";



import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
    at "./dsk-conf.xqm";



declare namespace tei="http://www.tei-c.org/ns/1.0";



declare variable $dsk-textgrid:name-pattern := '(.){6}\.\d\.xml$';



declare function dsk-textgrid:file-name($tei as element(tei:TEI)) as xs:string {
  replace(xmldb:decode(util:document-name($tei)), $dsk-textgrid:name-pattern, '')
};



declare function dsk-textgrid:image-name($tei as element(tei:TEI)) as xs:string {
  ($conf:data//file:file[starts-with(@name, dsk-textgrid:file-name($tei)) and ends-with(@name, 'jpg')]/@name/string())[1]
};



declare function dsk-textgrid:html-name($tei as element(tei:TEI)) as xs:string {
  concat(dsk-textgrid:file-name($tei), '.html')
};



declare function dsk-textgrid:json-name($tei as element(tei:TEI)) as xs:string {
  concat(dsk-textgrid:file-name($tei), '.json')
};
