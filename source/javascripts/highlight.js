/*!
 * Copyright (C) 2007, 2008 gnombat@users.sourceforge.net
 * License: http://shjs.sourceforge.net/doc/gplv3.html
 */
function sh_highlightDocument(){var a=document.getElementsByTagName("pre"),b,c,d;for(var e=-1,f=a.length;++e<f;){b=a[e],d=sh_getClasses(b),c="";for(var g=-1,h=d.length;++g<h;){c=d[g].replace("sh_","");if(!!c&&!!sh_languages[c]){sh_highlightElement(b,sh_languages[c]);break}}}}function sh_highlightElement(a,b){sh_addClass(a,"sh_sourcecode");var c=[],d=sh_extractTags(a,c),e=sh_highlightString(d,b),f=sh_mergeTags(c,e),g=sh_insertTags(f,d);while(a.hasChildNodes())a.removeChild(a.firstChild);a.appendChild(g)}function sh_isEmailAddress(a){return/^mailto:/.test(a)?!1:a.indexOf("@")!==-1}function sh_setHref(a,b,c){var d=c.substring(a[b-2].pos,a[b-1].pos);d.length>=2&&d.charAt(0)==="<"&&d.charAt(d.length-1)===">"&&(d=d.substr(1,d.length-2)),sh_isEmailAddress(d)&&(d="mailto:"+d),a[b-2].node.href=d}function sh_konquerorExec(a){var b=[""];return b.index=a.length,b.input=a,b}function sh_highlightString(a,b){if(/Konqueror/.test(navigator.userAgent)&&!b.konquered){for(var c=-1,d=b.length;++c<d;)for(var e=-1,f=b[c].length;++e<f;){var g=b[c][e][0];g.source==="$"&&(g.exec=sh_konquerorExec)}b.konquered=!0}var h=document.createElement("a"),i=document.createElement("span"),j=[],k=0,l=[],m=0,n=null,o=function(b,c){var d=b.length;if(d===0)return;if(!c){var e=l.length;if(e!==0){var f=l[e-1];f[3]||(c=f[1])}}if(n!==c){n&&(j[k++]={pos:m},n==="sh_url"&&sh_setHref(j,k,a));if(c){var g;c==="sh_url"?g=h.cloneNode(!1):g=i.cloneNode(!1),g.className=c,j[k++]={node:g,pos:m}}}m+=d,n=c},p=/\r\n|\r|\n/g;p.lastIndex=0;var q=a.length;while(m<q){var r=m,s,t,u=p.exec(a);u===null?(s=q,t=q):(s=u.index,t=p.lastIndex);var v=a.substring(r,s),w=[];for(;;){var x=m-r,y,z=l.length;z===0?y=0:y=l[z-1][2];var A=b[y],B=A.length,C=w[y];C||(C=w[y]=[]);var D=null,E=-1;for(var F=0;F<B;F++){var G;if(F<C.length&&(C[F]===null||x<=C[F].index))G=C[F];else{var H=A[F][0];H.lastIndex=x,G=H.exec(v),C[F]=G}if(G!==null&&(D===null||G.index<D.index)){D=G,E=F;if(G.index===x)break}}if(D===null){o(v.substring(x),null);break}D.index>x&&o(v.substring(x,D.index),null);var I=A[E],J=I[1],K;if(J instanceof Array)for(var L=-1,d=J.length;++L<d;)K=D[L+1],o(K,J[L]);else K=D[0],o(K,J);switch(I[2]){case-1:break;case-2:l.pop();break;case-3:l.length=0;break;default:l.push(I)}}n&&(j[k++]={pos:m},n==="sh_url"&&sh_setHref(j,k,a),n=null),m=t}return j}function sh_getClasses(a){var b=[],c=a.className;if(c&&c.length>0){var d=c.split(" ");for(var e=-1,f=d.length;++e<f;)d[e].length>0&&b.push(d[e])}return b}function sh_addClass(a,b){var c=sh_getClasses(a);for(var d=-1,e=c.length;++d<e;)if(b.toLowerCase()===c[d].toLowerCase())return;c.push(b),a.className=c.join(" ")}function sh_extractTagsFromNodeList(a,b){var c=a.length;for(var d=0;d<c;d++){var e=a.item(d);switch(e.nodeType){case 1:if(e.nodeName.toLowerCase()==="br"){var f;/MSIE/.test(navigator.userAgent)?f="\r":f="\n",b.text.push(f),b.pos++}else b.tags.push({node:e.cloneNode(!1),pos:b.pos}),sh_extractTagsFromNodeList(e.childNodes,b),b.tags.push({pos:b.pos});break;case 3:case 4:b.text.push(e.data),b.pos+=e.length}}}function sh_extractTags(a,b){var c={};return c.text=[],c.tags=b,c.pos=0,sh_extractTagsFromNodeList(a.childNodes,c),c.text.join("")}function sh_mergeTags(a,b){var c=a.length;if(c===0)return b;var d=b.length;if(d===0)return a;var e=[],f=0,g=0;while(f<c&&g<d){var h=a[f],i=b[g];h.pos<=i.pos?(e.push(h),f++):(e.push(i),b[g+1].pos<=h.pos?(g++,e.push(b[g]),g++):(e.push({pos:h.pos}),b[g]={node:i.node.cloneNode(!1),pos:h.pos}))}while(f<c)e.push(a[f]),f++;while(g<d)e.push(b[g]),g++;return e}function sh_insertTags(a,b){var c=document,d=document.createDocumentFragment(),e=0,f=a.length,g=0,h=b.length,i=d;while(g<h||e<f){var j,k;e<f?(j=a[e],k=j.pos):k=h;if(k<=g){if(j.node){var l=j.node;i.appendChild(l),i=l}else i=i.parentNode;e++}else i.appendChild(c.createTextNode(b.substring(g,k))),g=k}return d};

