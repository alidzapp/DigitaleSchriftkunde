xquery version "1.0";



module namespace dsk-t="http://semtonotes.github.io/SemToNotes/dsk-transcription";



declare namespace tei="http://www.tei-c.org/ns/1.0";



import module namespace dsk-data="http://semtonotes.github.io/SemToNotes/dsk-data"
    at "./dsk-data.xqm";



declare function dsk-t:common() {

  <xsl:template match="tei:lb">
    <xsl:if test="not(exists(./ancestor::tei:cell)) or exists(./preceding-sibling::tei:lb)">
      <br xmlns="http://www.w3.org/1999/xhtml"/>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:template>

};



declare function dsk-t:metadata($tei as element(tei:TEI)) {

let $xslt := 
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:variable name="labels">
    <labels xmlns="">
      <label element="editor" value="Editor: "/>
      <label element="institution" value="Archiv: "/>
      <label element="collection" value="Bestand: "/>
      <label element="idno" value="Signatur: "/>
      <label element="placeName" value="Ort: "/>
      <label element="date" value="Datum: "/>
      <label element="classCode" value="Schwierigkeitsgrad: "/>
    </labels>
  </xsl:variable>

  <xsl:variable name="tei" select="/"/>

  <xsl:template match="/">
    <xsl:call-template name="idno"/>
    <xsl:call-template name="abstract"/>
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="tei:msIdentifier">
  </xsl:template>
  <xsl:template name="idno">
    <b xmlns="http://www.w3.org/1999/xhtml">
      <xsl:value-of select="$tei//tei:institution/text()"/>
      <xsl:text>,&#160;</xsl:text>
      <xsl:value-of select="$tei//tei:collection/text()"/>
      <xsl:text>&#160;</xsl:text>
      <xsl:value-of select="$tei//tei:idno/text()"/>
    </b>
    <br/>
  </xsl:template>

  <xsl:template match="tei:witness">
  </xsl:template>
  <xsl:template match="tei:abstract">
  </xsl:template>
  <xsl:template name="abstract">
    <b xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates select="$tei//tei:abstract/tei:p"/>
      <xsl:value-of select="$tei//tei:date/text()"/>
      <xsl:text>&#160;(</xsl:text>
      <xsl:value-of select="$tei//tei:placeName/text()"/>
      <xsl:text>)</xsl:text>
    </b>
    <br/>
    <br/>
  </xsl:template>

  <xsl:template match="tei:text">
  </xsl:template>
 
  <xsl:template match="tei:teiHeader">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="tei:titleStmt">
  </xsl:template>
  
  <xsl:template match="tei:classCode">
    <xsl:param name="self" select="local-name(.)"/>
    <div xmlns="http://www.w3.org/1999/xhtml">
      <span class="label">
        <xsl:value-of select="$labels//label[@element=$self]/@value"/>
      </span>
      <span><xsl:apply-templates/></span>
      <div>
        <xsl:attribute name="class">
          <xsl:value-of select="$self"/>
        </xsl:attribute>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:keywords/tei:term">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <span class="label">Archivaliengattung: </span>
      <span><xsl:apply-templates/></span>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:handNotes">
    <div class="handNotes" xmlns="http://www.w3.org/1999/xhtml">
      <span class="label">Schreiberhände: </span><br/>
      <ul>
        <xsl:for-each select="./tei:handNote">
          <li>
            <xsl:value-of select="."/>
            <xsl:text> (</xsl:text>
            <xsl:value-of select="./@n"/>
            <xsl:text>)</xsl:text>
          </li>
        </xsl:for-each>
      </ul>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:editorialDecl/tei:p">
    <div class="editorialDecl" xmlns="http://www.w3.org/1999/xhtml">
      <span><xsl:apply-templates/></span>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:quote">
    <span class="tei_quote" xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates/>
    </span>
    <span class="tooltip" xmlns="http://www.w3.org/1999/xhtml">(Textzitat)</span>
  </xsl:template>

  { dsk-t:common() }

</xsl:stylesheet>

return

