// Copyright 2002-2013, University of Colorado

/**
 * A DOM-based button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var DOM = require( "SCENERY/nodes/DOM")
  var Inheritance = require( "PHETCOMMON/util/Inheritance")

  /**
   * @param {String} text
   * @param {Function} callback
   * @constructor
   */
  function DOMButtonNode( text, callback ) {

    // dynamically create a DOM button
    var $button = $( '<button class="btn">text</button>' );
    $button.html( text );
    $button.bind( 'click', callback );

    DOM.call( this, $button[0] );
  }

  Inheritance.inheritPrototype( DOMButtonNode, DOM );

  return DOMButtonNode;
} );