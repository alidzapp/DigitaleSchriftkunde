xquery version "3.0";



module namespace dsk-about="http://semtonotes.github.io/SemToNotes/dsk-about";




import module namespace conf="http://semtonotes.github.io/SemToNotes/conf"
  at '../module/dsk-conf.xqm';



declare function dsk-about:render() {

<html xmlns="http://www.w3.org/1999/xhtml">
{ conf:html-head() }
<body>
  <div id="container">
    <div class="wrapper">
      <div id="about-menu">
        <span class="preselection">Digitale Schriftkunde</span>
        <p><a href="./index.html">Startseite</a></p>
        <p><a href="./liste.html">Zu den Schriftbeispielen</a></p>
        <p>&#160;</p>
        <a href="http://www.gda.bayern.de/"><img src="./icon/bayhsta.gif"/></a>
        <p><a href="http://www.gda.bayern.de/impressum/">Impressum</a></p>
      </div>
      <header>
        <div id="head">
          <div id="title">
            <h1><a href="./index.html">&lt;</a> Digitale Schriftkunde</h1>
          </div>
        </div>
      </header>
      <div id="main">
        <div id="about-content">
          <p>&#160;</p>
          <ul>
            <p><a href="#zum-projekt">Zum Projekt</a></p>
            <p><a href="#archive-und-schriftkunde">Archive und Schriftkunde</a></p>
            <p><a href="#was-bietet-die-digitale-schriftkunde">Was bietet die Digitale Schriftkunde?</a></p>
            <p><a href="#der-entzifferungsmodus">Der Entzifferungsmodus</a></p>
            <p><a href="#der-transkriptionsmodus">Der Transkriptionsmodus</a></p>
            <p><a href="#die-funktion-schreiberhaende">Die Funktion "Schreiberhände"</a></p>
            <p><a href="#projektteam">Projektteam</a></p>
            <p><a href="#technisches">Technisches</a></p>
          </ul>
          <p>&#160;</p>

          <h2 id="zum-projekt" class="h1">Zum Projekt</h2>
          <p>Das Onlineangebot "Digitale Schriftkunde" wird von den Staatlichen Archiven Bayerns bereitgestellt und ist 2013 und 2014 von der Generaldirektion der Staatlichen Archive Bayerns unter Mitarbeit des Bayerischen Hauptstaatsarchivs sowie der Staatsarchive Amberg, Augsburg, Bamberg, Coburg, Landshut, München, Nürnberg und Würzburg erarbeitet worden.</p>
          <p>Das Projekt wurde durch Mittel des Staatsministeriums für Bildung und Kultus, Wissenschaft und Kunst ermöglicht. Für die Unterstützung im Vorfeld bedanken wir uns außerdem bei Frau Prof. Dr. Irmgard Fees, Lehrstuhl für Historische Grundwissenschaften und Historische Medienkunde, und Frau Prof. Dr. Claudia Märtl, Lehrstuhl für mittelalterliche Geschichte, beide LMU München.</p>
          <p>Wir haben uns um eine sorgfältige Bearbeitung der hier präsentierten Stücke und verlässliche Transkriptionen bemüht. Sollten Ihnen trotzdem Fehler oder Versäumnisse auffallen, lassen Sie es uns bitte wissen. Das Angebot ist zudem so angelegt, dass es zukünftig mit weiteren Lesebeispielen ausgebaut und um weitere Funktionen ergänzt werden kann. Über Hinweise, Anregungen und konstruktive Kritik freuen wir uns.</p>

          <h2 id="archive-und-schriftkunde">Archive und Schriftkunde</h2>
          <p>Wer sich fundiert mit der historischen Überlieferung beschäftigen möchte, sei es für wissenschaftliche, heimatkundliche oder genealogische Forschung, kommt nicht umhin, sich mit historischen Handschriften vertraut zu machen und sie lesen zu lernen. Dass immer mehr Quellenbestände inzwischen auch in digitalisierter Form verfügbar werden, ändert daran gar nichts, im Gegenteil – auch diese wollen und müssen erst einmal entziffert werden. Der Weg in die Archive führt auf die vielen Ausprägungen der "deutschen Schrift" vom späten Mittelalter bis in die erste Hälfte des 20. Jahrhunderts – von den gotischen Urkundenschriften und Kanzleikursiven des 13. bis 15. Jahrhunderts über die Kurrentschriften der Frühen Neuzeit bis zur "Sütterlin", der deutschen Schul- und Musterschrift seit 1915. Er führt aber auch auf lateinische Schriften und Texte, vor allem bei allen Forschungen zur mittelalterlichen Geschichte, aber auch zu allen Fragen der Kirchen- und Klostergeschichte. Die akademische Lehre der Paläographie und das von ihr entwickelte Instrumentarium der Schriftbeschreibung und Entzifferung haben sich hauptsächlich auf die Schriften des Mittelalters fokussiert und dabei vor allem die Herrscherurkunden und die Handschriften der Skriptorien in den Blick genommen. Weit dünner gesät sind Lehrmaterialien, die auch die Schriften seit 1500 adäquat mitbehandeln und auch die Dokumente des Verwaltungsalltags abdecken, für die die Forscher in den Lesesälen den größten Teil ihrer Zeit aufwenden. Das Fachwissen, mit dem sich diese Lücke schließen lässt, wird nicht zuletzt in den Archiven selbst gepflegt und gelehrt. In der Archivarsausbildung der Bayerischen Archivschule bzw. des Fachbereichs Archiv- und Bibliothekswesen an der Fachhochschule für öffentliche Verwaltung und Rechtspflege in Bayern etwa bilden die deutsche und lateinische Paläographie nach wie vor Ausbildungsschwerpunkte. Mit der "Deutsche Schriftkunde der Neuzeit" von Elisabeth Noichl und Christa Schmeißer (2007) haben die Staatlichen Archive Bayerns bereits ein quellenbasiertes Übungsbuch vorgelegt.</p> 

          <h2 id="was-bietet-die-digitale-schriftkunde">Was bietet die Digitale Schriftkunde?</h2>
          <p>Mit diesem Angebot möchten wir daran anknüpfen, aber auch den nächsten Schritt in die digitale Welt machen: Deshalb soll es zum einen einen zeitgemäßen Einstieg in die Schriftkunde bieten, der von der Flexibilität des digitalen Mediums lebt: Wir haben uns bemüht, Text-Bild-Ansichten so umzusetzen, dass Leseübungen am Bildschirm komfortabel möglich werden. Im Zentrum steht immer die Abbildung des Archivales. Die verschiedenen Text- und Markierungsfunktionen, die wir umgesetzt haben (siehe unten), können Sie dann ganz nach Wunsch verschieben und flexibel zu- oder abschalten. Nach etwas Ausprobieren haben Sie, so hoffen wir, die Bildschirmaufteilung gefunden, in der Ihnen das Entziffern am leichtesten fällt. Die Schriftbeispiele sind nach ihrem Schwierigkeitsgrad kategorisiert und können so sortiert und angewählt werden. Wer möchte, kann mit leichten Beispielen anfangen und sich zu den schwersten Stücken durcharbeiten.</p>
          <p>Zum zweiten soll Schriftkunde hier nicht als akademische Schriftgeschichte und -analyse betrieben werden, sondern wir möchten zeigen, wie man typische Quellenbeispiele aus der archivischen Überlieferung liest. Diese können durchaus grafisch ansprechend oder gar prächtig ausfallen, sind in Layout, Sprache und im Schriftstil aber doch normalerweise Produkte einer zweckgebundenen, verwaltenden oder rechtssetzenden Schriftlichkeit. Die Stücke sind deswegen zusätzlich nach der hergebrachten archivwissenschaftlichen Quellentypologie kategorisiert, und wir haben uns bemüht, die wichtigsten Überlieferungsbildner und die verschiedenen regionalen Überlieferungslandschaften Bayerns zu berücksichtigen, soweit dies im Rahmen einer begrenzten Auswahl möglich war. In diesem Sinne dienen auch die kurzen Kommentare zu den Schriftbeispielen einer ersten Einordnung der Stücke in ihren Entstehungs- und Funktionszusammenhang. Indem die schriftkundliche Beschreibung mit der archivischen Einordnung verbunden wird, soll, soweit das in der Kürze möglich ist, die Frage beantwortet werden: Warum wurde dieses Schriftstück gerade so, und nicht anders, geschrieben?</p>
          <p>Die Arbeit mit handgeschriebenen historischen Quellen funktioniert erfahrungsgemäß am besten in zwei Schritten: Zunächst geht es darum, eine ungewohnte Schrift verlässlich entziffern zu lernen. Erst im zweiten Schritt kann man daran gehen, ein Quellenstück in einen originalgetreuen, aber auch gut lesbaren Text zu übertragen, der dann auswertbar wird. Diesen Schritten versuchen wir, mit den beiden alternativ oder parallel nutzbaren Modi "Entzifferung" und "Transkription" gerecht zu werden:</p>

          <h2 id="der-entzifferungsmodus">Der Entzifferungsmodus</h2>
          <p>Die Übertragung ist in diesem Modus strikt buchstabengetreu, um die Entzifferung Stück für Stück selbst üben und nachvollziehen zu können. Groß- und Kleinschreibung sind strikt vorlagengetreu übernommen, ebenso die Zeichensetzung. Was vom Schreiber abgekürzt wurde, ist immer durch runde Klammern gekennzeichnet. Im Entzifferungsmodus steht Ihnen zusätzlich die Funktion "Text-Bild-Verknüpfung" zur Verfügung: Wenn Sie sie zuschalten, erscheint ein Rahmen, den Sie zeilenweise über die Vorlage verschieben können. Die zugehörige Passage der Entzifferung wird entsprechend farbig hervorgehoben, so dass Sie sich leicht in der Vorlage orientieren und sie sich Stück für Stück erarbeiten können.</p>

          <h2 id="der-transkriptionsmodus">Der Transkriptionsmodus</h2>
          <p>Im Transkriptionsmodus bietet wir Ihnen einen weitgehend originalgetreuen, aber behutsam nach modernen Lesegewohnheiten normalisierten Quellentext, wie er etwa in historischen Editionen üblich ist: Für Quellentexte vor 1800 wird außer an Satzanfängen und für Orts- und Personennamen immer klein geschrieben, eindeutige Abkürzungen sind ohne Kennzeichnung aufgelöst, Satzzeichen werden sinngemäß gesetzt. In lateinischen Texten ist die Verwendung von u und v normalisiert, ebenso in deutschen Texten nach 1450: uia wird transkribiert als "via", vrbs als "urbs", aus vnd allem andern geuolgen wird "und allem andern gevolgen". Angewandt wurden hier die jeweiligen Transkriptionsregeln, die auch für den Unterricht und die Prüfungen in der Bayerischen Archivschule gültig sind.</p>

          <h2 id="die-funktion-schreiberhaende">Die Funktion "Schreiberhände"</h2>
          <p>Bei einem Teil der Beispiele haben wir zusätzlich eine experimentelle Markierungsfunktion umgesetzt: Die Schriftanteile unterschiedlicher Schreiber erscheinen sowohl in der Markierung des Originals als auch in Entzifferung und Transkription in korrespondierenden Farben. Vor allem bei den jüngeren Stücken aus behördlichen Vorgängen möchten wir so die Entstehungs- und Bearbeitungsschritte eines Schriftstücks anschaulich machen und einen ersten Einstieg in die Analyse aktenkundlicher Zusammenhänge bieten.</p>

          <h2 id="projektteam">Projektteam</h2>
          <p><strong>Projektteam Deutsche Schriftkunde</strong></p>
          <p>Projektleitung und Redaktion: Susanne Wolf</p>
          <p>Wissenschaftliche Bearbeitung, Transkriptionen: Ellen Bošnjak, Magdalena Weileder</p>
          <p>Mitarbeit bei der Textredaktion: Sabine Frauenreuther, Nicola Humphreys, Elisabeth Noichl, Till Strobel</p>
          <p><strong>Projektteam Lateinische Schriftkunde</strong></p>
          <p>Projektleitung und Redaktion: Julian Holzapfl</p>
          <p>Wissenschaftliche Bearbeitung, Transkriptionen: Ullrich Lindemann, Katharina Wolff</p>
          <p>Mitarbeit bei der Textredaktion: Hannah Hien, Christine Kofer</p>
          <p>&#160;</p>
          <p>Technische Umsetzung, Webdesign: Jochen Graf</p>

          <h2 id="technisches">Technisches</h2>
          <p>Für die Erstellung des Angebots wurde die kollaborative Transkriptionsplattform <a target="_blank" href="https://www.textgrid.de/en/">TextGrid</a> verwendet. Die Textauszeichnung sowie die Text-Bild-Verknüpfungen in XML basieren auf Elementen der <a target="_blank" href="http://www.tei-c.org/">Text Encoding Initiative (TEI)</a>.</p>

        </div>
      </div>
      { conf:footer() }
    </div>
  </div>
</body>
</html>

};