if ($tei/@corresp) then
  let $header := $dsk-data:teis[@n = $tei/@corresp]//tei:teiHeader
  let $corresp :=
  <tei:TEI>
    { $header }
    { $tei//tei:text }
    { $tei//tei:back }
  </tei:TEI>
  return
  transform:transform($corresp, $xslt, ())
else 
  transform:transform($tei, $xslt, ())

};



declare function dsk-t:transcription($tei as element(tei:TEI), $type as xs:string) {

let $xslt :=

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
  
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="tei:teiHeader">
  </xsl:template>

  <xsl:template match="tei:body">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="tei:head">
    <h3 xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates/>
      <span class="tooltip">(Überschrift)</span>
    </h3>
  </xsl:template>
  
  <xsl:template match="tei:p">
    <p xmlns="http://www.w3.org/1999/xhtml">
      <span class="tooltip">(Absatz Beginn)</span>
      <xsl:apply-templates/>
      <span class="tooltip">(Absatz Ende)</span>
    </p>
  </xsl:template>
  
  <xsl:template match="tei:pb">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <div class="tei_pb" xmlns="http://www.w3.org/1999/xhtml">
        <span>//</span>
        <span class="tooltip">(Seitenumbruch)</span>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:lb">
    <xsl:if test="./@type != 'empty' and (./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <xsl:if test="not(exists(./ancestor::tei:cell)) or exists(./preceding-sibling::tei:lb)">
        <br xmlns="http://www.w3.org/1999/xhtml"/>
      </xsl:if>
      <xsl:apply-templates/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:lb[@type='orig']">
    <xsl:if test="@type = '{ $type }'">
      <xsl:if test="not(exists(./ancestor::tei:cell)) or exists(./preceding-sibling::tei:lb)">
        <br xmlns="http://www.w3.org/1999/xhtml"/>
      </xsl:if>
      <span class="tei_lb label" xmlns="http://www.w3.org/1999/xhtml">
        <xsl:value-of select="count(./preceding::tei:lb[@type='orig']) + 1"/>
        <xsl:text>&#160;</xsl:text>
      </span>
      <xsl:choose>
        <xsl:when test="((./following-sibling::*)[1])[@place='left']">
          <xsl:apply-templates/>
        </xsl:when>
        <xsl:otherwise>
          <span class="tei_add_left" xmlns="http://www.w3.org/1999/xhtml"></span>
          <xsl:apply-templates/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:lb[@type='reg']">
    <xsl:if test="@type = '{ $type }'">
      <xsl:if test="not(exists(./ancestor::tei:cell)) or exists(./preceding-sibling::tei:lb)">
        <br xmlns="http://www.w3.org/1999/xhtml"/>
      </xsl:if>
      <span class="tei_lb label" xmlns="http://www.w3.org/1999/xhtml">
        <xsl:value-of select="count(./preceding::tei:lb[@type='reg']) + 1"/>
        <xsl:text>&#160;</xsl:text>
      </span>
    </xsl:if>
  </xsl:template>
  
  <!--xsl:template match="tei:choice|tei:orig|tei:reg">
    <span xmlns="http://www.w3.org/1999/xhtml">
      <xsl:attribute name="class">
        <xsl:value-of select="concat('tei_', local-name(.))"/>
      </xsl:attribute>
      <xsl:if test="local-name(.) = 'orig'">
        <xsl:text>(</xsl:text>
      </xsl:if>
      <xsl:if test="local-name(.) = 'reg'">
        <xsl:text> / </xsl:text>
      </xsl:if>
      <xsl:apply-templates/>
      <xsl:if test="local-name(.) = 'orig'">
        <span class="tooltip"> (original)</span>
      </xsl:if>
      <xsl:if test="local-name(.) = 'reg'">
        <span class="tooltip"> (regulär)</span>
        <xsl:text>)</xsl:text>
      </xsl:if>
      <xsl:if test="local-name(.) = 'choice'">
        <span class="tooltip">(Transkription)</span>
      </xsl:if>
    </span>
  </xsl:template-->
  
  <xsl:template match="tei:c[@type='superior']">
    <xsl:param name="left" select="substring-before(., '%')"/>
    <xsl:param name="right" select="substring-after(., '%')"/>
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <xsl:choose>
        <xsl:when test="matches($left, '[a-z]')">
          <svg width=".7em" height="1.2em" xmlns="http://www.w3.org/2000/svg">
            <g>
              <text text-anchor="middle" y="1.2em" x="50%">
                <xsl:value-of select="$left"/>
              </text>
              <text text-anchor="middle" font-size=".7em" y=".8em" x="50%">
                <xsl:value-of select="$right"/>
              </text>
            </g>
          </svg>
        </xsl:when>
        <xsl:otherwise>
          <svg width=".9em" height="1.4em" xmlns="http://www.w3.org/2000/svg">
            <g>
              <text text-anchor="middle" y="1.4em" x="50%">
                <xsl:value-of select="$left"/>
              </text>
              <text text-anchor="middle" font-size=".7em" y=".9em" x="50%">
                <xsl:value-of select="$right"/>
              </text>
            </g>
          </svg>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:c[@type='tab']">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml">&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>
      <xsl:apply-templates/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:seg[@rend='elongata']">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml">
        <xsl:attribute name="class">tei_elongata</xsl:attribute>
        <xsl:apply-templates/>
        <span class="tooltip">(Elongata)</span>
      </span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:foreign">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml">
        <xsl:attribute name="class">tei_foreign</xsl:attribute>
        <xsl:apply-templates/>
      </span>
      <span class="tooltip" xmlns="http://www.w3.org/1999/xhtml">(Wechsel des Schriftsystems)</span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:del">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml">
        <xsl:attribute name="class">tei_del</xsl:attribute>
        <xsl:apply-templates/>
      </span>
      <span class="tooltip" xmlns="http://www.w3.org/1999/xhtml">(getilgt)</span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:add">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <xsl:choose>
        <xsl:when test="./@place = 'above'">
          <span class="tei_add_above" xmlns="http://www.w3.org/1999/xhtml">
            <xsl:apply-templates/>
          </span>
          <!--span class="tooltip tei_add" xmlns="http://www.w3.org/1999/xhtml">(Über der Zeile nachgetragener Text)</span-->
        </xsl:when>
        <xsl:when test="./@place = 'left'">
          <span class="tei_add_left" xmlns="http://www.w3.org/1999/xhtml">
            <xsl:apply-templates/>
          </span>
          <!--span class="tei_add" xmlns="http://www.w3.org/1999/xhtml">(Links nachgetragener Text)</span-->
        </xsl:when>
        <xsl:when test="./@place = 'right'">
          <span class="tei_add_right" xmlns="http://www.w3.org/1999/xhtml">
            <span xmlns="http://www.w3.org/1999/xhtml">&#160;&#160;&#160;&#160;</span>
            <xsl:apply-templates/>
          </span>
          <!--span class="tei_add" xmlns="http://www.w3.org/1999/xhtml">(Rechts nachgetragener Text)</span-->
        </xsl:when>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:handShift">
    <xsl:param name="scribe" select="./@new"/>
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span class="tei_handShift" xmlns="http://www.w3.org/1999/xhtml">
        <xsl:text>(</xsl:text>
        <xsl:value-of select="//tei:handNote[@n=$scribe]/tei:p/text()"/>
        <xsl:text>:) </xsl:text>
        <xsl:text> </xsl:text>
      </span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:hi[@rend='sup']">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span class="superscript" xmlns="http://www.w3.org/1999/xhtml">
        <xsl:apply-templates/>
      </span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:table">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <table xmlns="http://www.w3.org/1999/xhtml">
        <xsl:apply-templates/>
      </table>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:row">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <tr xmlns="http://www.w3.org/1999/xhtml">
        <xsl:apply-templates/>
      </tr>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:cell">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <td xmlns="http://www.w3.org/1999/xhtml">
        <xsl:apply-templates/>
      </td>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:ref">
    <xsl:param name="label" select="."/>
    <xsl:param name="type" select="(./preceding::tei:lb[@type!='empty'])[last()]/@type"/>
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span class="superscript" xmlns="http://www.w3.org/1999/xhtml">
        <xsl:choose>
          <xsl:when test="count(//tei:div[@type=$type]/tei:note[@n=$label]) != 1">
            <span class="error">
              <span>Fußnote '</span>
              <xsl:apply-templates/>
              <span>' fehlt oder kommt mehrmals vor! </span>
            </span>
          </xsl:when>
          <xsl:otherwise>
            <xsl:apply-templates/>
          </xsl:otherwise>
        </xsl:choose>
      </span>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:body//text()">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml" class="hover-text"><xsl:value-of select="translate(., ' ', '&#160;')"/></span>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:anchor">
    <xsl:if test="(./preceding::tei:lb[@type!='empty'])[last()]/@type = '{ $type }'">
      <span xmlns="http://www.w3.org/1999/xhtml">
        <xsl:attribute name="id">
          <xsl:value-of select="@xml:id"/>
        </xsl:attribute>
        <xsl:value-of select="."/>
      </span>
    </xsl:if>
  </xsl:template>

  <!--  ################################
      
      footnotes
  
      ################################  -->  

  <xsl:template match="tei:back">
    <xsl:apply-templates/>
  </xsl:template>

  {

  if ($type = 'orig') then

  <xsl:template match="tei:back/tei:div[@type='orig']">
    <span class="hr" xmlns="http://www.w3.org/1999/xhtml">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>
    <ul xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  else

  <xsl:template match="tei:back/tei:div[@type='reg']">
    <span class="hr" xmlns="http://www.w3.org/1999/xhtml">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>
    <ul xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  }
  
  <xsl:template match="tei:note[@n]">
    <xsl:param name="label" select="@n"/>
    <xsl:param name="type" select="./parent::tei:div/@type"/>
    <xsl:if test="./parent::tei:div[@type = '{ $type }']">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <xsl:choose>
          <xsl:when test="count(//tei:ref[.=$label][((./preceding::tei:lb[@type!='empty'])[last()])[@type=$type]]) != 1">
            <span class="error">
              <span>Referenz '</span>
              <xsl:value-of select="@n"/>
              <span>' fehlt in der </span>
              <xsl:choose>
                <xsl:when test="$type = 'orig'">
                  <xsl:text>Entzifferung</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:text>Transkription</xsl:text>
                </xsl:otherwise>
              </xsl:choose>
              <span> oder kommt mehrmals vor! </span>
            </span>
          </xsl:when>
          <xsl:otherwise>
            <span>
              <xsl:value-of select="@n"/>
            </span>
            <xsl:text>&#160;</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates/>
      </div>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:note">
    <xsl:if test="./parent::tei:div[@type = '{ $type }']">
      <li xmlns="http://www.w3.org/1999/xhtml">
        <xsl:apply-templates/>
      </li>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="tei:quote">
    <span class="tei_quote" xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates/>
    </span>
    <span class="tooltip" xmlns="http://www.w3.org/1999/xhtml">(Textzitat)</span>
  </xsl:template>

</xsl:stylesheet>

return

transform:transform($tei, $xslt, ())

};

