xquery version "3.0";



module namespace conf="http://semtonotes.github.io/SemToNotes/conf";



(: db :)
declare variable $conf:pswd := 'd5xp3ST4c';
declare variable $conf:db := collection('xmldb:exist://db/TextGridExport');



(: request :)
declare variable $conf:request-root := './';
declare variable $conf:noscript := request:get-parameter('noscript', 'false');



(: data :)
declare variable $conf:data := system:as-user('admin', $conf:pswd,
    file:directory-list('C:\wamp\www\GitHub\eXist\webapp\DigitaleSchriftkunde\img\', '*.*')
);
declare variable $conf:textgrid-tgl-file-names := system:as-user('admin', $conf:pswd,
    file:directory-list('C:\wamp\www\GitHub\eXist\webapp\TextGridExport\', '*.*')
);


declare function conf:html-head() {

<head xmlns="http://www.w3.org/1999/xhtml">
  <meta charset="utf-8"/>
  <link rel="stylesheet" type="text/css" href="./style/bayhsta.css"/>
  <link rel="stylesheet" type="text/css" href="./style/dsk.css"/>
  <!--script src="./lib/raphael/raphael.js"></script>
  <script src="../../../../GitHub/HKIKoeln/SemToNotes/client/lib/closure-library/closure/goog/base.js"></script>
  <script src="./client/deps.js"></script-->
  <script src="./lib/DigitaleSchriftkunde.js"></script>
  <script type="text/javascript">
    goog.require('dsk');
  </script>
</head>

};


declare function conf:footer() {

<footer xmlns="http://www.w3.org/1999/xhtml">
  <div class="footer-wrapper" id="copyright"><p>Copyright &#169; 1999 - 2014 Generaldirektion der Staatlichen Archive Bayerns</p></div>
</footer>

};
