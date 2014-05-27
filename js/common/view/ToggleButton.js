// Copyright 2002-2013, University of Colorado Boulder

//TODO merge into sun.ToggleButton, see https://github.com/phetsims/sun/issues/32
/**
 * A toggle button changes it's on/off state when pressed.
 * Can optionally be configured as a 'momentary' button, which is on while pressed, off when released.
 * Origin is at the upper-left of the bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param unpressedImage
   * @param pressedImage
   * @param disabledImage
   * @param {Property<Boolean>} onProperty
   * @param {Property<Boolean>} enabledProperty
   * @param {*} options
   * @constructor
   */
  function ToggleButton( unpressedImage, pressedImage, disabledImage, onProperty, enabledProperty, options ) {

    options = _.extend( { onWhilePressed: false }, options );

    var thisButton = this;
    Node.call( this );

    var imageNode = new Image( unpressedImage );
    thisButton.addChild( imageNode );

    onProperty.link( function( on ) {
      if ( enabledProperty.get() ) {
        imageNode.setImage( on ? pressedImage : unpressedImage );
      }
    } );

    enabledProperty.link( function( enabled ) {
      if ( enabled ) {
        imageNode.setImage( onProperty.get() ? pressedImage : unpressedImage );
        thisButton.cursor = 'pointer';
      }
      else {
        imageNode.setImage( disabledImage );
        thisButton.cursor = 'default';
        onProperty.set( false );
      }
    } );

    if ( options.onWhilePressed ) {
      // momentary button, on while pressed, off when released
      thisButton.addInputListener( new DownUpListener( {
        down: function() {
          onProperty.set( enabledProperty.get() );
        },
        up: function() {
          onProperty.set( false );
        }
      } ) );
    }
    else {
      // toggle button, changes its state when fired
      thisButton.addInputListener( new ButtonListener( {
        fire: function() {
          onProperty.set( !onProperty.get() && enabledProperty.get() );
        }
      } ) );
    }
  }

  return inherit( Node, ToggleButton );
} );
