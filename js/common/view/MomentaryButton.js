// Copyright 2002-2013, University of Colorado

/**
 * A momentary button is "on" while pressed, "off" when released.
 * Origin is at the upper-left of the bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLImages = require( "common/BLLImages" );
  var ButtonListener = require( "SCENERY/input/ButtonListener" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );

  /**
   * @param {Property<Boolean>} on
   * @param {Property<Boolean>} enabled
   * @constructor
   */
  function MomentaryButton( on, enabled ) {

    var thisNode = this;
    Node.call( this );

    // images
    var pressedImage = BLLImages.getImage( "momentary_button_pressed.png" );
    var unpressedImage = BLLImages.getImage( "momentary_button_unpressed.png" );
    var pressedDisabledImage = BLLImages.getImage( "momentary_button_pressed_disabled.png" );
    var unpressedDisabledImage = BLLImages.getImage( "momentary_button_unpressed_disabled.png" );

    var imageNode = new Image( unpressedImage );
    thisNode.addChild( imageNode );

    on.link( function( on ) {
      if ( enabled.get() ) {
        imageNode.setImage( on ? pressedImage : unpressedImage );
      }
      else {
        imageNode.setImage( on ? pressedDisabledImage : unpressedDisabledImage );
      }
    } );

    enabled.link( function( enabled ) {
      if ( enabled ) {
        imageNode.setImage( on.get() ? pressedImage : unpressedImage );
        thisNode.cursor = "pointer";
      }
      else {
        imageNode.setImage( on.get() ? pressedDisabledImage : unpressedDisabledImage );
        thisNode.cursor = "default";
      }
    } );

    thisNode.addInputListener( new ButtonListener( {
      down: function( event ) {
        on.set( true && enabled.get() );
      },
      up: function( event ) {
        on.set( false );
      },
      over: function( event ) {
        on.set( false );
      }
    } ) );
  }

  inherit( MomentaryButton, Node );

  return MomentaryButton;

} );
