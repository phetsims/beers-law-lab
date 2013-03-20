// Copyright 2002-2013, University of Colorado

/**
 * A check box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  var Inheritance = require("PHETCOMMON/util/Inheritance" );
  var DOM = require("SCENERY/nodes/DOM" );

  function CheckBoxNode( text, booleanProperty ) {

    // dynamically create a DOM radio button
    var $button = $( '<button class="btn v-button"><i class="icon-check-empty"></i>text</button>' );
    $button.html( text );
    $button.bind( 'click', function() {
      booleanProperty.set( !booleanProperty.get() );
    } );

    DOM.call( this, $button[0] );
  }

  Inheritance.inheritPrototype( CheckBoxNode, DOM );

  return CheckBoxNode;
});