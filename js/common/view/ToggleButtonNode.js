// Copyright 2002-2013, University of Colorado

//TODO lots in common with MomentaryButtonNode
/**
 * A toggle button changes it's on/off state when pressed.
 * Origin is at the upper-left of the bounding rectangle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLImages = require( "common/BLLImages" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );

  /**
   * @param {Property} on (type boolean)
   * @param {Property} enabled (type boolean)
   * @constructor
   */
  function MomentaryButtonNode( on, enabled ) {

    var thisNode = this;
    Node.call( this );

    // images
    var pressedImage = BLLImages.getImage( "momentary_button_pressed.png" );
    var unpressedImage = BLLImages.getImage( "momentary_button_unpressed.png" );
    var pressedDisabledImage = BLLImages.getImage( "momentary_button_pressed_disabled.png" );
    var unpressedDisabledImage = BLLImages.getImage( "momentary_button_unpressed_disabled.png" );

    var imageNode = new Image( unpressedImage );
    thisNode.addChild( imageNode );

    on.addObserver( function( on ) {
      if ( enabled.get() ) {
        imageNode.setImage( on ? pressedImage : unpressedImage );
      }
      else {
        imageNode.setImage( on ? pressedDisabledImage : unpressedDisabledImage );
      }
    } );

    enabled.addObserver( function( enabled ) {
      if ( enabled ) {
        imageNode.setImage( on.get() ? pressedImage : unpressedImage );
        thisNode.cursor = "pointer";
      }
      else {
        imageNode.setImage( on.get() ? pressedDisabledImage : unpressedDisabledImage );
        thisNode.cursor = "default";
      }
    } );

    thisNode.addInputListener(
        {
          down: function() {
            on.set( !on.get() && enabled.get() );
          }
          //TODO cancel?
        } );
  }

  inherit( MomentaryButtonNode, Node );

  return MomentaryButtonNode;

} );
