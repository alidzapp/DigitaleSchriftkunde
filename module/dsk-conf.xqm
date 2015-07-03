xquery version "3.0";



module namespace conf="http://semtonotes.github.io/SemToNotes/conf";



(: db :)
declare variable $conf:pswd := 'admin';
declare variable $conf:db := collection('xmldb:exist://db/TextGridExport');
declare variable $conf:exist-home := 'C:\Users\Archivar\Desktop\eXist\';



(: request :)
declare variable $conf:request-root := './';
declare variable $conf:noscript := request:get-parameter('noscript', 'false');



(: data :)
declare variable $conf:data := system:as-user('admin', $conf:pswd,
    file:directory-list(concat($conf:exist-home, 'webapp\DigitaleSchriftkunde\img\'), '*.*')
);
declare variable $conf:textgrid-tgl-file-names := system:as-user('admin', $conf:pswd,
    file:directory-list(concat($conf:exist-home, 'webapp\TextGridExport\'), '*.*')
);



(: mappings :)
declare function conf:word($word as xs:string) {
  let $m := map {
      'BayHStA' := 'Bayerisches Hauptstaatsarchiv',
      'StA Amberg' := 'Staatsarchiv Amberg',
      'StA Augsburg' := 'Staatsarchiv Augsburg',
      'StA Bamberg' := 'Staatsarchiv Bamberg',
      'StA Coburg' := 'Staatsarchiv Coburg',
      'StA Landshut' := 'Staatsarchiv Landshut',
      'StA München' := 'Staatsarchiv München',
      'StA Nürnberg' := 'Staatsarchiv Nürnberg',
      'StA Würzburg' := 'Staatsarchiv Würzburg'
    }
  return
    if (map:contains($m, $word)) then $m($word)
    else $word
};



declare function conf:html-head() {

<head xmlns="http://www.w3.org/1999/xhtml">
  <meta charset="utf-8"/>
  <!--[if lt IE 9]>
    <script src="./lib/html5shiv.min.js"></script>
    <script src="./lib/respond.min.js"></script>
  <![endif]-->
  <link rel="stylesheet" type="text/css" href="./style/bayhsta.css"/>
  <link rel="stylesheet" type="text/css" href="./style/dsk.css"/>
  <!--script src="../../../../GitHub/HKIKoeln/SemToNotes/client/lib/closure-library/closure/goog/base.js"></script>
  <script src="./client/deps.js"></script-->
  <script src="./lib/DigitaleSchriftkunde.js"></script>
  <script type="text/javascript">
    goog.require('dsk');
  </script>
</head>

};


declare function conf:footer() {

<footer xmlns="http://www.w3.org/1999/xhtml">
  <div class="footer-wrapper" id="copyright">
    <p>
      <span>Copyright &#169; 1999 - 2015 Generaldirektion der Staatlichen Archive Bayerns</span>
      <span>&#160;|&#160;</span>
      <span><a href="http://www.gda.bayern.de/impressum/">Impressum</a></span>
      <span>&#160;|&#160;</span>
      <span><a href="./about.html">Über dieses Angebot</a></span>
    </p>
  </div>
</footer>

};
