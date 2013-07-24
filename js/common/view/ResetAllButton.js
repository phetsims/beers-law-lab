// Copyright 2002-2013, University of Colorado Boulder

//TODO This should eventually replace sun.ResetAllButton
/**
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BLLImages = require( 'common/BLLImages' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PushButton = require( 'SUN/PushButton' );

  function ResetAllButton( callback, options ) {
    PushButton.call( this,
      new Image( BLLImages.getImage( 'reset_button_up.png' ) ),
      new Image( BLLImages.getImage( 'reset_button_over.png' ) ),
      new Image( BLLImages.getImage( 'reset_button_down.png' ) ),
      new Image( BLLImages.getImage( 'reset_button_disabled.png' ) ),
      callback, options );
  }

  return inherit( PushButton, ResetAllButton );
} );