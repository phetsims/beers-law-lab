/**
 * Sets the locale.
 * Look for a query parameter of the form "locale=value", where the format of value is described in RFC 4646.
 * The value of this parameter will be used to override the browser's language.
 * Adapted from http://geekswithblogs.net/PhubarBaz/archive/2011/11/21/getting-query-parameters-in-javascript.aspx
 */
window.phetLocale = (function () {
  var value;
  if ( typeof window != 'undefined' && window.location.search ) {
    // look for first occurrence of "locale" query parameter
    var params = window.location.search.slice( 1 ).split( "&" );
    for ( var i = 0; i < params.length; i++ ) {
      var nameValuePair = params[i].split( "=" );
      if ( nameValuePair[0] === 'locale' ) {
        value = decodeURI( nameValuePair[1] ).toLowerCase();
        break;
      }
    }
  }
  return value;
}()) || "en_us";