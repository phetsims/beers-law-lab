// Copyright 2002-2013, University of Colorado Boulder

/**
 * A toggle button changes it's on/off state when pressed.
 * Can optionally be configured as a 'momentary' button, which is on while pressed, off when released.
 * Origin is at the upper-left of the bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param unpressedImage
   * @param pressedImage
   * @param disabledImage
   * @param {Property<Boolean>} on
   * @param {Property<Boolean>} enabled
   * @param {*} options
   * @constructor
   */
  function ToggleButton( unpressedImage, pressedImage, disabledImage, on, enabled, options ) {

    options = _.extend( { onWhilePressed: false }, options );

    var thisButton = this;
    Node.call( this );

    var imageNode = new Image( unpressedImage );
    thisButton.addChild( imageNode );

    on.link( function( on ) {
      if ( enabled.get() ) {
        imageNode.setImage( on ? pressedImage : unpressedImage );
      }
    } );

    enabled.link( function( enabled ) {
      if ( enabled ) {
        imageNode.setImage( on.get() ? pressedImage : unpressedImage );
        thisButton.cursor = 'pointer';
      }
      else {
        imageNode.setImage( disabledImage );
        thisButton.cursor = 'default';
        on.set( false );
      }
    } );

    if ( options.onWhilePressed ) {
      // momentary button, on while pressed, off when released
      thisButton.addInputListener( new DownUpListener( {
        down: function( event ) {
          on.set( enabled.get() );
        },
        up: function( event ) {
          on.set( false );
        }
      } ) );
    }
    else {
      // toggle button, changes its state when fired
      thisButton.addInputListener( new ButtonListener( {
        fire: function() {
          on.set( !on.get() && enabled.get() );
        }
      } ) );
    }
  }

  inherit( Node, ToggleButton );

  return ToggleButton;

} );
