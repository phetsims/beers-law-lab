// Copyright 2002-2013, University of Colorado

/**
 * Bootstrap button wrapped in a DOM node.
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
  function ButtonNode( text, callback ) {

    var $button = $( '<button class="btn"><p style="font: 16px arial;">' + text + '</p></button>' );
    $button.bind( 'click', callback );

    DOM.call( this, $button[0] );
  }

  Inheritance.inheritPrototype( ButtonNode, DOM );

  return ButtonNode;
} );