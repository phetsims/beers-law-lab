// Copyright 2002-2013, University of Colorado

/**
 * A momentary button is "on" while pressed, "off" when released.
 * Origin is at the upper-left of the bounding rectangle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );

  // images
  var pressedImage = require( "image!images/momentary_button_pressed.png" );
  var unpressedImage = require( "image!images/momentary_button_unpressed.png" );
  var pressedDisabledImage = require( "image!images/momentary_button_pressed_disabled.png" );
  var unpressedDisabledImage = require( "image!images/momentary_button_unpressed_disabled.png" );

  /**
   * @param {Property} on (type boolean)
   * @param {Property} enabled (type boolean)
   * @constructor
   */
  function MomentaryButtonNode( on, enabled ) {

    var thisNode = this;
    Node.call( this );

    var imageNode = new Image( unpressedImage );
    thisNode.addChild( imageNode );

    on.addObserver( function ( on ) {
      if ( enabled.get() ) {
        imageNode.setImage( on ? pressedImage : unpressedImage );
      }
      else {
        imageNode.setImage( on ? pressedDisabledImage : unpressedDisabledImage );
      }
    } );

    enabled.addObserver( function ( enabled ) {
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
        down: function () {
          on.set( true && enabled.get() );
        },
        //TODO this isn't fired if you roll off the node and release the mouse
        up: function () {
          on.set( false );
        }
        //TODO cancel?
      } );
  }

  inherit( MomentaryButtonNode, Node );

  return MomentaryButtonNode;

} );
