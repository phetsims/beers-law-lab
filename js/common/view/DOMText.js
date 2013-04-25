// Copyright 2002-2013, University of Colorado

//TODO delete this when it's supported by Text node
/**
 * Temporary implementation of DOM-based text, until it is supported by Text node.
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  // imports
  var DOM = require( "SCENERY/nodes/DOM" );
  var inherit = require( "PHET_CORE/inherit" );

  function DOMText( text, options ) {

    var thisNode = this;

    var $element = $( '<span>' );
    DOM.call( thisNode, $element[0], options );

    if ( options.font ) { $element.css( "font", options.font ); }
    if ( options.fill ) { $element.css( "fill", options.fill ); }

    this._text = text;
    this.setText = function ( text ) {
      if ( text !== this._text ) {
        this._text = text;
        $element.html( text );
        thisNode.invalidateDOM();
      }
    };
    this.setText( text );
  }

  inherit( DOMText, DOM );

  return DOMText;
} );