// languages, only js, css, html, ruby here, go to http://shjs.sourceforge.net/lang/ get more.
var sh_languages={};
sh_languages.javascript=[[[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g,"sh_keyword",-1],[/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g,["sh_symbol","sh_normal","sh_symbol"],-1],[/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g,["sh_number","sh_normal","sh_symbol"],-1],[/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g,["sh_normal","sh_symbol"],-1],[/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g,"sh_regexp",-1],[/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g,"sh_number",-1],[/"/g,"sh_string",10],[/'/g,"sh_string",11],[/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1],[/\{|\}/g,"sh_cbracket",-1],[/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g,"sh_predef_var",-1],[/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g,"sh_predef_func",-1],[/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g,"sh_function",-1]],[[/$/g,null,-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",5]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/$/g,null,-2]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/"/g,"sh_string",-2],[/\\./g,"sh_specialchar",-1]],[[/'/g,"sh_string",-2],[/\\./g,"sh_specialchar",-1]]],

sh_languages.html=[[[/<\?xml/g,"sh_preproc",1,1],[/<!DOCTYPE/g,"sh_preproc",3,1],[/<!--/g,"sh_comment",4],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",5,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",5,1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",4]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]]],

sh_languages.css=[[[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/(?:\.|#)[A-Za-z0-9_ \-]+/g,"sh_selector",-1],[/\{/g,"sh_cbracket",10,1],[/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1]],[[/$/g,null,-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",5]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/$/g,null,-2]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\}/g,"sh_cbracket",-2],[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/[A-Za-z0-9_-]+[ \t]*:/g,"sh_property",-1],[/[.%A-Za-z0-9_-]+/g,"sh_value",-1],[/#(?:[A-Za-z0-9_]+)/g,"sh_string",-1]]],

sh_languages.ruby=[[[/\b(?:require)\b/g,"sh_preproc",-1],[/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g,"sh_number",-1],[/"/g,"sh_string",1],[/'/g,"sh_string",2],[/</g,"sh_string",3],[/\/[^\n]*\//g,"sh_regexp",-1],[/(%r)(\{(?:\\\}|#\{[A-Za-z0-9]+\}|[^}])*\})/g,["sh_symbol","sh_regexp"],-1],[/\b(?:alias|begin|BEGIN|break|case|defined|do|else|elsif|end|END|ensure|for|if|in|include|loop|next|raise|redo|rescue|retry|return|super|then|undef|unless|until|when|while|yield|false|nil|self|true|__FILE__|__LINE__|and|not|or|def|class|module|catch|fail|load|throw)\b/g,"sh_keyword",-1],[/(?:^\=begin)/g,"sh_comment",4],[/(?:\$[#]?|@@|@)(?:[A-Za-z0-9_]+|'|\"|\/)/g,"sh_type",-1],[/[A-Za-z0-9]+(?:\?|!)/g,"sh_normal",-1],[/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1],[/(#)(\{)/g,["sh_symbol","sh_cbracket"],-1],[/#/g,"sh_comment",5],[/\{|\}/g,"sh_cbracket",-1]],[[/$/g,null,-2],[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/$/g,null,-2],[/\\(?:\\|')/g,null,-1],[/'/g,"sh_string",-2]],[[/$/g,null,-2],[/>/g,"sh_string",-2]],[[/^(?:\=end)/g,"sh_comment",-2]],[[/$/g,null,-2]]];
sh_languages['sh'] = [ [ [ /\b(?:import)\b/g, 'sh_preproc', -1 ], [ /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, 'sh_number', -1 ], [ /\\"|\\'/g, 'sh_normal', -1 ], [ /"/g, 'sh_string', 1 ], [ /'/g, 'sh_string', 2 ], [ /function[ \t]+(?:[A-Za-z]|_)[A-Za-z0-9_]*[ \t]*(?:\(\))?|(?:[A-Za-z]|_)[A-Za-z0-9_]*[ \t]*\(\)/g, 'sh_function', -1 ], [ /(?:[A-Za-z]*[-\/]+[A-Za-z]+)+/g, 'sh_normal', -1 ], [ /\b(?:alias|bg|bind|break|builtin|caller|case|command|compgen|complete|continue|declare|dirs|disown|do|done|elif|else|enable|esac|eval|exec|exit|export|false|fc|fg|fi|for|getopts|hash|help|history|if|in|jobs|let|local|logout|popd|printf|pushd|read|readonly|return|select|set|shift|shopt|source|suspend|test|then|times|trap|true|type|typeset|umask|unalias|unset|until|wait|while)\b/g, 'sh_keyword', -1 ], [ /(?:[A-Za-z]|_)[A-Za-z0-9_]*(?==)|\$\{(?:[^ \t]+)\}|\$\((?:[^ \t]+)\)|\$(?:[A-Za-z]|_)[A-Za-z0-9_]*|\$(?:[^ \t]{1})/g, 'sh_variable', -1 ], [ /~|!|%|\^|\*|\(|\)|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\||%%|(?:##){2}(?!#)/g, 'sh_symbol', -1 ], [ /#/g, 'sh_comment', 3 ] ], [ [ /"/g, 'sh_string', -2 ], [ /\\./g, 'sh_specialchar', -1 ] ], [ [ /'/g, 'sh_string', -2 ], [ /\\./g, 'sh_specialchar', -1 ] ], [ [ /$/g, null, -2 ] ] ];
sh_languages['spec'] = [ [ [ /#/g, 'sh_comment', 1 ], [ /^[A-Za-z0-9_-]+:/g, 'sh_keyword', -1 ], [ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, 'sh_url', -1 ], [ /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, 'sh_number', -1 ], [ /\$[A-Za-z0-9_]+/g, 'sh_variable', -1 ], [ /%(?:\{?)[A-Za-z0-9_]+(?:\}?)/g, 'sh_preproc', -1 ] ], [ [ /$/g, null, -2 ] ] ];
sh_languages['sql'] = [ [ [ /\b(?:VARCHAR|TINYINT|TEXT|DATE|SMALLINT|MEDIUMINT|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATETIME|TIMESTAMP|TIME|YEAR|UNSIGNED|CHAR|TINYBLOB|TINYTEXT|BLOB|MEDIUMBLOB|MEDIUMTEXT|LONGBLOB|LONGTEXT|ENUM|BOOL|BINARY|VARBINARY)\b/gi, 'sh_type', -1 ], [ /\b(?:ALL|ASC|AS|ALTER|AND|ADD|AUTO_INCREMENT|BETWEEN|BINARY|BOTH|BY|BOOLEAN|CHANGE|CHECK|COLUMNS|COLUMN|CROSS|CREATE|DATABASES|DATABASE|DATA|DELAYED|DESCRIBE|DESC|DISTINCT|DELETE|DROP|DEFAULT|ENCLOSED|ESCAPED|EXISTS|EXPLAIN|FIELDS|FIELD|FLUSH|FOR|FOREIGN|FUNCTION|FROM|GROUP|GRANT|HAVING|IGNORE|INDEX|INFILE|INSERT|INNER|INTO|IDENTIFIED|IN|IS|IF|JOIN|KEYS|KILL|KEY|LEADING|LIKE|LIMIT|LINES|LOAD|LOCAL|LOCK|LOW_PRIORITY|LEFT|LANGUAGE|MODIFY|NATURAL|NOT|NULL|NEXTVAL|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUTFILE|OR|OUTER|ON|PROCEDURE|PROCEDURAL|PRIMARY|READ|REFERENCES|REGEXP|RENAME|REPLACE|RETURN|REVOKE|RLIKE|RIGHT|SHOW|SONAME|STATUS|STRAIGHT_JOIN|SELECT|SETVAL|SET|TABLES|TERMINATED|TO|TRAILING|TRUNCATE|TABLE|TEMPORARY|TRIGGER|TRUSTED|UNIQUE|UNLOCK|USE|USING|UPDATE|VALUES|VARIABLES|VIEW|WITH|WRITE|WHERE|ZEROFILL|TYPE|XOR)\b/gi, 'sh_keyword', -1 ], [ /"/g, 'sh_string', 1 ], [ /'/g, 'sh_string', 2 ], [ /`/g, 'sh_string', 3 ], [ /#/g, 'sh_comment', 4 ], [ /\/\/\//g, 'sh_comment', 5 ], [ /\/\//g, 'sh_comment', 4 ], [ /\/\*\*/g, 'sh_comment', 11 ], [ /\/\*/g, 'sh_comment', 12 ], [ /--/g, 'sh_comment', 4 ], [ /~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, 'sh_symbol', -1 ], [ /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, 'sh_number', -1 ] ], [ [ /"/g, 'sh_string', -2 ], [ /\\./g, 'sh_specialchar', -1 ] ], [ [ /'/g, 'sh_string', -2 ], [ /\\./g, 'sh_specialchar', -1 ] ], [ [ /`/g, 'sh_string', -2 ], [ /\\./g, 'sh_specialchar', -1 ] ], [ [ /$/g, null, -2 ] ], [ [ /$/g, null, -2 ], [ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, 'sh_url', -1 ], [ /<\?xml/g, 'sh_preproc', 6, 1 ], [ /<!DOCTYPE/g, 'sh_preproc', 8, 1 ], [ /<!--/g, 'sh_comment', 9 ], [ /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, 'sh_keyword', -1 ], [ /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, 'sh_keyword', 10, 1 ], [ /&(?:[A-Za-z0-9]+);/g, 'sh_preproc', -1 ], [ /<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, 'sh_keyword', -1 ], [ /<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, 'sh_keyword', 10, 1 ], [ /@[A-Za-z]+/g, 'sh_type', -1 ], [ /(?:TODO|FIXME|BUG)(?:[:]?)/g, 'sh_todo', -1 ] ], [ [ /\?>/g, 'sh_preproc', -2 ], [ /([^=" \t>]+)([ \t]*)(=?)/g, ['sh_type', 'sh_normal', 'sh_symbol'], -1 ], [ /"/g, 'sh_string', 7 ] ], [ [ /\\(?:\\|")/g, null, -1 ], [ /"/g, 'sh_string', -2 ] ], [ [ />/g, 'sh_preproc', -2 ], [ /([^=" \t>]+)([ \t]*)(=?)/g, ['sh_type', 'sh_normal', 'sh_symbol'], -1 ], [ /"/g, 'sh_string', 7 ] ], [ [ /-->/g, 'sh_comment', -2 ], [ /<!--/g, 'sh_comment', 9 ] ], [ [ /(?:\/)?>/g, 'sh_keyword', -2 ], [ /([^=" \t>]+)([ \t]*)(=?)/g, ['sh_type', 'sh_normal', 'sh_symbol'], -1 ], [ /"/g, 'sh_string', 7 ] ], [ [ /\*\//g, 'sh_comment', -2 ], [ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, 'sh_url', -1 ], [ /<\?xml/g, 'sh_preproc', 6, 1 ], [ /<!DOCTYPE/g, 'sh_preproc', 8, 1 ], [ /<!--/g, 'sh_comment', 9 ], [ /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, 'sh_keyword', -1 ], [ /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, 'sh_keyword', 10, 1 ], [ /&(?:[A-Za-z0-9]+);/g, 'sh_preproc', -1 ], [ /<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, 'sh_keyword', -1 ], [ /<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, 'sh_keyword', 10, 1 ], [ /@[A-Za-z]+/g, 'sh_type', -1 ], [ /(?:TODO|FIXME|BUG)(?:[:]?)/g, 'sh_todo', -1 ] ], [ [ /\*\//g, 'sh_comment', -2 ], [ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, 'sh_url', -1 ], [ /(?:TODO|FIXME|BUG)(?:[:]?)/g, 'sh_todo', -1 ] ] ];
sh_languages['html'] = [
  [
    [
      /<\?xml/g,
      'sh_preproc',
      1,
      1
    ],
    [
      /<!DOCTYPE/g,
      'sh_preproc',
      3,
      1
    ],
    [
      /<!--/g,
      'sh_comment',
      4
    ],
    [
      /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,
      'sh_keyword',
      -1
    ],
    [
      /<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,
      'sh_keyword',
      5,
      1
    ],
    [
      /&(?:[A-Za-z0-9]+);/g,
      'sh_preproc',
      -1
    ],
    [
      /<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,
      'sh_keyword',
      -1
    ],
    [
      /<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,
      'sh_keyword',
      5,
      1
    ]
  ],
  [
    [
      /\?>/g,
      'sh_preproc',
      -2
    ],
    [
      /([^=" \t>]+)([ \t]*)(=?)/g,
      ['sh_type', 'sh_normal', 'sh_symbol'],
      -1
    ],
    [
      /"/g,
      'sh_string',
      2
    ]
  ],
  [
    [
      /\\(?:\\|")/g,
      null,
      -1
    ],
    [
      /"/g,
      'sh_string',
      -2
    ]
  ],
  [
    [
      />/g,
      'sh_preproc',
      -2
    ],
    [
      /([^=" \t>]+)([ \t]*)(=?)/g,
      ['sh_type', 'sh_normal', 'sh_symbol'],
      -1
    ],
    [
      /"/g,
      'sh_string',
      2
    ]
  ],
  [
    [
      /-->/g,
      'sh_comment',
      -2
    ],
    [
      /<!--/g,
      'sh_comment',
      4
    ]
  ],
  [
    [
      /(?:\/)?>/g,
      'sh_keyword',
      -2
    ],
    [
      /([^=" \t>]+)([ \t]*)(=?)/g,
      ['sh_type', 'sh_normal', 'sh_symbol'],
      -1
    ],
    [
      /"/g,
      'sh_string',
      2
    ]
  ]
];
    sh_highlightDocument();
