// Copyright 2002-2013, University of Colorado

/**
 * Bootstrap "Reset All" button wrapped in a DOM node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var DOM = require( "SCENERY/nodes/DOM" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );

  /**
   * @param {Function} callback
   * @constructor
   */
  function ResetAllButtonNode( callback ) {

    // dynamically create a DOM reset-all button
    var $button = $( '<button class="btn btn-warning reset-all-button"><i class="icon-refresh icon-2x"></i></button>' );
    $button.bind( 'click', callback );
    $button.bind( 'touchstart', callback );

    DOM.call( this, $button[0] );
  }

  Inheritance.inheritPrototype( ResetAllButtonNode, DOM );

  return ResetAllButtonNode;
} );